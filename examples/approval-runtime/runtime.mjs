import { createHash, randomUUID } from "node:crypto";
import { open, mkdir, readFile, readdir, link, rename, unlink } from "node:fs/promises";
import path from "node:path";

const GATES = new Set(["merge", "deploy", "secrets", "messaging-as-user"]);
const DECISIONS = new Set(["approve", "reject"]);
const ID = /^[a-zA-Z0-9._-]{1,128}$/;

export class RuntimeError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RuntimeError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new RuntimeError(code, message);
}

function jsonValue(value, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    if (seen.has(value)) fail("invalid_json", "Action must not contain cycles");
    seen.add(value);
    const out = value.map((item) => jsonValue(item, seen));
    seen.delete(value);
    return out;
  }
  if (typeof value === "object" && [Object.prototype, null].includes(Object.getPrototypeOf(value))) {
    if (seen.has(value)) fail("invalid_json", "Action must not contain cycles");
    seen.add(value);
    const out = Object.create(null);
    for (const key of Object.keys(value).sort()) out[key] = jsonValue(value[key], seen);
    seen.delete(value);
    return out;
  }
  fail("invalid_json", "Action must contain only plain JSON values");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function digest(value) {
  return createHash("sha256").update(JSON.stringify(jsonValue(value))).digest("hex");
}

function timestamp(clock) {
  const value = clock();
  const milliseconds = value instanceof Date ? value.getTime() : Number.NaN;
  if (!Number.isFinite(milliseconds)) fail("invalid_clock", "Clock must return a valid Date");
  return { milliseconds, iso: new Date(milliseconds).toISOString() };
}

function validateAction(action) {
  if (!action || Array.isArray(action) || typeof action !== "object") {
    fail("invalid_action", "Action must be a JSON object");
  }
  const normalized = jsonValue(action);
  for (const key of ["operation", "resource", "revision"]) {
    if (typeof normalized[key] !== "string" || normalized[key].trim() === "") {
      fail("invalid_action", `Action ${key} must be a non-empty string`);
    }
  }
  return normalized;
}

function assertId(id) {
  if (typeof id !== "string" || !ID.test(id)) fail("invalid_id", "ID must use 1-128 letters, digits, dot, underscore, or dash");
}

export class MemoryStore {
  #records = new Map();

  async get(id) {
    const record = this.#records.get(id);
    return record ? clone(record) : null;
  }

  async list() {
    return [...this.#records.values()].map(clone);
  }

  async create(record) {
    if (this.#records.has(record.id)) fail("already_exists", `Approval ${record.id} already exists`);
    this.#records.set(record.id, clone(record));
  }

  async put(record) {
    if (!this.#records.has(record.id)) fail("not_found", `Approval ${record.id} does not exist`);
    this.#records.set(record.id, clone(record));
  }
}

/** Local demonstration store. It is not safe for multiple processes or workers. */
export class JsonFileStore {
  #directory;

  constructor(directory) {
    this.#directory = path.resolve(directory);
  }

  #file(id) {
    assertId(id);
    return path.join(this.#directory, `${id}.json`);
  }

  async get(id) {
    try {
      return JSON.parse(await readFile(this.#file(id), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async list() {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const names = await readdir(this.#directory);
    const records = [];
    for (const name of names.filter((item) => /^[a-zA-Z0-9._-]{1,128}\.json$/.test(item))) {
      records.push(JSON.parse(await readFile(path.join(this.#directory, name), "utf8")));
    }
    return records;
  }

  async create(record) {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const target = this.#file(record.id);
    const temporary = path.join(this.#directory, `.${record.id}.${randomUUID()}.tmp`);
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(record, null, 2));
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      // link() creates the final name atomically and fails if it already exists;
      // rename() would replace an existing approval on POSIX systems.
      await link(temporary, target);
      await unlink(temporary);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      if (error.code === "EEXIST" || error.code === "ENOTEMPTY") {
        fail("already_exists", `Approval ${record.id} already exists`);
      }
      throw error;
    }
  }

  async put(record) {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const target = this.#file(record.id);
    const temporary = path.join(this.#directory, `.${record.id}.${randomUUID()}.tmp`);
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(record, null, 2));
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      await rename(temporary, target);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
  }
}

/**
 * Host-conformance reference. Callbacks are trusted host boundaries, not security
 * features implemented by this module. The in-process mutex is not a distributed lock.
 */
export async function createApprovalRuntime({
  store,
  authenticateHuman,
  authorizeApproval,
  resolveCurrentAction,
  authorizeAction,
  executeAction,
  clock = () => new Date(),
}) {
  for (const [name, callback] of Object.entries({ store, authenticateHuman, authorizeApproval, resolveCurrentAction, authorizeAction, executeAction })) {
    if (!callback) fail("missing_host_callback", `Host must provide ${name}`);
  }

  let tail = Promise.resolve();
  const serialize = (operation) => {
    const result = tail.then(operation, operation);
    tail = result.then(() => undefined, () => undefined);
    return result;
  };

  // A process restart cannot distinguish "crashed before calling the tool" from
  // "tool succeeded but the result was lost". Never replay that action blindly.
  for (const record of await store.list()) {
    if (record.status === "executing") {
      record.status = "outcome_unknown";
      record.outcomeUnknownAt = timestamp(clock).iso;
      await store.put(record);
    }
  }

  async function requireHuman(credential) {
    let principal;
    try {
      principal = await authenticateHuman(credential);
    } catch {
      fail("authentication_failed", "Host could not authenticate an approver");
    }
    if (!principal || principal.type !== "human" || typeof principal.subject !== "string" || !principal.subject.trim()) {
      fail("human_required", "A trusted host must provide an authenticated human principal");
    }
    return { subject: principal.subject, type: "human" };
  }

  async function load(id) {
    assertId(id);
    const record = await store.get(id);
    if (!record) fail("not_found", `Approval ${id} does not exist`);
    return record;
  }

  return Object.freeze({
    request({ id = randomUUID(), gate, action, requestedBy, expiresAt }) {
      return serialize(async () => {
        assertId(id);
        if (!GATES.has(gate)) fail("invalid_gate", "Gate is not recognized");
        if (typeof requestedBy !== "string" || !requestedBy.trim()) fail("invalid_requester", "requestedBy is required");
        const normalizedAction = validateAction(action);
        const expires = new Date(expiresAt);
        const now = timestamp(clock);
        if (Number.isNaN(expires.getTime()) || expires.getTime() <= now.milliseconds) {
          fail("invalid_expiry", "Expiry must be a future timestamp");
        }
        const record = {
          id,
          gate,
          requestedBy,
          action: normalizedAction,
          actionDigest: digest(normalizedAction),
          expiresAt: expires.toISOString(),
          status: "pending",
          createdAt: now.iso,
          decision: null,
          execution: null,
        };
        await store.create(record);
        return clone(record);
      });
    },

    decide({ id, credential, decision, notes = "" }) {
      return serialize(async () => {
        if (!DECISIONS.has(decision)) fail("invalid_decision", "Decision must be approve or reject; edits require a new request");
        const principal = await requireHuman(credential);
        const record = await load(id);
        if (record.status !== "pending") fail("invalid_state", `Cannot decide an approval in state ${record.status}`);
        if (!(await authorizeApproval({ principal, approval: clone(record), operation: "decide" }))) {
          fail("not_authorized", "Host authorization rejected this approver for the request");
        }
        const now = timestamp(clock);
        if (Date.parse(record.expiresAt) <= now.milliseconds) {
          record.status = "expired";
          record.expiredAt = now.iso;
          await store.put(record);
          fail("expired", "Approval expired before the decision");
        }
        record.status = decision === "approve" ? "approved" : "rejected";
        record.decision = { value: decision, by: principal.subject, at: now.iso, notes: String(notes) };
        await store.put(record);
        return clone(record);
      });
    },

    cancel({ id, credential, reason = "" }) {
      return serialize(async () => {
        const principal = await requireHuman(credential);
        const record = await load(id);
        if (record.status !== "pending" && record.status !== "approved") {
          fail("invalid_state", `Cannot cancel an approval in state ${record.status}`);
        }
        if (!(await authorizeApproval({ principal, approval: clone(record), operation: "cancel" }))) {
          fail("not_authorized", "Host authorization rejected this cancellation");
        }
        record.status = "cancelled";
        record.cancelledAt = timestamp(clock).iso;
        record.cancelledBy = principal.subject;
        record.cancelReason = String(reason);
        await store.put(record);
        return clone(record);
      });
    },

    resume({ id }) {
      return serialize(async () => {
        const record = await load(id);
        if (record.status !== "approved") fail("invalid_state", `Cannot resume an approval in state ${record.status}`);
        const now = timestamp(clock);
        if (Date.parse(record.expiresAt) <= now.milliseconds) {
          record.status = "expired";
          record.expiredAt = now.iso;
          await store.put(record);
          fail("expired", "Approval expired before execution");
        }

        const currentAction = validateAction(await resolveCurrentAction(clone(record)));
        if (digest(currentAction) !== record.actionDigest) {
          record.status = "stale";
          record.staleAt = now.iso;
          await store.put(record);
          fail("stale_action", "Current action differs from the approved action; create a new approval");
        }
        if (!(await authorizeAction(clone(currentAction), clone(record)))) {
          record.status = "blocked";
          record.blockedAt = now.iso;
          await store.put(record);
          fail("not_authorized", "Host authorization rejected this action");
        }

        const idempotencyKey = `approval:${record.id}:${record.actionDigest}`;
        record.status = "executing";
        record.execution = { idempotencyKey, startedAt: now.iso };
        await store.put(record);

        try {
          const result = await executeAction(clone(currentAction), {
            idempotencyKey,
            approvalId: record.id,
            approvedBy: record.decision.by,
          });
          record.status = "completed";
          record.execution.completedAt = timestamp(clock).iso;
          await store.put(record);
          return { id: record.id, status: record.status, result };
        } catch {
          record.status = "outcome_unknown";
          record.execution.outcomeUnknownAt = timestamp(clock).iso;
          await store.put(record);
          fail("outcome_unknown", "Execution result is ambiguous; reconcile with the host before taking further action");
        }
      });
    },

    get({ id }) {
      return serialize(async () => clone(await load(id)));
    },
  });
}

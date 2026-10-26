import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createApprovalRuntime, JsonFileStore, MemoryStore } from "./runtime.mjs";

const humanCredential = "authenticated-test-session";
const action = {
  operation: "merge-preview",
  resource: "repo/example/pull/12",
  revision: "commit-abc123",
  arguments: { target: "main" },
};

function setup({ store = new MemoryStore(), currentAction = action, executeAction, now = () => new Date("2026-10-25T12:00:00.000Z"), authenticateHuman, authorizeApproval, authorizeAction } = {}) {
  const executed = [];
  const runtimePromise = createApprovalRuntime({
    store,
    clock: now,
    authenticateHuman: authenticateHuman ?? (async (credential) => credential === humanCredential
      ? { type: "human", subject: "reviewer-1" }
      : null),
    authorizeApproval: authorizeApproval ?? (async () => true),
    resolveCurrentAction: async () => currentAction,
    authorizeAction: authorizeAction ?? (async () => true),
    executeAction: executeAction ?? (async (approvedAction, metadata) => {
      executed.push({ action: approvedAction, ...metadata });
      return { ok: true };
    }),
  });
  return { runtimePromise, executed };
}

async function request(runtime, overrides = {}) {
  return runtime.request({
    id: "approval-1",
    gate: "merge",
    action,
    requestedBy: "engineering-agent",
    expiresAt: "2026-10-25T13:00:00.000Z",
    ...overrides,
  });
}

async function approve(runtime, id = "approval-1") {
  return runtime.decide({ id, credential: humanCredential, decision: "approve" });
}

test("persists a pending action, binds a human approval, and resumes once", async () => {
  const store = new MemoryStore();
  const { runtimePromise, executed } = setup({ store });
  const runtime = await runtimePromise;
  const pending = await request(runtime);
  assert.equal(pending.status, "pending");
  assert.equal((await store.get(pending.id)).status, "pending");
  assert.equal(executed.length, 0);

  const approved = await approve(runtime);
  assert.equal(approved.status, "approved");
  assert.equal(approved.decision.by, "reviewer-1");
  const result = await runtime.resume({ id: pending.id });
  assert.equal(result.status, "completed");
  assert.equal(executed.length, 1);
  assert.match(executed[0].idempotencyKey, /^approval:approval-1:/);
  await assert.rejects(runtime.resume({ id: pending.id }), { code: "invalid_state" });
  assert.equal(executed.length, 1);
});

test("rejects an agent principal returned by the host authenticator", async () => {
  const { runtimePromise } = setup({ authenticateHuman: async () => ({ type: "agent", subject: "agent-1" }) });
  const runtime = await runtimePromise;
  await request(runtime);
  await assert.rejects(approve(runtime), { code: "human_required" });
  assert.equal((await runtime.get({ id: "approval-1" })).status, "pending");
});

test("rejects stale action revisions without executing", async () => {
  const currentAction = { ...action, revision: "commit-changed" };
  const { runtimePromise, executed } = setup({ currentAction });
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "stale_action" });
  assert.equal((await runtime.get({ id: "approval-1" })).status, "stale");
  assert.equal(executed.length, 0);
});

test("rejection and expiry fail closed", async (t) => {
  await t.test("rejection never executes", async () => {
    const { runtimePromise, executed } = setup();
    const runtime = await runtimePromise;
    await request(runtime);
    await runtime.decide({ id: "approval-1", credential: humanCredential, decision: "reject" });
    await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "invalid_state" });
    assert.equal(executed.length, 0);
  });
  await t.test("expired approval cannot be approved", async () => {
    let currentTime = "2026-10-25T12:00:00.000Z";
    const { runtimePromise, executed } = setup({ now: () => new Date(currentTime) });
    const runtime = await runtimePromise;
    await request(runtime);
    currentTime = "2026-10-25T14:00:00.000Z";
    await assert.rejects(approve(runtime), { code: "expired" });
    assert.equal((await runtime.get({ id: "approval-1" })).status, "expired");
    assert.equal(executed.length, 0);
  });
  await t.test("approval that expires after decision cannot execute", async () => {
    let currentTime = "2026-10-25T12:00:00.000Z";
    const { runtimePromise, executed } = setup({ now: () => new Date(currentTime) });
    const runtime = await runtimePromise;
    await request(runtime);
    await approve(runtime);
    currentTime = "2026-10-25T14:00:00.000Z";
    await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "expired" });
    assert.equal((await runtime.get({ id: "approval-1" })).status, "expired");
    assert.equal(executed.length, 0);
  });
});

test("a human identity without host approval authority cannot decide", async () => {
  const { runtimePromise } = setup({ authorizeApproval: async () => false });
  const runtime = await runtimePromise;
  await request(runtime);
  await assert.rejects(approve(runtime), { code: "not_authorized" });
  assert.equal((await runtime.get({ id: "approval-1" })).status, "pending");
});

test("host resource authorization blocks an otherwise approved action", async () => {
  const { runtimePromise, executed } = setup({ authorizeAction: async () => false });
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "not_authorized" });
  assert.equal((await runtime.get({ id: "approval-1" })).status, "blocked");
  assert.equal(executed.length, 0);
});

test("approval that expires during host authorization cannot execute", async () => {
  let currentTime = "2026-10-25T12:00:00.000Z";
  const { runtimePromise, executed } = setup({
    now: () => new Date(currentTime),
    authorizeAction: async () => {
      currentTime = "2026-10-25T14:00:00.000Z";
      return true;
    },
  });
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "expired" });
  assert.equal((await runtime.get({ id: "approval-1" })).status, "expired");
  assert.equal(executed.length, 0);
});

test("cancellation after approval prevents resume", async () => {
  const { runtimePromise, executed } = setup();
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  await runtime.cancel({ id: "approval-1", credential: humanCredential, reason: "review withdrawn" });
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "invalid_state" });
  assert.equal(executed.length, 0);
});

test("pending approval survives restart without becoming approved", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "approval-runtime-test-"));
  try {
    const store = new JsonFileStore(directory);
    const first = await setup({ store }).runtimePromise;
    await request(first);
    await assert.rejects(request(first, { action: { ...action, revision: "replacement" } }), { code: "already_exists" });
    const secondSetup = setup({ store });
    const second = await secondSetup.runtimePromise;
    const persisted = await second.get({ id: "approval-1" });
    assert.equal(persisted.status, "pending");
    assert.equal(persisted.action.revision, action.revision);
    assert.equal(secondSetup.executed.length, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("restart converts an executing record to outcome_unknown and never replays it", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "approval-runtime-recovery-test-"));
  try {
    const store = new JsonFileStore(directory);
    const first = await setup({ store }).runtimePromise;
    await request(first);
    const approved = await approve(first);
    const record = {
      ...approved,
      status: "executing",
      execution: { idempotencyKey: "approval:approval-1:test-digest", startedAt: "2026-10-25T12:01:00.000Z" },
    };
    await store.put(record);
    const secondSetup = setup({ store });
    const second = await secondSetup.runtimePromise;
    assert.equal((await second.get({ id: "approval-1" })).status, "outcome_unknown");
    await assert.rejects(second.resume({ id: "approval-1" }), { code: "invalid_state" });
    assert.equal(secondSetup.executed.length, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("ambiguous connector failure is persisted and cannot be retried", async () => {
  const store = new MemoryStore();
  const { runtimePromise, executed } = setup({ store, executeAction: async () => { executed.push("called"); throw new Error("connection lost"); } });
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "outcome_unknown" });
  await assert.rejects(runtime.resume({ id: "approval-1" }), { code: "invalid_state" });
  assert.equal((await store.get("approval-1")).status, "outcome_unknown");
  assert.equal(executed.length, 1);
});

test("serializes concurrent resume attempts in one runtime instance", async () => {
  const { runtimePromise, executed } = setup();
  const runtime = await runtimePromise;
  await request(runtime);
  await approve(runtime);
  const results = await Promise.allSettled([
    runtime.resume({ id: "approval-1" }),
    runtime.resume({ id: "approval-1" }),
  ]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(executed.length, 1);
});

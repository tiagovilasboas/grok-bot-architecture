#!/usr/bin/env node
/**
 * Zero-dep handoff checker (docs/crew/handoffs.md).
 * Extra fields are allowed except a filled decision (that belongs on
 * the interrupt record). Missing required fields fail closed.
 *
 * Default: every examples/handoff*.broken.json must be rejected;
 *          every examples/handoff*.fixed.json must be accepted.
 * Inline self-tests pin ghost owners, invented decisions, and blob refs.
 *
 *   node scripts/validate-handoff.mjs
 *   node scripts/validate-handoff.mjs path/to/envelope.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listExampleFixtures,
  reportFixtureBatch,
  reportSelfTests,
} from "./lib/fixtures.mjs";

const KINDS = new Set([
  "assign",
  "block",
  "review",
  "interrupt",
  "resume",
  "done",
]);
const GATES = new Set(["merge", "deploy", "secrets", "messaging-as-user"]);
const GHOST_OWNERS = /^(the\s+)?agents?$|^models?$|^assistants?$/i;

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isGhostOwner(value) {
  return typeof value === "string" && GHOST_OWNERS.test(value.trim());
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidWritePolicy(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }
  if (value === "read" || value === "draft") {
    return true;
  }
  if (value.startsWith("hitl:")) {
    return GATES.has(value.slice("hitl:".length));
  }
  if (value.startsWith("allowlist:")) {
    return value.slice("allowlist:".length).trim().length > 0;
  }
  return false;
}

/**
 * @param {unknown} envelope
 * @returns {string[]}
 */
export function validateHandoff(envelope) {
  const errors = [];

  if (!isObject(envelope)) {
    return ["envelope must be a JSON object"];
  }

  for (const field of ["id", "goal", "done_when"]) {
    if (!isNonEmptyString(envelope[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  for (const side of ["from", "to"]) {
    if (!isNonEmptyString(envelope[side])) {
      errors.push(`${side} must be a non-empty role name`);
    } else if (isGhostOwner(envelope[side])) {
      errors.push(`${side} must be a role, not "${String(envelope[side]).trim()}"`);
    }
  }

  if (!KINDS.has(envelope.kind)) {
    errors.push(
      `kind must be one of ${[...KINDS].join(", ")} (got ${JSON.stringify(envelope.kind)})`,
    );
  }

  if (!Array.isArray(envelope.refs)) {
    errors.push("refs must be an array of pointers (paths, SHAs, issue ids, URLs — not a transcript blob)");
  } else if (envelope.refs.some((ref) => !isNonEmptyString(ref))) {
    errors.push("refs must contain only non-empty strings");
  }

  if (!isValidWritePolicy(envelope.write_policy)) {
    errors.push(
      'write_policy must be read | draft | hitl:<merge|deploy|secrets|messaging-as-user> | allowlist:<name>',
    );
  }

  if (isNonEmptyString(envelope.decision) || isNonEmptyString(envelope.decided_by)) {
    errors.push("decision / decided_by belong on the interrupt record; do not invent a resume on the hop");
  }

  if (envelope.observability !== undefined) {
    const obs = envelope.observability;
    if (isNonEmptyString(obs)) {
      // Optional trace / thread id as a bare string.
    } else if (isObject(obs)) {
      if (
        Object.prototype.hasOwnProperty.call(obs, "trace_id") &&
        !isNonEmptyString(obs.trace_id)
      ) {
        errors.push("observability.trace_id must be a non-empty string when present");
      }
    } else {
      errors.push("observability must be a non-empty string or an object");
    }
  }

  return errors;
}

/**
 * @returns {string[]}
 */
function selfTestFailures() {
  const failures = [];

  const ghost = validateHandoff({
    id: "card-self-ghost",
    from: "the agent",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
    done_when: "PR ref exists.",
  });
  if (!ghost.some((error) => error.includes("role"))) {
    failures.push("ghost owner must be rejected");
  }

  const invented = validateHandoff({
    id: "card-self-decision",
    from: "Chief-of-staff",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
    done_when: "PR ref exists.",
    decision: "approve",
    decided_by: "Código",
  });
  if (!invented.some((error) => error.includes("decision"))) {
    failures.push("invented decision on the hop must be rejected");
  }

  const blobRefs = validateHandoff({
    id: "card-self-refs",
    from: "Chief-of-staff",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: "Host chat. Código: LGTM.",
    write_policy: "draft",
    done_when: "PR ref exists.",
  });
  if (!blobRefs.some((error) => error.includes("refs"))) {
    failures.push("string refs blob must be rejected");
  }

  const badPolicy = validateHandoff({
    id: "card-self-policy",
    from: "Chief-of-staff",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "approve",
    done_when: "PR ref exists.",
  });
  if (!badPolicy.some((error) => error.includes("write_policy"))) {
    failures.push("write_policy approve must be rejected");
  }

  const missingDone = validateHandoff({
    id: "card-self-done",
    from: "Chief-of-staff",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
  });
  if (!missingDone.some((error) => error.includes("done_when"))) {
    failures.push("missing done_when must be rejected");
  }

  const ok = validateHandoff({
    id: "card-self-ok",
    from: "Chief-of-staff",
    to: "Código",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "hitl:merge",
    done_when: "PR ref exists; merge stays an interrupt.",
  });
  if (ok.length > 0) {
    failures.push(`valid envelope must be accepted (${ok.join("; ")})`);
  }

  return failures;
}

/**
 * @param {string} filePath
 * @returns {string[]}
 */
function readAndValidate(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return validateHandoff(JSON.parse(raw));
}

/**
 * @returns {number}
 */
function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(here, "..");
  const extra = process.argv.slice(2);

  if (extra.length > 0) {
    let failed = false;
    for (const rel of extra) {
      const filePath = path.resolve(rel);
      const errors = readAndValidate(filePath);
      if (errors.length === 0) {
        console.log(`${rel}: ACCEPTED`);
      } else {
        failed = true;
        console.log(`${rel}: REJECTED`);
        for (const error of errors) {
          console.log(`  - ${error}`);
        }
      }
    }
    return failed ? 1 : 0;
  }

  const examplesDir = path.join(root, "examples");
  const broken = listExampleFixtures(examplesDir, "handoff", "broken");
  const fixed = listExampleFixtures(examplesDir, "handoff", "fixed");

  let failed = reportSelfTests(selfTestFailures());
  failed =
    reportFixtureBatch({
      label: "examples/handoff*.broken.json",
      files: broken,
      validate: validateHandoff,
      expect: "reject",
    }) || failed;
  failed =
    reportFixtureBatch({
      label: "examples/handoff*.fixed.json",
      files: fixed,
      validate: validateHandoff,
      expect: "accept",
    }) || failed;

  if (failed) {
    console.error("Handoff fixture expectations failed.");
    return 1;
  }

  console.log("OK");
  return 0;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exit(main());
}

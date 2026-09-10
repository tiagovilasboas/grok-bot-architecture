#!/usr/bin/env node
/**
 * Zero-dep handoff checker (docs/crew/handoffs.md).
 * Extra fields are allowed except a filled decision (that belongs on
 * the interrupt record). Missing required fields fail closed.
 *
 * Default: examples/handoff.broken.json must be rejected;
 *          examples/handoff.fixed.json must be accepted.
 *
 *   node scripts/validate-handoff.mjs
 *   node scripts/validate-handoff.mjs path/to/envelope.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
 * @param {string} filePath
 * @returns {{ errors: string[], envelope: unknown }}
 */
function readAndValidate(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const envelope = JSON.parse(raw);
  return { errors: validateHandoff(envelope), envelope };
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
      const { errors } = readAndValidate(filePath);
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

  const brokenPath = path.join(root, "examples", "handoff.broken.json");
  const fixedPath = path.join(root, "examples", "handoff.fixed.json");

  if (!fs.existsSync(brokenPath) || !fs.existsSync(fixedPath)) {
    console.error("Missing examples/handoff.broken.json or examples/handoff.fixed.json");
    return 1;
  }

  const broken = readAndValidate(brokenPath);
  const fixed = readAndValidate(fixedPath);
  let failed = false;

  if (broken.errors.length === 0) {
    failed = true;
    console.log("examples/handoff.broken.json: ACCEPTED (expected REJECTED)");
  } else {
    console.log("examples/handoff.broken.json: REJECTED (expected)");
    for (const error of broken.errors) {
      console.log(`  - ${error}`);
    }
  }

  if (fixed.errors.length > 0) {
    failed = true;
    console.log("examples/handoff.fixed.json: REJECTED (expected ACCEPTED)");
    for (const error of fixed.errors) {
      console.log(`  - ${error}`);
    }
  } else {
    console.log("examples/handoff.fixed.json: ACCEPTED (expected)");
  }

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

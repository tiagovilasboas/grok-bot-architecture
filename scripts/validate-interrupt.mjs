#!/usr/bin/env node
/**
 * Zero-dep interrupt-record checker (docs/crew/hitl.md).
 * Extra fields are allowed. Missing required fields fail closed.
 * A filled decision without a human decided_by is a failed gate.
 *
 * Default: examples/interrupt.broken.json must be rejected;
 *          examples/interrupt.fixed.json must be accepted.
 *
 *   node scripts/validate-interrupt.mjs
 *   node scripts/validate-interrupt.mjs path/to/record.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GATES = new Set(["merge", "deploy", "secrets", "messaging-as-user"]);
const DECISIONS = new Set(["approve", "reject", "edit"]);
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const SPECIALIST_ROLES = new Set([
  "chief-of-staff",
  "inbox",
  "código",
  "codigo",
  "vitrine",
  "quinto",
  "entrega",
  "obs",
]);
const NON_HUMAN = /^(the\s+)?agents?$|^models?$|^assistants?$/i;

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isEmpty(value) {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
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
function isIsoUtc(value) {
  return isNonEmptyString(value) && ISO_UTC.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeActor(value) {
  return value.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isHumanDecider(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }
  const normalized = normalizeActor(value);
  if (SPECIALIST_ROLES.has(normalized) || SPECIALIST_ROLES.has(value.trim().toLowerCase())) {
    return false;
  }
  if (NON_HUMAN.test(value.trim())) {
    return false;
  }
  return true;
}

/**
 * @param {unknown} record
 * @returns {string[]}
 */
export function validateInterrupt(record) {
  const errors = [];

  if (!isObject(record)) {
    return ["record must be a JSON object"];
  }

  for (const field of ["id", "asked_by", "summary"]) {
    if (!isNonEmptyString(record[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (!GATES.has(record.gate)) {
    errors.push(
      `gate must be one of ${[...GATES].join(", ")} (got ${JSON.stringify(record.gate)})`,
    );
  }

  if (!isIsoUtc(record.asked_at)) {
    errors.push("asked_at must be an ISO-8601 UTC timestamp");
  }

  if (!Array.isArray(record.refs)) {
    errors.push("refs must be an array of pointers (not a blob)");
  } else if (record.refs.some((ref) => !isNonEmptyString(ref))) {
    errors.push("refs must contain only non-empty strings");
  }

  if (record.default_on_timeout !== "wait") {
    errors.push(
      `default_on_timeout must be "wait" (got ${JSON.stringify(record.default_on_timeout)})`,
    );
  }

  if (record.card !== undefined && !isNonEmptyString(record.card)) {
    errors.push("card must be a non-empty string when present");
  }

  if (record.notes !== undefined && typeof record.notes !== "string") {
    errors.push("notes must be a string when present");
  }

  const open = isEmpty(record.decision);

  if (open) {
    if (!isEmpty(record.decided_by) || !isEmpty(record.decided_at)) {
      errors.push("open interrupt: decided_by and decided_at must stay empty until a human writes decision");
    }
  } else {
    if (!DECISIONS.has(record.decision)) {
      errors.push(
        `decision must be empty or one of ${[...DECISIONS].join(", ")} (got ${JSON.stringify(record.decision)})`,
      );
    }
    if (!isHumanDecider(record.decided_by)) {
      errors.push("decided_by must be a human identifier; never invent a specialist or model");
    }
    if (!isIsoUtc(record.decided_at)) {
      errors.push("decided_at must be an ISO-8601 UTC timestamp when decision is set");
    }
  }

  return errors;
}

/**
 * @param {string} filePath
 * @returns {{ errors: string[], record: unknown }}
 */
function readAndValidate(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const record = JSON.parse(raw);
  return { errors: validateInterrupt(record), record };
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

  const brokenPath = path.join(root, "examples", "interrupt.broken.json");
  const fixedPath = path.join(root, "examples", "interrupt.fixed.json");

  if (!fs.existsSync(brokenPath) || !fs.existsSync(fixedPath)) {
    console.error("Missing examples/interrupt.broken.json or examples/interrupt.fixed.json");
    return 1;
  }

  const broken = readAndValidate(brokenPath);
  const fixed = readAndValidate(fixedPath);
  let failed = false;

  if (broken.errors.length === 0) {
    failed = true;
    console.log("examples/interrupt.broken.json: ACCEPTED (expected REJECTED)");
  } else {
    console.log("examples/interrupt.broken.json: REJECTED (expected)");
    for (const error of broken.errors) {
      console.log(`  - ${error}`);
    }
  }

  if (fixed.errors.length > 0) {
    failed = true;
    console.log("examples/interrupt.fixed.json: REJECTED (expected ACCEPTED)");
    for (const error of fixed.errors) {
      console.log(`  - ${error}`);
    }
  } else {
    console.log("examples/interrupt.fixed.json: ACCEPTED (expected)");
  }

  if (failed) {
    console.error("Interrupt fixture expectations failed.");
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

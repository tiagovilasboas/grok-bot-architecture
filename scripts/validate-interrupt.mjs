#!/usr/bin/env node
/**
 * Zero-dep interrupt-record checker (docs/crew/hitl.md).
 * Extra fields are allowed. Missing required fields fail closed.
 * A filled decision without a human decided_by is a failed gate.
 *
 * Default: every examples/interrupt*.broken.json must be rejected;
 *          every examples/interrupt*.fixed.json must be accepted.
 * Inline self-tests pin timeout-approve, missing gate, and invented decided_by.
 *
 *   node scripts/validate-interrupt.mjs
 *   node scripts/validate-interrupt.mjs path/to/record.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listExampleFixtures,
  reportFixtureBatch,
  reportSelfTests,
} from "./lib/fixtures.mjs";

const GATES = new Set(["merge", "deploy", "secrets", "messaging-as-user"]);
const DECISIONS = new Set(["approve", "reject", "edit"]);
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const SPECIALIST_ROLES = new Set([
  "chief-of-staff",
  "inbox",
  "eng",
  "vitrine",
  "quinto",
  "entrega",
  "cibersec",
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
 * @returns {string[]}
 */
function selfTestFailures() {
  const failures = [];

  const timeoutApprove = validateInterrupt({
    id: "interrupt-self-timeout",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Eng",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "approve",
  });
  if (!timeoutApprove.some((error) => error.includes("default_on_timeout"))) {
    failures.push("default_on_timeout approve must be rejected");
  }

  const missingGate = validateInterrupt({
    id: "interrupt-self-gate",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Eng",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
  });
  if (!missingGate.some((error) => error.includes("gate"))) {
    failures.push("missing gate must be rejected");
  }

  const invented = validateInterrupt({
    id: "interrupt-self-decider",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Eng",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "approve",
    decided_by: "Eng",
    decided_at: "2026-09-10T14:03:00Z",
  });
  if (!invented.some((error) => error.includes("decided_by"))) {
    failures.push("specialist decided_by must be rejected");
  }

  const emptyHuman = validateInterrupt({
    id: "interrupt-self-empty-human",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Eng",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "approve",
    decided_by: "",
    decided_at: "2026-09-10T14:03:00Z",
  });
  if (!emptyHuman.some((error) => error.includes("decided_by"))) {
    failures.push("empty decided_by with a decision must be rejected");
  }

  const openOk = validateInterrupt({
    id: "interrupt-self-open",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Eng",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "",
    decided_by: "",
    decided_at: "",
  });
  if (openOk.length > 0) {
    failures.push(`open interrupt must be accepted (${openOk.join("; ")})`);
  }

  const closedOk = validateInterrupt({
    id: "interrupt-self-closed",
    gate: "messaging-as-user",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Inbox",
    summary: "Send a draft as the user.",
    refs: ["mail://drafts/d-1"],
    default_on_timeout: "wait",
    decision: "reject",
    decided_by: "user",
    decided_at: "2026-09-10T16:40:00Z",
  });
  if (closedOk.length > 0) {
    failures.push(`human resume must be accepted (${closedOk.join("; ")})`);
  }

  return failures;
}

/**
 * @param {string} filePath
 * @returns {string[]}
 */
function readAndValidate(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return validateInterrupt(JSON.parse(raw));
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
  const broken = listExampleFixtures(examplesDir, "interrupt", "broken");
  const fixed = listExampleFixtures(examplesDir, "interrupt", "fixed");

  let failed = reportSelfTests(selfTestFailures());
  failed =
    reportFixtureBatch({
      label: "examples/interrupt*.broken.json",
      files: broken,
      validate: validateInterrupt,
      expect: "reject",
    }) || failed;
  failed =
    reportFixtureBatch({
      label: "examples/interrupt*.fixed.json",
      files: fixed,
      validate: validateInterrupt,
      expect: "accept",
    }) || failed;

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

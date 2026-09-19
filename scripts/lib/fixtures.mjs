/**
 * Shared fixture discovery for contract checkers.
 * Not a product CLI — just “find examples/*.broken.json and prove they fail.”
 */
import fs from "node:fs";
import path from "node:path";

/**
 * @param {string} dir
 * @param {string} prefix  e.g. "handoff" or "interrupt"
 * @param {"broken" | "fixed"} kind
 * @returns {string[]}
 */
export function listExampleFixtures(dir, prefix, kind) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const suffix = `.${kind}.json`;
  return fs
    .readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(suffix))
    .sort()
    .map((name) => path.join(dir, name));
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function listAllBrokenFixtures(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".broken.json"))
    .sort()
    .map((name) => path.join(dir, name));
}

/**
 * @param {string} fileName
 * @returns {"handoff" | "interrupt" | null}
 */
export function classifyFixtureName(fileName) {
  if (fileName.startsWith("handoff")) {
    return "handoff";
  }
  if (fileName.startsWith("interrupt")) {
    return "interrupt";
  }
  return null;
}

/**
 * @param {unknown} data
 * @returns {unknown}
 */
export function parseJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

/**
 * @param {{
 *   label: string,
 *   files: string[],
 *   validate: (value: unknown) => string[],
 *   expect: "reject" | "accept",
 * }} opts
 * @returns {boolean} true when expectations failed
 */
export function reportFixtureBatch(opts) {
  const { label, files, validate, expect } = opts;
  let failed = false;

  if (files.length === 0) {
    console.error(`Missing ${label} fixtures.`);
    return true;
  }

  for (const filePath of files) {
    const rel = path.relative(process.cwd(), filePath).replaceAll("\\", "/");
    const errors = validate(parseJsonFile(filePath));
    const accepted = errors.length === 0;

    if (expect === "reject") {
      if (accepted) {
        failed = true;
        console.log(`${rel}: ACCEPTED (expected REJECTED)`);
      } else {
        console.log(`${rel}: REJECTED (expected)`);
        for (const error of errors) {
          console.log(`  - ${error}`);
        }
      }
      continue;
    }

    if (!accepted) {
      failed = true;
      console.log(`${rel}: REJECTED (expected ACCEPTED)`);
      for (const error of errors) {
        console.log(`  - ${error}`);
      }
    } else {
      console.log(`${rel}: ACCEPTED (expected)`);
    }
  }

  return failed;
}

/**
 * @param {string[]} failures
 * @returns {boolean}
 */
export function reportSelfTests(failures) {
  if (failures.length === 0) {
    console.log("self-test: OK");
    return false;
  }
  console.log("self-test: FAILED");
  for (const failure of failures) {
    console.log(`  - ${failure}`);
  }
  return true;
}

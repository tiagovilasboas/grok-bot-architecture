#!/usr/bin/env node
/**
 * Contract runner: handoff fixtures, interrupt fixtures, then every
 * examples/*.broken.json must be classified and rejected.
 *
 *   node scripts/validate-all.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyFixtureName,
  listAllBrokenFixtures,
  parseJsonFile,
} from "./lib/fixtures.mjs";
import { validateHandoff } from "./validate-handoff.mjs";
import { validateInterrupt } from "./validate-interrupt.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const scripts = ["validate-handoff.mjs", "validate-interrupt.mjs"];

let failed = false;
for (const name of scripts) {
  const result = spawnSync(process.execPath, [path.join(here, name)], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    failed = true;
  }
}

const broken = listAllBrokenFixtures(path.join(root, "examples"));
if (broken.length === 0) {
  console.error("No examples/*.broken.json fixtures found.");
  failed = true;
}

for (const filePath of broken) {
  const rel = path.relative(root, filePath).replaceAll("\\", "/");
  const kind = classifyFixtureName(path.basename(filePath));
  if (kind === null) {
    failed = true;
    console.error(`${rel}: unclassified broken fixture (name must start with handoff or interrupt)`);
    continue;
  }

  const validate = kind === "handoff" ? validateHandoff : validateInterrupt;
  let errors;
  try {
    errors = validate(parseJsonFile(filePath));
  } catch (error) {
    failed = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${rel}: could not parse (${message})`);
    continue;
  }

  if (errors.length === 0) {
    failed = true;
    console.error(`${rel}: ACCEPTED (broken fixtures must be REJECTED)`);
  }
}

process.exit(failed ? 1 : 0);

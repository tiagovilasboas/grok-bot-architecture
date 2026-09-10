#!/usr/bin/env node
/**
 * Thin runner: handoff fixtures, then interrupt fixtures.
 *
 *   node scripts/validate-all.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
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

process.exit(failed ? 1 : 0);

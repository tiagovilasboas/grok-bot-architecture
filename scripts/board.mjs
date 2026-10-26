#!/usr/bin/env node
/**
 * Zero-dep CLI for shared-workspace Markdown boards (/workspace/board.md).
 *
 * Commands:
 *   node scripts/board.mjs check [path/to/board.md]
 *   node scripts/board.mjs list [path/to/board.md] [--to <Role>] [--status <open|done|block|dropped>]
 *   node scripts/board.mjs add <path/to/board.md> --id <id> --from <role> --to <role> \
 *     --kind <assign|review|block|interrupt|resume|done> --goal <text> \
 *     --refs <ref1,ref2> --write-policy <policy> --done-when <text>
 *   node scripts/board.mjs status <path/to/board.md> --id <id> \
 *     --status <open|done|block|dropped> [--output-refs <ref1,ref2>]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseBoard,
  normalizeCard,
  validateBoard,
  appendCard,
  updateCardStatus,
} from "./lib/board.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultBoard = path.resolve(here, "../examples/board.example.md");

function parseFlags(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = "true";
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function cmdCheck(positional) {
  const targets = positional.length > 0 ? positional : [defaultBoard];
  let failed = false;
  for (const target of targets) {
    const filePath = path.resolve(target);
    const rel = path.relative(process.cwd(), filePath) || path.basename(filePath);
    const markdown = fs.readFileSync(filePath, "utf8");
    const errors = validateBoard(markdown);
    const count = parseBoard(markdown).length;
    if (errors.length === 0) {
      console.log(`${rel}: OK (${count} card${count === 1 ? "" : "s"})`);
    } else {
      failed = true;
      console.error(`${rel}: REJECTED`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
  }
  return failed ? 1 : 0;
}

function cmdList(positional, flags) {
  const filePath = path.resolve(positional[0] || defaultBoard);
  const markdown = fs.readFileSync(filePath, "utf8");
  const cards = parseBoard(markdown)
    .map(normalizeCard)
    .filter((card) => (!flags.to || card.to.toLowerCase() === flags.to.toLowerCase()))
    .filter((card) => (!flags.status || card.status === flags.status));

  for (const card of cards) {
    console.log(
      `${card.id}\t${card.status}\t${card.from} -> ${card.to}\t${card.write_policy}\t${card.goal}`,
    );
  }
  return 0;
}

function cmdAdd(positional, flags) {
  if (!positional[0]) {
    console.error("Usage: node scripts/board.mjs add <path/to/board.md> --id ...");
    return 1;
  }
  const filePath = path.resolve(positional[0]);
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "# Board\n\n## Legend\n\n- `status`: `open` · `done` · `block` · `dropped`\n";
  const refs = (flags.refs || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const { markdown, errors } = appendCard(existing, {
    id: flags.id || "",
    goal: flags.goal || "",
    from: flags.from || "",
    to: flags.to || "",
    kind: flags.kind || "assign",
    refs,
    write_policy: flags["write-policy"] || "",
    done_when: flags["done-when"] || "",
    status: flags.status || "open",
  });
  if (errors.length > 0) {
    console.error("Refusing to write invalid board card:");
    for (const err of errors) console.error(`  - ${err}`);
    return 1;
  }
  fs.writeFileSync(filePath, markdown, "utf8");
  console.log(`Added card ${flags.id} to ${positional[0]}`);
  return 0;
}

function cmdStatus(positional, flags) {
  if (!positional[0] || !flags.id || !flags.status) {
    console.error(
      "Usage: node scripts/board.mjs status <path/to/board.md> --id <id> --status <status> [--output-refs <refs>]",
    );
    return 1;
  }
  const filePath = path.resolve(positional[0]);
  const existing = fs.readFileSync(filePath, "utf8");
  const outputRefs = flags["output-refs"]
    ? flags["output-refs"].split(",").map((item) => item.trim()).filter(Boolean)
    : undefined;
  const { markdown, errors } = updateCardStatus(existing, {
    id: flags.id,
    status: flags.status,
    output_refs: outputRefs,
  });
  if (errors.length > 0) {
    console.error("Refusing invalid board transition:");
    for (const err of errors) console.error(`  - ${err}`);
    return 1;
  }
  fs.writeFileSync(filePath, markdown, "utf8");
  console.log(`Updated ${flags.id} -> ${flags.status}`);
  return 0;
}

function main() {
  const [command = "check", ...rest] = process.argv.slice(2);
  const { positional, flags } = parseFlags(rest);
  if (command === "check") return cmdCheck(positional);
  if (command === "list") return cmdList(positional, flags);
  if (command === "add") return cmdAdd(positional, flags);
  if (command === "status") return cmdStatus(positional, flags);
  console.error(`Unknown command "${command}". Expected: check, list, add, status.`);
  return 1;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exit(main());
}

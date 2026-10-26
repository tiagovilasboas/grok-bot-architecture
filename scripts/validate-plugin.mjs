#!/usr/bin/env node
/**
 * Zero-dep Cursor plugin checker (.cursor-plugin/plugin.json, skills/<name>/SKILL.md).
 * Fails when the manifest is missing or invalid (name kebab-case, version semver),
 * when a skills/<dir>/ has no SKILL.md, when frontmatter name differs from the
 * folder, or when frontmatter description is empty. Single-line frontmatter values.
 *
 * Skills marked with the HTML comment <!-- template: v2 --> must also have the
 * required level-2 headings in order, exactly one worked example, and no relative
 * links. Across all v2 skills, body lines that repeat in two or more skills must
 * stay at or below 30 percent of all body lines.
 * Prints one line per failure (file: reason); exits 1 on any failure, 0 otherwise.
 *
 *   node scripts/validate-plugin.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const KEBAB = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const MANIFEST = ".cursor-plugin/plugin.json";
const V2_MARKER = "<!-- template: v2 -->";
const V2_HEADINGS = [
  "## When to use",
  "## Inputs and access",
  "## Steps",
  "## Validation",
  "## Output",
  "## Approval",
  "## Worked example",
];
const MAX_SHARED_RATIO = 0.3;

function unquote(value) {
  return value.replace(/^(["'])(.*)\1$/, "$2");
}

/** @returns {Record<string, string> | null} null when the frontmatter block is absent */
function parseFrontmatter(text) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!block) {
    return null;
  }
  const fields = {};
  for (const line of block[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*?)\s*$/.exec(line);
    if (pair) {
      fields[pair[1]] = unquote(pair[2]);
    }
  }
  return fields;
}

/** Text after the frontmatter block; the whole text when the block is absent. */
function bodyText(text) {
  const block = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(text);
  return block ? text.slice(block[0].length) : text;
}

/** Body lines that count toward the shared-line budget: not blank, not a heading, not the marker. */
function countableLines(body) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter((line) => line !== "" && !/^#{1,6}\s/.test(line) && line !== V2_MARKER);
}

/** Link targets that are neither external URLs, mailto links, nor same-file anchors. */
function relativeLinks(text) {
  return [...text.matchAll(/\]\(([^)\s]*)/g)]
    .map((match) => match[1])
    .filter((target) => target !== "" && !/^(https?:\/\/|mailto:|#)/.test(target));
}

function checkManifest(errors) {
  const manifestPath = path.join(root, MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${MANIFEST}: manifest is missing`);
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${MANIFEST}: not valid JSON (${error.message})`);
    return;
  }
  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    errors.push(`${MANIFEST}: must be a JSON object`);
    return;
  }
  if (typeof manifest.name !== "string" || !KEBAB.test(manifest.name)) {
    errors.push(
      `${MANIFEST}: name must be lowercase kebab-case (got ${JSON.stringify(manifest.name)})`,
    );
  }
  if (typeof manifest.version !== "string" || !SEMVER.test(manifest.version)) {
    errors.push(
      `${MANIFEST}: version must be semver (got ${JSON.stringify(manifest.version)})`,
    );
  }
}

function listSkillDirs(errors) {
  const skillsRoot = path.join(root, "skills");
  if (!fs.existsSync(skillsRoot)) {
    errors.push("skills/: directory is missing");
    return [];
  }
  const dirs = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (dirs.length === 0) {
    errors.push("skills/: no skill folders found");
  }
  return dirs;
}

function checkV2Structure(file, text, errors) {
  const lines = bodyText(text)
    .split(/\r?\n/)
    .map((line) => line.trim());
  let previous = -1;
  for (const heading of V2_HEADINGS) {
    const positions = lines.flatMap((line, index) => (line === heading ? [index] : []));
    if (positions.length === 0) {
      errors.push(`${file}: missing required heading "${heading}"`);
    } else if (positions.length > 1) {
      errors.push(`${file}: heading "${heading}" appears ${positions.length} times; expected once`);
    } else if (positions[0] < previous) {
      errors.push(
        `${file}: heading "${heading}" is out of order; required order is ${V2_HEADINGS.join(", ")}`,
      );
    } else {
      previous = positions[0];
    }
  }
  for (const target of relativeLinks(text)) {
    errors.push(`${file}: relative link "${target}" is not allowed in v2 skills (self-contained)`);
  }
}

function checkSkill(dir, errors, v2Lines) {
  const file = `skills/${dir}/SKILL.md`;
  const filePath = path.join(root, "skills", dir, "SKILL.md");
  if (!fs.existsSync(filePath)) {
    errors.push(`${file}: SKILL.md is missing`);
    return;
  }
  const text = fs.readFileSync(filePath, "utf8");
  const fields = parseFrontmatter(text);
  if (fields === null) {
    errors.push(`${file}: frontmatter block (--- ... ---) is missing`);
    return;
  }
  if (fields.name !== dir) {
    errors.push(
      `${file}: frontmatter name ${JSON.stringify(fields.name)} must equal folder name "${dir}"`,
    );
  }
  if (!KEBAB.test(dir)) {
    errors.push(`skills/${dir}/: folder name must be lowercase kebab-case`);
  }
  if (!fields.description || fields.description.trim() === "") {
    errors.push(`${file}: frontmatter description is empty`);
  }
  if (text.includes(V2_MARKER)) {
    checkV2Structure(file, text, errors);
    v2Lines.set(file, countableLines(bodyText(text)));
  }
}

/** A body line is shared when the same text appears in at least two v2 skills. */
function sharedLineStats(linesByFile) {
  const owners = new Map();
  for (const [file, lines] of linesByFile) {
    for (const line of lines) {
      if (!owners.has(line)) {
        owners.set(line, new Set());
      }
      owners.get(line).add(file);
    }
  }
  let shared = 0;
  let total = 0;
  for (const lines of linesByFile.values()) {
    for (const line of lines) {
      total += 1;
      if (owners.get(line).size >= 2) {
        shared += 1;
      }
    }
  }
  return { shared, total, ratio: total === 0 ? 0 : shared / total };
}

const errors = [];
const v2Lines = new Map();
checkManifest(errors);
const skillDirs = listSkillDirs(errors);
for (const dir of skillDirs) {
  checkSkill(dir, errors, v2Lines);
}

if (v2Lines.size > 0) {
  const stats = sharedLineStats(v2Lines);
  console.log(
    `validate-plugin: ${v2Lines.size} v2 skills, shared body-line ratio ${stats.ratio.toFixed(3)} ` +
      `(${stats.shared} of ${stats.total} body lines; max ${MAX_SHARED_RATIO.toFixed(3)})`,
  );
  if (stats.ratio > MAX_SHARED_RATIO) {
    errors.push(
      `v2 skills: shared body-line ratio ${stats.ratio.toFixed(3)} exceeds ${MAX_SHARED_RATIO.toFixed(3)}`,
    );
  }
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(message);
  }
  console.error(`\nvalidate-plugin: ${errors.length} failure(s)`);
  process.exit(1);
}

console.log(`validate-plugin: manifest and ${skillDirs.length} skills ok`);

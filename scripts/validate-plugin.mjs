#!/usr/bin/env node
/**
 * Zero-dep Cursor plugin checker (.cursor-plugin/plugin.json, skills/<name>/SKILL.md).
 * Fails when the manifest is missing or invalid (name kebab-case, version semver),
 * when a skills/<dir>/ has no SKILL.md, when frontmatter name differs from the
 * folder, or when frontmatter description is empty. Single-line frontmatter values.
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

function checkSkill(dir, errors) {
  const file = `skills/${dir}/SKILL.md`;
  const filePath = path.join(root, "skills", dir, "SKILL.md");
  if (!fs.existsSync(filePath)) {
    errors.push(`${file}: SKILL.md is missing`);
    return;
  }
  const fields = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
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
}

const errors = [];
checkManifest(errors);
const skillDirs = listSkillDirs(errors);
for (const dir of skillDirs) {
  checkSkill(dir, errors);
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(message);
  }
  console.error(`\nvalidate-plugin: ${errors.length} failure(s)`);
  process.exit(1);
}

console.log(`validate-plugin: manifest and ${skillDirs.length} skills ok`);

#!/usr/bin/env node
/**
 * Documentation coherence checker (roadmap task F3).
 * Fails when a retired role label reappears in current guidance, or when the
 * role set drifts between the README, the crew contract, the skills folder and
 * the interrupt validator. Decision history (docs/adr, CHANGELOG.md) is exempt.
 * Zero dependencies.
 *
 *   node scripts/check-coherence.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RETIRED_LABELS = [
  { pattern: /\bApps hub\b/i, label: "Apps hub" },
  { pattern: /\bStaff Core\b/i, label: "Staff Core" },
  { pattern: /\bStaff crew\b/i, label: "Staff crew" },
  { pattern: /\bmesa\b/i, label: "mesa" },
  { pattern: /\bCibersec\b/i, label: "Cibersec" },
  { pattern: /\bObs\b|\bobs-[a-z]/, label: "Obs / obs-" },
  { pattern: /assistant OS/i, label: "assistant OS" },
  { pattern: /\bApps \(`/, label: "Apps (`Finance`...)" },
];

const CURRENT_GUIDANCE = [
  "README.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
  "CLAUDE.md",
  "llms.txt",
  "docs",
  "examples",
  "grok-bot",
  "skills",
];
const HISTORY = ["docs/adr"];

function listMarkdown(relative) {
  const absolute = path.join(ROOT, relative);
  if (!fs.existsSync(absolute)) return [];
  if (fs.statSync(absolute).isFile()) return [relative];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(relative, entry.name);
    if (HISTORY.some((h) => child === h || child.startsWith(`${h}/`))) return [];
    if (entry.isDirectory()) return listMarkdown(child);
    return child.endsWith(".md") || child.endsWith(".txt") ? [child] : [];
  });
}

function retiredLabelErrors() {
  const errors = [];
  for (const file of CURRENT_GUIDANCE.flatMap(listMarkdown)) {
    const lines = fs.readFileSync(path.join(ROOT, file), "utf8").split("\n");
    lines.forEach((line, index) => {
      for (const { pattern, label } of RETIRED_LABELS) {
        if (pattern.test(line)) {
          errors.push(`${file}:${index + 1}: retired label "${label}" in current guidance`);
        }
      }
    });
  }
  return errors;
}

const slug = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");

function sectionBetween(text, startHeading, endHeading) {
  const start = text.indexOf(startHeading);
  if (start === -1) return "";
  const end = text.indexOf(endHeading, start + startHeading.length);
  return text.slice(start, end === -1 ? undefined : end);
}

function readmeRoles() {
  const text = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  const section = sectionBetween(text, "## Roles", "\n## ");
  return [...section.matchAll(/^\| \*\*([^*]+)\*\* \|/gm)].map((m) => slug(m[1]));
}

function crewContractRoles() {
  const text = fs.readFileSync(path.join(ROOT, "docs/crew/roles.md"), "utf8");
  const section = sectionBetween(text, "## Role boundaries", "## Shared policy");
  return [...section.matchAll(/^### (.+)$/gm)].map((m) => slug(m[1]));
}

function skillRoles() {
  const dir = path.join(ROOT, "skills");
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, "SKILL.md")))
    .map((entry) => entry.name);
}

function validatorRoles() {
  const text = fs.readFileSync(path.join(ROOT, "scripts/validate-interrupt.mjs"), "utf8");
  const block = sectionBetween(text, "const SPECIALIST_ROLES = new Set([", "]);");
  return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function roleSetErrors() {
  const sources = {
    "README.md role table": readmeRoles(),
    "docs/crew/roles.md": crewContractRoles(),
    "skills/ folders": skillRoles(),
  };
  const errors = [];
  const reference = [...new Set(sources["docs/crew/roles.md"])].sort();
  for (const [name, roles] of Object.entries(sources)) {
    const sorted = [...new Set(roles)].sort();
    if (sorted.join(",") !== reference.join(",")) {
      errors.push(`role set mismatch: ${name} has [${sorted.join(", ")}], docs/crew/roles.md has [${reference.join(", ")}]`);
    }
  }
  const validator = new Set(validatorRoles());
  for (const role of reference) {
    if (!validator.has(role)) {
      errors.push(`scripts/validate-interrupt.mjs: role "${role}" is missing from SPECIALIST_ROLES`);
    }
  }
  return errors;
}

const errors = [...retiredLabelErrors(), ...roleSetErrors()];
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL | ${error}`);
  process.exit(1);
}
console.log("coherence: retired labels absent, role set consistent");

/**
 * Shared-workspace board parser, validator, and formatter.
 * Validates Markdown board cards against the handoff envelope contract
 * (validateHandoff) plus board-level invariants (unique IDs, valid status,
 * and non-empty output_refs when a card is marked done).
 */
import { validateHandoff } from "../validate-handoff.mjs";

export const BOARD_STATUSES = new Set(["open", "done", "block", "dropped"]);

/**
 * Strip surrounding backticks and trailing parenthetical notes from a cell.
 * @param {string} raw
 * @returns {string}
 */
function cleanScalar(raw) {
  const trimmed = raw.trim();
  const codeMatch = /^`([^`]+)`$/.exec(trimmed);
  if (codeMatch) {
    return codeMatch[1].trim();
  }
  return trimmed.replace(/^`([^`]+)`\s*(?:—|\(|if\s).*$/, "$1").trim();
}

/**
 * Normalize a write_policy cell, extracting an explicit hitl:<gate> or
 * allowlist:<name> token when present alongside prose notes.
 * @param {string} raw
 * @returns {string}
 */
function normalizeWritePolicy(raw) {
  const tokens = [...raw.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  const hitl = tokens.find((t) => t.startsWith("hitl:") || t.startsWith("allowlist:"));
  if (hitl) return hitl;
  if (tokens.length > 0) return tokens[0];
  return cleanScalar(raw);
}

/**
 * Parse a comma-separated reference cell into an array of pointer strings.
 * @param {string | undefined} raw
 * @returns {string[]}
 */
function parseRefsList(raw) {
  if (!raw) return [];
  const codeTokens = [...raw.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  if (codeTokens.length > 0) {
    return codeTokens.filter((token) => token.toLowerCase() !== "none" && token !== "");
  }
  return raw
    .split(",")
    .map((item) => cleanScalar(item))
    .filter((item) => item !== "" && item.toLowerCase() !== "none");
}

/**
 * Parse all "## Card ..." sections from a board Markdown document.
 * @param {string} markdown
 * @returns {Array<{ headingId: string, fields: Record<string, string> }>}
 */
export function parseBoard(markdown) {
  const lines = markdown.split(/\r?\n/);
  const cards = [];
  let current = null;

  for (const line of lines) {
    const heading = /^##\s+Card\s+`?([^`\s]+)`?\s*$/.exec(line.trim());
    if (heading) {
      current = { headingId: heading[1], fields: {} };
      cards.push(current);
      continue;
    }
    if (/^##\s+/.test(line.trim())) {
      current = null;
      continue;
    }
    if (!current) continue;

    const row = /^\|\s*`?([a-zA-Z0-9_-]+)`?\s*\|\s*(.*?)\s*\|$/.exec(line.trim());
    if (!row) continue;
    const key = row[1].toLowerCase();
    const value = row[2].trim();
    if (key === "field" || /^-+$/.test(key) || /^-+$/.test(value)) continue;
    current.fields[key] = value;
  }

  return cards;
}

/**
 * Convert a parsed card's table fields into a structured card record.
 * @param {{ headingId: string, fields: Record<string, string> }} parsed
 */
export function normalizeCard(parsed) {
  const { fields } = parsed;
  const statusRaw = cleanScalar(fields.status || "").split(/\s+/)[0];
  return {
    id: cleanScalar(fields.id || parsed.headingId),
    headingId: parsed.headingId,
    goal: cleanScalar(fields.goal || ""),
    from: cleanScalar(fields.from || ""),
    to: cleanScalar(fields.to || ""),
    kind: cleanScalar(fields.kind || ""),
    refs: parseRefsList(fields.refs),
    write_policy: normalizeWritePolicy(fields.write_policy || ""),
    done_when: cleanScalar(fields.done_when || ""),
    status: statusRaw,
    output_refs: parseRefsList(fields.output_refs),
    decision: fields.decision ? cleanScalar(fields.decision) : undefined,
    decided_by: fields.decided_by ? cleanScalar(fields.decided_by) : undefined,
  };
}

/**
 * Validate a Markdown board document and return human-readable error strings.
 * @param {string} markdown
 * @returns {string[]}
 */
export function validateBoard(markdown) {
  const parsedCards = parseBoard(markdown);
  if (parsedCards.length === 0) {
    return ["board must contain at least one '## Card <id>' section"];
  }

  const errors = [];
  const seenIds = new Set();

  for (const parsed of parsedCards) {
    const card = normalizeCard(parsed);
    const label = card.id || parsed.headingId || "<unnamed>";

    if (card.id !== parsed.headingId) {
      errors.push(`${label}: table id "${card.id}" must match heading id "${parsed.headingId}"`);
    }
    if (seenIds.has(card.id)) {
      errors.push(`${label}: duplicate card id "${card.id}"`);
    }
    seenIds.add(card.id);

    const handoffErrors = validateHandoff({
      id: card.id,
      goal: card.goal,
      from: card.from,
      to: card.to,
      kind: card.kind,
      refs: card.refs,
      write_policy: card.write_policy,
      done_when: card.done_when,
      decision: card.decision,
      decided_by: card.decided_by,
    });
    for (const err of handoffErrors) {
      errors.push(`${label}: ${err}`);
    }

    if (!BOARD_STATUSES.has(card.status)) {
      errors.push(
        `${label}: status must be one of ${[...BOARD_STATUSES].join(", ")} (got ${JSON.stringify(card.status)})`,
      );
    } else if (card.status === "done" && card.output_refs.length === 0) {
      errors.push(`${label}: status "done" requires at least one output_refs pointer`);
    }
  }

  return errors;
}

/**
 * Format a single card as a Markdown section.
 */
export function formatCardSection(card) {
  const refsText = (card.refs || []).map((r) => `\`${r}\``).join(", ");
  const outRefs =
    card.output_refs && card.output_refs.length > 0
      ? card.output_refs.map((r) => `\`${r}\``).join(", ")
      : "none";
  return [
    `## Card \`${card.id}\``,
    "",
    "| Field | Value |",
    "|---|---|",
    `| \`id\` | \`${card.id}\` |`,
    `| \`goal\` | ${card.goal} |`,
    `| \`from\` | ${card.from} |`,
    `| \`to\` | ${card.to} |`,
    `| \`kind\` | \`${card.kind}\` |`,
    `| \`refs\` | ${refsText} |`,
    `| \`write_policy\` | \`${card.write_policy}\` |`,
    `| \`done_when\` | ${card.done_when} |`,
    `| \`status\` | \`${card.status || "open"}\` |`,
    `| \`output_refs\` | ${outRefs} |`,
    "",
  ].join("\n");
}

/**
 * Append a validated card to a board Markdown string.
 * @param {string} markdown
 * @param {Record<string, unknown>} cardInput
 * @returns {{ markdown: string, errors: string[] }}
 */
export function appendCard(markdown, cardInput) {
  const section = formatCardSection({ status: "open", output_refs: [], ...cardInput });
  const legendIndex = markdown.indexOf("\n## Legend");
  const updated =
    legendIndex === -1
      ? `${markdown.trimEnd()}\n\n${section}`
      : `${markdown.slice(0, legendIndex).trimEnd()}\n\n${section}\n${markdown.slice(legendIndex + 1)}`;
  const errors = validateBoard(updated);
  return { markdown: updated, errors };
}

/**
 * Update the status and optional output_refs of an existing card in Markdown.
 * @param {string} markdown
 * @param {{ id: string, status: string, output_refs?: string[] }} update
 * @returns {{ markdown: string, errors: string[] }}
 */
export function updateCardStatus(markdown, { id, status, output_refs }) {
  const cards = parseBoard(markdown);
  const target = cards.find((c) => cleanScalar(c.fields.id || c.headingId) === id);
  if (!target) {
    return { markdown, errors: [`card "${id}" not found on board`] };
  }

  const lines = markdown.split(/\r?\n/);
  let inTarget = false;
  const updatedLines = lines.map((line) => {
    const heading = /^##\s+Card\s+`?([^`\s]+)`?\s*$/.exec(line.trim());
    if (heading) {
      inTarget = heading[1] === target.headingId;
      return line;
    }
    if (/^##\s+/.test(line.trim())) {
      inTarget = false;
      return line;
    }
    if (!inTarget) return line;
    if (/^\|\s*`?status`?\s*\|/i.test(line.trim())) {
      return `| \`status\` | \`${status}\` |`;
    }
    if (output_refs && output_refs.length > 0 && /^\|\s*`?output_refs`?\s*\|/i.test(line.trim())) {
      return `| \`output_refs\` | ${output_refs.map((r) => `\`${r}\``).join(", ")} |`;
    }
    return line;
  });

  const nextMarkdown = updatedLines.join("\n");
  return { markdown: nextMarkdown, errors: validateBoard(nextMarkdown) };
}

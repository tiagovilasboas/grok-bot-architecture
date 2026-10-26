import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  parseBoard,
  validateBoard,
  appendCard,
  updateCardStatus,
} from "./lib/board.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const exampleBoardPath = path.resolve(here, "../examples/board.example.md");

test("board validator accepts examples/board.example.md", () => {
  const markdown = fs.readFileSync(exampleBoardPath, "utf8");
  const errors = validateBoard(markdown);
  assert.deepEqual(errors, []);
  assert.equal(parseBoard(markdown).length, 3);
});

test("board validator rejects ghost owners and invented decisions", () => {
  const broken = [
    "# Board",
    "",
    "## Card `card-1`",
    "",
    "| Field | Value |",
    "|---|---|",
    "| `id` | `card-1` |",
    "| `goal` | Test goal |",
    "| `from` | the agent |",
    "| `to` | Engineering |",
    "| `kind` | `assign` |",
    "| `refs` | `docs/architecture.md` |",
    "| `write_policy` | `draft` |",
    "| `done_when` | PR opened |",
    "| `status` | `open` |",
    "| `decision` | `approve` |",
  ].join("\n");

  const errors = validateBoard(broken);
  assert.ok(errors.some((e) => e.includes('not "the agent"')));
  assert.ok(errors.some((e) => e.includes("decision / decided_by")));
});

test("board validator rejects done status without output_refs", () => {
  const broken = [
    "# Board",
    "",
    "## Card `card-done-empty`",
    "",
    "| Field | Value |",
    "|---|---|",
    "| `id` | `card-done-empty` |",
    "| `goal` | Implement feature |",
    "| `from` | Chief-of-staff |",
    "| `to` | Engineering |",
    "| `kind` | `assign` |",
    "| `refs` | `docs/architecture.md` |",
    "| `write_policy` | `draft` |",
    "| `done_when` | PR opened |",
    "| `status` | `done` |",
    "| `output_refs` | none |",
  ].join("\n");

  const errors = validateBoard(broken);
  assert.ok(errors.some((e) => e.includes('status "done" requires at least one output_refs')));
});

test("appendCard and updateCardStatus preserve contract invariants", () => {
  const base = "# Board\n\n## Legend\n\n- `status`: `open` · `done` · `block` · `dropped`\n";
  const added = appendCard(base, {
    id: "card-2026-10-26-01",
    goal: "Audit docs coherence",
    from: "Chief-of-staff",
    to: "Security",
    kind: "assign",
    refs: ["README.md", "docs/adr/README.md"],
    write_policy: "read",
    done_when: "Drift report recorded",
  });
  assert.deepEqual(added.errors, []);
  assert.ok(added.markdown.indexOf("## Card `card-2026-10-26-01`") < added.markdown.indexOf("## Legend"));

  const blocked = updateCardStatus(added.markdown, {
    id: "card-2026-10-26-01",
    status: "done",
  });
  assert.ok(blocked.errors.some((e) => e.includes("output_refs")));

  const completed = updateCardStatus(added.markdown, {
    id: "card-2026-10-26-01",
    status: "done",
    output_refs: ["pr://tiagovilasboas/grok-bot-architecture/57"],
  });
  assert.deepEqual(completed.errors, []);
});

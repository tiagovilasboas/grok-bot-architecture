## Why

What problem does this change solve? Link the issue when one exists.

## What

What changed? Name the files and the decision (if any).

## How to verify

Concrete checks a reviewer can run. Paths and commands in English fences:

```text
wc -l AGENTS.md
test "$(wc -l < AGENTS.md)" -le 80
ls LICENSE CONTRIBUTING.md docs/adr/README.md docs/architecture.md docs/crew/roles.md
```

## ADR / crew impact

- [ ] No ADR needed (hygiene, wording, or cookbook-only)
- [ ] Updates an existing ADR
- [ ] Proposes a new ADR (`docs/adr/NNNN-short-title-with-dashes.md`)
- [ ] Touches crew contracts (each role still has job · objective · write-boundary)

If you propose an ADR: one decision per PR, Status starts as `Proposed`, and the issue is linked.

## Guardrails

- [ ] Example host (Grok Bot / Cursor) stays an example
- [ ] No private system prompts, client IP, or invented screenshots
- [ ] HITL stays fail-closed on merge / deploy / secrets / messaging-as-user

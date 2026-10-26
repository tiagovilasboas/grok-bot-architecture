# Examples

Markdown **shapes** (copy the headings; blank the fields) and JSON **fixtures** the validators machine-check. Invented product work. No private prompts, mail bodies, or screenshots.

| Shape | Markdown | JSON (must reject) | JSON (must accept) |
|---|---|---|---|
| Handoff envelope | [board.example.md](board.example.md) | [handoff.broken.json](handoff.broken.json) | [handoff.fixed.json](handoff.fixed.json) |
| Interrupt record | [interrupt-record.example.md](interrupt-record.example.md) | [interrupt.broken.json](interrupt.broken.json) | [interrupt.fixed.json](interrupt.fixed.json) |

Contracts: [`docs/crew/handoffs.md`](../docs/crew/handoffs.md) · [`docs/crew/hitl.md`](../docs/crew/hitl.md). JSON `refs` are arrays; the markdown shapes may show a single ref line.

```text
node scripts/validate-all.mjs
```

Or the individual checkers and board CLI:

```text
node scripts/validate-handoff.mjs
node scripts/validate-interrupt.mjs
node scripts/board.mjs list --file examples/board.example.md
node scripts/board.mjs check --file examples/board.example.md
```

Every `examples/*.broken.json` must be rejected. Every `*.fixed.json` and `examples/board.example.md` must be accepted.

Walkthroughs:
- [Agnostic task walkthrough](walkthrough.md): generic fictional task lifecycle.
- [Grok Bot walkthrough](grok-bot/walkthrough.md): step-by-step from skill install to approval stop.
- [Repository self-audit case study](case-study-self-audit.md): real, git-verifiable walkthrough of PRs `#57`–`#63` using `scripts/board.mjs` and `scripts/check.sh`.

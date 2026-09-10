# Examples

Markdown **shapes** (copy the headings; blank the fields) and JSON **fixtures** the validators machine-check. Invented product work. No private prompts, mail bodies, or screenshots.

| Shape | Markdown | JSON (must reject) | JSON (must accept) |
|---|---|---|---|
| Handoff envelope | [board.example.md](board.example.md) | [handoff.broken.json](handoff.broken.json) | [handoff.fixed.json](handoff.fixed.json) |
| Interrupt record | [interrupt-record.example.md](interrupt-record.example.md) | [interrupt.broken.json](interrupt.broken.json) | [interrupt.fixed.json](interrupt.fixed.json) |

Contracts: [`docs/crew/handoffs.md`](../docs/crew/handoffs.md) · [`docs/crew/hitl.md`](../docs/crew/hitl.md). JSON `refs` are arrays; the markdown shapes may show a single ref line.

```text
node scripts/validate-handoff.mjs
node scripts/validate-interrupt.mjs
```

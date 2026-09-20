# Handoffs

A hop is a **message**, not a vibe. If the next owner or the expected output is missing, the OS is incomplete.

Shape is vendor-neutral. Map it to MCP elicitation, a ticket, or a markdown file on the shared computer. Do not paste the transcript.

## Envelope (minimum)

| Field | Meaning |
|---|---|
| `id` | Stable id (board card or interrupt id) |
| `from` / `to` | Role names |
| `kind` | `assign` · `block` · `review` · `interrupt` · `resume` · `done` |
| `goal` | One sentence |
| `refs` | Paths, SHAs, issue ids, URLs — **not** blobs ([ADR 0005](../adr/0005-token-thrift.md)) |
| `write_policy` | `read` · `draft` · `hitl:<gate>` · `allowlist:<name>` |
| `done_when` | Checkable acceptance |
| `observability` | Optional trace / thread id |

Unknown required fields **fail closed**. Chat-only hosts need a thin adapter that writes this envelope to disk.

## Default hops

| Hop | Payload (minimum) | Expected output |
|---|---|---|
| User → Chief-of-staff | Goal, deadline, constraints | Board card or a refuse |
| Chief-of-staff → Specialist | Card: scope, refs, `write_policy`, `done_when` | Work in scope or `block` |
| Specialist → Chief-of-staff | `block` + what is missing | Recard or escalate to user |
| Eng → Chief-of-staff | Diff / PR ref + residual risk; merge still HITL | Board update; CoS / human decide merge |
| Eng → Vitrine | Public-path PR / preview refs when publish is in scope | Preview card; **publish = HITL** |
| Carreira → Chief-of-staff | Draft packet + refs; messaging/publish still HITL | Board update or interrupt |
| Inbox → User (via CoS) | Draft + `hitl:messaging-as-user` | Explicit send / edit / drop |
| Any specialist → Cibersec | Outcome refs | Trace note; no rewrite of the work |
| Any → User | `interrupt` record | `resume` with `decision` + `decided_by` |
| User → Chief-of-staff | `resume` | Continue or close the card |

No silent hop. If Eng finishes and merge starts without a card update and HITL record, that is a bug in the docs or the host mapping. On the example host there is no Eng → Entrega hop — packaging folds into Eng; ship/merge stay HITL via CoS / human.

## Anti-patterns

- **Transcript dump.** “Here’s everything we said” is not a handoff.
- **Ghost owner.** “the agent” is not a role.
- **Implied LGTM.** Eng does not approve Eng.
- **Cross-secret ride.** Quinto refs do not ride along on an Inbox hop.
- **Browser as envelope.** Screenshots are not a contract. If you attach one, you took it; do not invent it.
- **Peer swarm.** Specialists do not spawn peers. Route through CoS with a typed envelope.

Filled board: [../../examples/board.example.md](../../examples/board.example.md). Machine-check: `node scripts/validate-handoff.mjs` (or `node scripts/validate-all.mjs`).

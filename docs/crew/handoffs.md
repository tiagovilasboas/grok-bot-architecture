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
| Código → Entrega | Diff / PR ref + residual risk | Ship checklist or bounce |
| Inbox → User (via CoS) | Draft + `hitl:messaging-as-user` | Explicit send / edit / drop |
| Any specialist → Obs | Outcome refs | Trace note; no rewrite of the work |
| Any → User | `interrupt` record | `resume` with `decision` + `decided_by` |
| User → Chief-of-staff | `resume` | Continue or close the card |

No silent hop. If Código finishes and Entrega starts without a card update, that is a bug in the docs or the host mapping.

## Anti-patterns

- **Transcript dump.** “Here’s everything we said” is not a handoff.
- **Ghost owner.** “the agent” is not a role.
- **Implied LGTM.** Código does not approve Código.
- **Cross-secret ride.** Quinto refs do not ride along on an Inbox hop.
- **Browser as envelope.** Screenshots are not a contract. If you attach one, you took it; do not invent it.

Filled board: [../../examples/board.example.md](../../examples/board.example.md).

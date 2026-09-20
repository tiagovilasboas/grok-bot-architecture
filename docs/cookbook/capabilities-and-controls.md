# Cookbook — capabilities and controls

**Decision:** what this crew pattern **can** do on a shared computer, and which **controls** keep privileged writes fail-closed. Staff depth — not a catalog of tools.

## Capabilities

| Capability | What it means | Where |
|---|---|---|
| **Typed handoff** | Hop with `from` / `to` roles, `goal`, `refs`, `write_policy` — not a transcript dump | [handoffs.md](../crew/handoffs.md) · `examples/` |
| **Connectors** | Schema’d MCP / APIs with auth and a write-boundary. Browser last. A **plugin** here is a connector, not a marketplace row | [ADR 0004](../adr/0004-connectors-over-browser.md) · [connectors.md](../connectors.md) |
| **Cloud Eng** | Isolated code on an extra machine: one goal, one repo, one PR. Desktop CoS keeps the board and the merge gate | [ADR 0006](../adr/0006-cloud-agents-for-code.md) · [when-to-use-cloud-agent.md](when-to-use-cloud-agent.md) |
| **HITL gates** | Pause · persist · resume on merge · deploy · secrets · messaging-as-user | [ADR 0003](../adr/0003-hitl-on-side-effects.md) · [hitl.md](../crew/hitl.md) |
| **Reusable skills library** | Host-level `SKILL.md` recipes any specialist can load — not agents; do not bypass HITL | [skills.md](../skills.md) |

Reads and **local drafts** may be optimistic. That is not a send, merge, or pay.

## Does not do alone

The crew **does not** by itself:

- Approve a privileged write (`decision` / `decided_by` stay empty until a human).
- Send mail/chat/social **as the user**, merge to default, deploy prod, or touch vault/billing.
- Drive the browser as a generic API when a connector exists.
- Act on a hop with no inspectable **evidence** (`refs` empty, “the model said so”).
- Hold the union of every connector “for routing.”

If nobody answers the gate, the write stays paused. That is the product, not a bug.

## Controls

| Control | Rule | Fail closed |
|---|---|---|
| **Timeout = wait** | `default_on_timeout` must be **`wait`**. Never `approve`. | [ADR 0003](../adr/0003-hitl-on-side-effects.md) · [hitl.md](../crew/hitl.md) |
| **Write-boundary** | Each role: job · objective · what it may write. CoS does not inherit specialist tools. | [roles.md](../crew/roles.md) |
| **Anti-send** | Draft ≠ send. Messaging-as-user is a named gate. Browser “click Send” does not bypass it. | [hitl.md](../crew/hitl.md) · [ADR 0004](../adr/0004-connectors-over-browser.md) |
| **Connector allowlist** | Per-role subset, written on the host. Adding a server is a host decision. | [connectors.md](../connectors.md) · [ADR 0004](../adr/0004-connectors-over-browser.md) |
| **Rail: no evidence → do not act** | No pointer on `refs` (path, SHA, issue, URL) → no hop, no write, no “helpful” resume. | [handoffs.md](../crew/handoffs.md) · checkers below |

Machine-check the envelopes: `node scripts/validate-all.mjs`. Ghost owners, transcript `refs`, invented `decision`, and `default_on_timeout: approve` do not ship.

## Limit

This page is a **decision + limit** map for the pattern. It is not a product CLI, a host SDK, or a sibling-repo farm. Host is replaceable; Grok Bot / Cursor is the example mapping. A vs B: [when-to-use-this-pattern.md](when-to-use-this-pattern.md). When the loop already feels fast and wrong: [failure-modes.md](failure-modes.md).

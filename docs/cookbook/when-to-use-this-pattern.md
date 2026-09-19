# Cookbook — when to use this pattern

Use this log to decide **how a desktop assistant is organized**, not which model or IDE to buy. The artifact is the ADR log plus the validators. This repo is a **pattern / reference**, not a hosted OS.

## Decision filter (A vs B)

Walk the table **top to bottom**. The first row that is **A** is the answer — skip the crew. Use the pattern only when a later row is **B** and no earlier row was A.

| # | Ask | A — skip the crew | B — this pattern |
|---|---|---|---|
| 1 | Who is on the computer? | **One human, one repo, one chat.** Same sitting, same tools, no send / merge / pay. | More than one job shares the machine (inbox, code, ship, money) and **secrets or write-boundaries collide**. |
| 2 | If nobody answers the gate? | You would ship, merge, or send anyway. | Privileged writes **fail closed**. `default_on_timeout` must be **`wait`**, never `approve`. |
| 3 | Who owns the next hop? | `"the agent"` / `"the model"` is an acceptable owner. | Ghost owners **fail closed**. `from` / `to` are roles; invented `decision` is not a resume. |
| 4 | How does it talk to the world? | Driving the browser *is* the architecture. | **Connectors** (MCP / APIs) first; browser last and untrusted ([ADR 0004](../adr/0004-connectors-over-browser.md)). |
| 5 | What artifact do you need? | A product CLI, host SDK, eval suite, PR checklist, or prompt pack. | A **host-agnostic** staff log: swap the host; keep ADRs 0001–0006 and `node scripts/validate-all.mjs`. |

Row 1 is the usual refuse. Rows 2–3 are already machine-checked. If you cannot fill a **B** without inventing a collision, stay on one chat ([when-to-split-an-agent.md](when-to-split-an-agent.md)).

## A in practice

- One engineer, one repo, one desktop chat. No mail, pay, or deploy in the same window.
- You wanted a CLI named after the OS. This repo will not grow one. Proof stays `node scripts/validate-all.mjs`.
- You wanted an eval harness, a PR review kit, or a private HUD screenshot. Keep those in your tree; they are not this log.

## B in practice

- Inbox context can see bank or deploy keys → split + HITL ([when-to-split-an-agent.md](when-to-split-an-agent.md)).
- A merge, deploy, or send-as-user would go out if the human is away → persist the interrupt; **wait**.
- Handoffs are transcript pastes and the bill is the quality signal → typed `refs`, not blobs ([ADR 0005](../adr/0005-token-thrift.md)).

## Limit

- **Pattern / reference.** ADRs + contracts + checkers. Not a hosted OS you log into.
- **Host is replaceable.** Grok Bot / Cursor is the example mapping. A host swap must not rewrite the domain ([architecture.md](../architecture.md)).
- **No product CLI.** The proof is `node scripts/validate-all.mjs`.
- **External pattern refs only.** MCP, Anthropic agents, LangGraph HITL, OWASP agentic, AGENTS.md, 12-factor — not a catalog of other trees.

## What to read first

1. The [README](../../README.md) Judgment, then prove it: `node scripts/validate-all.mjs`
2. [architecture.md](../architecture.md) and [adr/README.md](../adr/README.md)
3. [first-week.md](first-week.md) if you are standing the OS up

When the loop already feels fast and slightly wrong: [failure-modes.md](failure-modes.md).

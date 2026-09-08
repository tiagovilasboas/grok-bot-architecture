# Context engineering

The window is a **budgeted assembly**, not the chat. [ADR 0005](adr/0005-token-thrift.md): thrift is a control. This page is the SoT for **what enters**, when we **fail closed**, and how Obs/evals relate. Budget lens (sinks, waste): [token-economy.md](token-economy.md).

Pattern first: [Anthropic — effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (smallest high-signal set). [12-factor agents](https://github.com/humanlayer/12-factor-agents) — own the window. We map that onto a **shared computer**, not a vendor SDK. Grok Bot / Cursor is the example host.

## What we will not claim

This repository has **no first-party prod numbers** — no window sizes we “run in prod,” no token invoices, no compaction ratios. Public write-ups may publish theirs; we use the lesson, not the integers. Scores live in [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) **in your tree**.

## What enters the window

The shared computer (board, interrupts, working tree) stays **outside** the window. The window **points at** it ([ADR 0002](adr/0002-shared-computer-vs-desktop.md)).

| Source | In the window | How it gets there | Out |
|---|---|---|---|
| **Board** | The **current** card | `goal`, `refs`, `write_policy`, `done_when` | Last week’s cards; mail bodies |
| **AGENTS.md** | Thin, harness-agnostic rules | Host loads once | Forked copies in extra rule files |
| **Tools** | This specialist’s allowlist | Schema for the job | Union catalog “for routing” |
| **Untrusted data** | Connector id + one-line summary | Inbox / issue / DOM / MCP body as **data** | Instructions that assign a hop |
| **Working tree** | Files named on the card | Receiver fetches the ref | Full-repo paste, “grep everything” |
| **Interrupt** | `id` + gate + empty `decision` | Persist on disk; resume with a human | Invented `decided_by` |
| **Obs** | Trace / thread id | Span names, not payloads | Tokens, PII, mail bodies in public traces |

Handoffs carry **refs**, not blobs ([crew/handoffs.md](crew/handoffs.md)). If a hop needs the mail, Inbox writes a one-line summary + connector id. The next window fetches.

## Budgets / thrift as a control

[ADR 0005](adr/0005-token-thrift.md) is the decision. [token-economy.md](token-economy.md) is where tokens actually go. Assembly rules that survive a host swap:

1. **Smallest high-signal set.** Fill the window with the current job. Do not fill it because the model can take more.
2. **One job in the window.** Inbox and Quinto in the same session is two secrets and two bills.
3. **Board is memory outside the window.** Anthropic’s “structured notes” map to the card, not to a second chat. Do not compact by pasting the transcript into the next specialist.
4. **Routines name `budget` and `stop`.** On hit: persist `block`. Do not finish loosely ([routines.md](routines.md)).
5. **Long isolated code buys a clean window**, not a second personality ([ADR 0006](adr/0006-cloud-agents-for-code.md)).
6. **Measure or shut up.** [OTel GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) spans beat a vendor-dashboard screenshot.

AISVS [C09](https://github.com/OWASP/AISVS/blob/main/1.0/en/0x10-C09-Orchestration-and-Agentic-Action.md) calls out orchestration budgets and a kill switch. We enforce the stop; we do not claim certification.

## Fail-closed: poisoned or oversized

HITL stays the four write gates (merge · deploy · secrets · messaging-as-user). Context fail-closed is **refuse / drop / block**, not a fifth interrupt. If nobody can name what is in the window and why, the hop does not start.

| Condition | What you see | Control |
|---|---|---|
| **Poisoned** | Mail, issue text, DOM, or an MCP resource tries to set `to:`, pick a tool, or reach an exfil path | Treat the body as data. Keep the connector **ref**. Do not copy instructions onto the card. Drop a lethal-trifecta leg ([security.md](security.md)). |
| **Oversized** | The job no longer fits; a routine “needs last week”; Código greps the tree to route | Tighten the query first. Persist `block` on budget hit. Split only when windows collide ([cookbook/when-to-split-an-agent.md](cookbook/when-to-split-an-agent.md)). Dispatch cloud for a fresh code window — do not stuff a worse blob. |
| **Unknown envelope** | Missing `to`, `refs`, or `write_policy` | Fail closed ([crew/handoffs.md](crew/handoffs.md)). Chat-only hosts write the envelope to disk first. |

**Stop doing:** Summarizing the thread *as* the handoff. Loading every MCP schema so the chief-of-staff can “route.” Using the browser as context ([ADR 0004](adr/0004-connectors-over-browser.md)). Compacting until a privileged write looks like a draft.

Token burn and fan-out are the same failure when the window is the dump ([cookbook/failure-modes.md](cookbook/failure-modes.md)).

## Obs / evals

**Obs** makes the loop inspectable: what entered, whether a budget stopped the run, residual risk. Log tool name, decision, interrupt id. Do not log secrets or bodies ([crew/roles.md](crew/roles.md#obs)).

**Evals** are not this OS. Use [agent-measurement](https://github.com/tiagovilasboas/agent-measurement): suites, named metrics, markdown reports. Measure; do not train. EXAMPLE fills there are not prod scores.

Checkable here (score **there**, in your tree):

- Hop carries `refs`, not a transcript.
- Untrusted body did not become `to:` on a card.
- Budget hit persisted `block` instead of “finishing loosely.”
- Privileged write still has empty `decision` until a human.

If you cannot point at a suite or a span, you do not have a number. Do not invent one in this repo.

## Related

- Decision: [adr/0005-token-thrift.md](adr/0005-token-thrift.md)
- Budget lens: [token-economy.md](token-economy.md)
- Trust: [security.md](security.md) · [crew/hitl.md](crew/hitl.md)
- Envelope: [crew/handoffs.md](crew/handoffs.md)
- When the loop is fast and wrong: [cookbook/failure-modes.md](cookbook/failure-modes.md)

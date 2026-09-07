# Token economy

Tokens are the **operating budget** of this OS, not a cloud invoice anecdote. [ADR 0005](adr/0005-token-thrift.md): thrift is a control. This page is how to apply it without inventing production figures.

## What we will not claim

This repository has **no first-party prod numbers**. Anthropic’s public multi-agent write-up is often cited (~4× vs chat, ~15× multi-agent). Those are **theirs**. We use the lesson (coordination dominates), not the integers. If you need a score, run [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) and keep the artifact in *your* tree.

## Where tokens actually go

| Sink | Typical waste | Control |
|---|---|---|
| Handoff | Paste of the whole thread | Envelope + `refs` only |
| Inbox | Last 500 mails in context | Connector query + filter; card, not dump |
| Código | Full-repo grep every hop | Card names likely paths; cloud agent gets a fresh window |
| Browser | Pixels / DOM as “context” | Don’t; connector first ([ADR 0004](adr/0004-connectors-over-browser.md)) |
| Routines | Polling “in case” | Trigger + `budget` + `stop` ([routines.md](routines.md)) |
| Chief-of-staff | Union of every tool schema | Per-role allowlist |
| Obs | Replaying bodies into traces | Span ids, not payloads |

## Rules that survive a host swap

1. **Refs, not blobs.** Path, SHA, issue id, interrupt id. The receiver fetches.
2. **One job in the window.** If Inbox and Quinto share a session, you are paying for both and leaking both.
3. **Split on collision, not on org-chart aesthetics.** [when-to-split-an-agent.md](cookbook/when-to-split-an-agent.md).
4. **Long isolated code leaves the desktop.** [ADR 0006](adr/0006-cloud-agents-for-code.md) — you buy a clean window, not a second personality.
5. **Budgets have a stop.** A routine that “keeps going until it feels done” is a runaway loop. AISVS C09 calls this out as orchestration control; we just enforce it.
6. **Measure or shut up.** [OTel GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) spans beat a screenshot of a vendor dashboard.

## Chief-of-staff discipline

The orchestrator is the cheapest place to waste money: it sees every card and wants every tool. Keep it **thin** — board, interrupts, routing. If it needs the mail body to route, Inbox writes a one-line summary + ref. If it needs the diff to route, Código writes `what / why / risk` + PR url.

## What “thrift” is not

- Not a smaller model as a moral stance. Use the model the job needs; cut the **context**.
- Not deleting HITL to save a round-trip. The expensive incident is cheaper to skip.
- Not caching secrets in the board to avoid a second tool call.

## Cookbook pointers

- First week: stay at two roles until a window collides ([first-week.md](cookbook/first-week.md)).
- Cloud: pay the remote job when the desktop window would otherwise hold a 40-minute SWE loop ([when-to-use-cloud-agent.md](cookbook/when-to-use-cloud-agent.md)).

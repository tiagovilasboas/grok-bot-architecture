# Routines

A routine is the crew loop on a **schedule or event**, not a cron prompt that “just handles it.” Same envelope, same write-boundaries, same HITL. The only new fields are **trigger**, **budget**, and **stop**.

## Why routines exist

Desktop assistants die in two ways: the human forgets the close, or the agent quietly sends/merges because it was Tuesday. Routines make the first problem a card. They do not get a pass on the second.

## Contract

| Field | Meaning |
|---|---|
| `name` | Stable id (`inbox-morning`, `quinto-close`, `obs-weekly`) |
| `trigger` | Cron, webhook, or human “run now” |
| `owner` | One specialist (chief-of-staff may only route) |
| `budget` | Max hops, max tokens (order of magnitude), max wall time |
| `stop` | What ends the run: `done_when`, budget hit, or interrupt |
| `write_policy` | Usually `draft` + explicit HITL gates |
| `refs` | Last close, last interrupt, last trace — not “see chat” |

If a routine cannot name `stop`, it is a daemon, not a routine. Do not add daemons in this OS.

## Example roster (pattern, not a product schedule)

| Routine | Owner | Trigger (example) | Optimistic | Fail-closed |
|---|---|---|---|---|
| Morning triage | Inbox | Weekday 09:00 local | Labels, board cards, drafts | Send-as-user |
| Day-5 close | Quinto | Monthly on the 5th | Ledger draft + anomaly list | Bank / tax send |
| Storefront drift | Vitrine | After a Código PR that touches public paths | Preview card | Publish |
| Ship window | Entrega | When a card is `kind: done` and write-policy says ship | Staging + checklist | Deploy / customer send |
| Loop health | Obs | Weekly | Trace/eval note | Mute prod, delete data |

Rename the cadence. Keep the gates.

## Triggers

Prefer **host-native schedulers** (the desktop host, a CI cron, a calendar webhook) over an agent that polls because it is bored. Polling burns tokens ([ADR 0005](adr/0005-token-thrift.md)) and hides stop conditions.

Evented is better than scheduled when the source already exists: “PR opened”, “invoice PDF landed”, “error budget burn”. The routine still writes a card; it does not jump the specialist.

## Budget and stop

- **Hops:** morning triage that spawns five specialists is a design bug. One owner, optional one hop to Obs.
- **Tokens:** if the routine needs last week’s full inbox, it needs a connector query with a filter, not a dump.
- **Wall time:** desktop sessions sleep. Long code does not belong in a routine — dispatch Código’s cloud path ([ADR 0006](adr/0006-cloud-agents-for-code.md)).
- **On budget hit:** persist a `block` on the board. Do not “finish loosely”.

## HITL inside a routine

Routines do not inherit a standing approve. A monthly close that always pays the same vendor still interrupts unless a **dated allowlist** says otherwise ([crew/hitl.md](crew/hitl.md)).

## What not to automate

- Anything that is really a **conversation with the user** (scope, taste, apology).
- First-time connector setup (auth is a human).
- “Watch the web and tell me if anything happens” with no query and no budget.

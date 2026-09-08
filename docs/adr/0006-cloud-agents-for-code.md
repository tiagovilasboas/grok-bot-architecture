# ADR 0006 — Cloud agents for code

## Status
Accepted

## Context
Desktop sessions are good at HITL, connectors, and “sit with the human.” They are a poor place to park a long, isolated code change: the window is shared, the laptop sleeps, and Inbox pings steal the thread. Cloud / remote agents give a fresh machine, a branch, and a PR — at the cost of latency and a weaker feel for local secrets.

## Decision
**Código** (and only code-shaped work) may dispatch a **cloud agent** for isolated implementation: one goal, one repo, one PR, no messaging-as-user. The desktop chief-of-staff keeps the board, the HITL gates, and connector writes. Cloud is not a second Inbox. Merge/deploy still fail closed on the desktop/human side. See [docs/cookbook/when-to-use-cloud-agent.md](../cookbook/when-to-use-cloud-agent.md).

## Consequences
+ Long jobs do not block the shared desktop computer
+ Cleaner write-boundary (branch + PR)
− Another host to keep vendor-agnostic; do not bake Cursor Cloud into the pattern
− Cloud agents still inherit HITL: they do not merge themselves

## See
[architecture.md](../architecture.md) (Código → Cloud). Mac vs box: [cookbook/failure-modes.md](../cookbook/failure-modes.md) · [cookbook/when-to-use-cloud-agent.md](../cookbook/when-to-use-cloud-agent.md).

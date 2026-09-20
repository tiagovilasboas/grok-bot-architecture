# ADR 0001 — Crew of agents

## Status
Accepted

## Context
A single desktop agent with every tool mixes planning, inbox, code, money, and ship in one window. Secrets leak across jobs. HITL becomes a shrug. Evals cannot score a role that does five things. An open swarm of peers spawning peers has the same failure mode with more hops.

## Decision
We will run a **crew**: a **chief-of-staff** (plan, route, interrupt) plus **specialists** with an explicit **job**, **objective**, and **write-boundary**. The chief-of-staff does not hold every tool secret. This is **crew + HITL + typed handoffs**, not an open swarm of peers spawning peers.

Example Mesa labels (`Chief-of-staff` / Chefe·Principal, `Inbox`, `Eng`, `Vitrine`, `Cibersec`, `Carreira`) are pattern names. Apps hub examples (`Quinto`, `LotRace`) are product owners, not Staff Mesa seats. `IronToy` is an optional hobby mapping. `Entrega` is not a first-class Mesa specialist on the example host — ship/merge/deploy stay HITL; Eng owns the PR and CoS/human merge. Do not add a role until context, secrets, or write-boundary actually collide.

## Consequences
+ Scoped evals and HITL per write-boundary
+ Host swap keeps the same jobs
− Coordination cost; a two-role crew is often enough on week one
− Need typed handoffs ([docs/crew/handoffs.md](../crew/handoffs.md))

## See
[architecture.md](../architecture.md) (CoS → specialists). Fan-out spam: [cookbook/failure-modes.md](../cookbook/failure-modes.md). Roster: [crew/roles.md](../crew/roles.md).

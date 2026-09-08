# ADR 0001 — Crew of agents

## Status
Accepted

## Context
A single desktop agent with every tool mixes planning, inbox, code, money, and ship in one window. Secrets leak across jobs. HITL becomes a shrug. Evals cannot score a role that does five things.

## Decision
We will run a **crew**: a **chief-of-staff** (plan, route, interrupt) plus **specialists** with an explicit **job**, **objective**, and **write-boundary**. The chief-of-staff does not hold every tool secret. Example names (`Inbox`, `Código`, `Vitrine`, `Quinto`, `Entrega`, `Obs`) are pattern labels, not a product roster. Do not add a role until context, secrets, or write-boundary actually collide.

## Consequences
+ Scoped evals and HITL per write-boundary
+ Host swap keeps the same jobs
− Coordination cost; a two-role crew is often enough on week one
− Need typed handoffs ([docs/crew/handoffs.md](../crew/handoffs.md))

## See
[architecture.md](../architecture.md) (CoS → specialists). Fan-out spam: [cookbook/failure-modes.md](../cookbook/failure-modes.md).

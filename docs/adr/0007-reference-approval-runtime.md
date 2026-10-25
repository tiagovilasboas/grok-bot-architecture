# ADR 0007 — Keep the approval runtime as a host-conformance example

## Status
Proposed — tracked by [issue #18](https://github.com/tiagovilasboas/grok-bot-architecture/issues/18).

## Context
The repository defines handoffs and approval records and validates their JSON shapes. It does not execute a task lifecycle. Integrators need an executable example for exact-action approval binding, replay prevention, cancellation, expiry, and recovery after interruption. A hosted service or universal runtime would violate the repository's reference scope and require choices about identity, storage, tools, and deployment that belong to each host.

## Decision
Provide a small, dependency-free Node.js example under `examples/approval-runtime/`. Treat it as a host-conformance reference, not a production authorization library. The example persists approval state before execution, delegates human authentication and resource authorization to trusted host callbacks, binds approval to a canonical action digest, and never automatically retries an action whose outcome may be unknown.

Keep storage, authentication, connector execution, and deployment replaceable. Document that the bundled file store is single-process and that hosts must supply authenticated identity, access control, concurrency-safe persistence, idempotent or transactional side effects, and recovery policy.

## Consequences
- Contributors can run and inspect one full approval lifecycle without a model, API key, package install, or external service.
- The example demonstrates safety invariants but does not authenticate users or enforce real tool permissions by itself.
- File persistence is suitable for a local conformance spike only; it is not a multi-process or distributed store.
- Exactly-once execution cannot be guaranteed across a crash and an external side effect. Ambiguous results remain blocked for reconciliation.
- Future host adapters must pass the same lifecycle scenarios before making stronger production claims.

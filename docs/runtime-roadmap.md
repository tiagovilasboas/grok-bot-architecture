# Runtime roadmap

This roadmap separates a runnable reference from production runtime work. The repository remains an open-source architecture and conformance reference; it does not become a hosted agent service.

## Signal and scope

The maintainer reports 17 GitHub stars in less than one week (2026-10-25). That is an early discovery and interest signal. Stars do not establish adoption, reliability, or production use. The next useful evidence is an independent maintainer running the walkthrough and reporting what failed or felt unclear.

## Current spike

The [approval-runtime example](../examples/approval-runtime/README.md) demonstrates a local approval lifecycle with a file-backed store, a trusted-host authentication callback, action digest binding, explicit rejection/cancellation/expiry, and a one-shot resume path. It fails closed on stale revisions and ambiguous execution outcomes.

**Known limits:** one process, local JSON files, no authentication implementation, no real connector, no cross-process lock, and no exactly-once guarantee for external side effects. The callbacks in the demo are illustrative only.

## Ordered work

| Priority | Task | Exit evidence | Status |
|---|---|---|---|
| P0 | Specify approval state transitions and trust boundaries | ADR 0007 plus host integration contract | In this spike |
| P0 | Implement a runnable local reference lifecycle | Approval, reject, expiry, cancellation, stale action, replay, crash recovery covered by tests | In this spike |
| P0 | Publish limitations and adoption instructions | Newcomer can run the demo without credentials or external services | In this spike |
| P1 | Add a host-adapter conformance fixture format | At least two independent adapters can run the same scenario pack | Open |
| P1 | Add an adapter for one real host | Auth identity is supplied by the host; tool scope and approvals are tested end to end | Open |
| P2 | Replace file storage with a transactional, concurrency-safe backend | Two concurrent resumes produce one accepted execution; restart behavior is tested | Open |
| P2 | Define idempotent connector execution and reconciliation | Failure injection demonstrates safe recovery around external side effects | Open |
| P3 | Collect independent adoption reports | At least three external users complete the walkthrough; issues and failures are summarized | Open |
| P3 | Compare a simple single-agent baseline with the coordinated flow | Same tasks, explicit quality rubric, coordination cost, and human interventions reported | Open |

## Immediate backlog

1. **Conformance format:** define versioned scenario inputs and expected terminal states, without embedding host credentials.
2. **First adapter:** choose a host only after a contributor volunteers a concrete integration; document its identity and tool enforcement boundaries.
3. **Storage backend:** evaluate SQLite or an existing host database for transactions and multi-worker concurrency. Do not add a database dependency before an adapter needs it.
4. **External action recovery:** use host-provided idempotency keys where supported; otherwise require reconciliation after an ambiguous outcome and never promise exactly-once behavior.
5. **Adoption:** invite independent contributors to run the quick start and file friction reports. Treat stars as interest, not an adoption count.

# Approval runtime conformance example

This dependency-free Node.js example makes one approval lifecycle executable. It is a **host-conformance spike**, not a hosted agent service, general workflow engine, or production security library.

## Run it

Requirements: Node.js 20 or newer. No installation, credentials, model API, or network access is needed.

```bash
node examples/approval-runtime/demo.mjs
node --test examples/approval-runtime/runtime.test.mjs
```

The demo creates a temporary local record and prints a simulated preview action. It does not publish content or call an external service.

## Lifecycle shown

1. Save a pending approval with a digest of the exact action, resource, revision, and arguments.
2. Ask a host-supplied authenticator for a trusted human identity and a separate authorization callback whether that person may decide this request; never accept an agent-written `decided_by` as proof.
3. Record approve or reject against the still-pending request and its expiry.
4. Before resume, resolve the current action again, compare its digest, and ask the host to authorize it.
5. Persist `executing` with a stable idempotency key before calling the host's action callback.
6. Persist completion. A callback error that carries `code: "not_sent"` moves the approval to `failed`, a terminal state where the host confirmed nothing was sent; create a new approval to retry. Any other callback failure is `outcome_unknown`. Do not retry automatically. `execution.error` holds only the error `name` and `code`, never its message or stack.

The state machine fails closed for expired, rejected, canceled, stale, unauthorized, failed (host reported not sent), replayed, or uncertain requests. Editing an action requires a new approval.

## Trust boundary and limits

The host callbacks are the trust boundary. The demo's credential string mapping is fictional and must never be copied as authentication. A real host must authenticate the human in an isolated UI/session, authorize who may decide each request, authorize the resource and action at execution time, protect state files, and ensure agents cannot call or replace privileged callbacks. The connector must enforce revision preconditions at the point of the side effect to close time-of-check/time-of-use races.

`JsonFileStore` uses atomic record creation/replacement and requests restrictive creation modes for local illustration. It has no cross-process locking or transaction support. The runtime's mutex only serializes calls through one runtime instance. A host must supply concurrency-safe durable storage before using multiple processes or workers.

Approval records include the action object and decision notes. Keep them minimal, use references for larger/private payloads, and never put credentials or access tokens in an action or note.

The code persists `executing` before calling a connector. If a process stops around an external side effect, it cannot know whether the side effect happened. The example records `outcome_unknown` and blocks automatic retry. A real host needs an idempotent connector or operator reconciliation; exactly-once external execution is not promised.

The example does not implement credential storage, identity verification, connector access control, distributed coordination, time-based job scheduling, or production observability. Read [the runtime roadmap](../../docs/runtime-roadmap.md), [ADR 0007](../../docs/adr/0007-reference-approval-runtime.md), and the [host integration contract](../../docs/host-integration.md) before adapting it.

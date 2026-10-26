# Host integration contract

The reference supplies documentation, role skills, JSON validators, and a bounded approval-lifecycle example. The host owns execution and authorization. A valid file is not an approval token.

| Boundary | Host responsibility | Verification scenario |
|---|---|---|
| Identity | Authenticate the human outside agent-generated text | Writing `decided_by: user` grants no authority |
| Tools | Enforce per-role and per-resource permissions | Inbox cannot obtain deployment tools |
| Approval | Bind to action, resource, revision, and validity window | Editing the target invalidates the prior approval |
| Persistence | Store state atomically and preserve pending decisions | Restart never auto-approves pending work |
| Replay | Consume authorizations once or use idempotency | Repeated resume does not repeat the transaction |
| Cancellation | Honor rejection and revocation before execution | Stale handoffs cannot revive a rejected action |
| Separation of duties | Refuse approval by the principal who requested the action | Requester approving their own request is rejected (`self_approval`) |
| Budgets | Enforce concurrency, tool calls, time, and spend | Exhaustion records a blocked card |
| Data | Restrict reference resolution and trace contents | Cross-domain refs cannot bypass access control |

The [approval-runtime spike](../examples/approval-runtime/README.md) makes part of this lifecycle executable. Reuse it as a conformance example, not as an authentication or storage layer.

Use files, tickets, a database, or a framework's interrupt mechanism. Human decisions can originate from an authenticated local or remote interface; physical location alone is not authorization.

## Current checker limits

Handoff validation checks required fields and policy shapes. References are non-empty strings; their content and access rights still need checking by the host.

Interrupt validation checks record shape, decision vocabulary, timeout declaration, dates, and a known-role denylist. It cannot prove that the named actor is human. The runtime spike depends on trusted host authentication and approval authorization callbacks; its example callbacks are not a security control. Keep authoritative approval records and execution controls outside an agent's unrestricted write access.

The fixture runner checks individual documents. The runtime tests exercise a limited set of transitions in one process, but neither the fixtures nor the local JSON store arbitrate multiple processes or enforce action budgets. Verify the scenarios above in the consuming system before granting real tools.

## Portable integration

Keep domain contracts stable while adapting identity, tool attachment, state storage, approval UI, and worker launching. No model, vendor, IDE, private skill library, paid plan, personal account, or operating system is required.

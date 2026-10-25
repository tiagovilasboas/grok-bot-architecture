# Walkthrough: draft, request approval, reject send

All identifiers and tasks below are fictional. The example does not connect a mailbox or send anything.

1. **Assign.** Chief-of-staff gives Inbox one task: draft a response to an event invitation. The card includes `write_policy: draft`, a fictional `mail://inbox/example-1` reference, and a reviewable-draft completion criterion.
2. **Draft.** Inbox reads the authorized item and returns a draft reference and uncertainties. Drafting can be complete while sending is a separate pending action.
3. **Interrupt.** If sending is requested, persist a record with `gate: messaging-as-user`, `default_on_timeout: wait`, and empty decision fields. The host binds it to the exact draft revision and pauses execution.
4. **Wait.** Timeout or restart leaves the request pending. No reply is inferred from elapsed time.
5. **Reject.** The human rejects sending through the host's authenticated interface. The host records the decision, actor, and timestamp. The draft remains available and no message is sent.
6. **Close.** Chief-of-staff reports the draft reference, rejected send request, and resulting status without copying message bodies.

Use [the handoff fixture](handoff.fixed.json) and [interrupt example](interrupt-record.example.md) as shapes. Validate adapted JSON files:

```bash
node scripts/validate-handoff.mjs /path/to/handoff.json
node scripts/validate-interrupt.mjs /path/to/interrupt.json
```

Validation does not execute any action. Writing `decided_by: user` is not authentication. If the human approves instead, the host must verify resource, revision, authority, expiration, and idempotency before execution. See [host integration](../docs/host-integration.md).

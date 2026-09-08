# HITL

Human-in-the-loop is the **default on side effects**, not a personality setting. Pause, persist, resume. If nobody answers, **wait**.

Public model: [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) (persist state, `resume` with the same thread). [12-factor agents](https://github.com/humanlayer/12-factor-agents) treat HITL as a tool call. We do the same on a desktop computer.

## Gates (fail closed)

| Gate | What pauses | Who resumes | If nobody answers |
|---|---|---|---|
| **Merge** | Default-branch merge, force-push, tag | User (or written allowlist) | Wait |
| **Deploy** | Production / customer-visible publish | User | Wait |
| **Secrets** | Vault, tokens, billing, bank, tax file | User | Wait |
| **Messaging-as-user** | Send mail/chat/social **as the human** | User | Wait |

Reads and **local drafts** may be optimistic. “Looks like a draft” is not a send.

Deleting repos, dropping tables, or muting production alerts inherits **Secrets** or **Deploy**. If unsure, escalate.

## Interrupt record

Persist at least: `id`, `gate`, `asked_at`, `asked_by`, `summary`, `refs`, `default_on_timeout=wait`, empty `decision`. Shape: [../../examples/interrupt-record.example.md](../../examples/interrupt-record.example.md).

Resume payload:

```text
id:            <interrupt id>
decision:      approve | reject | edit
decided_by:    <human>
decided_at:    <iso-8601>
notes:         <optional>
```

**Never invent `decided_by`.** A model completing the form is a failed gate, not a clever agent. That is silent approval ([cookbook/failure-modes.md](../cookbook/failure-modes.md)).

## Allowlists

An allowlist is a **written policy** on the shared computer (who, which connector, which environment, expiry). Examples that can be allowlisted after a Staff review:

- Label inbound mail (not send).
- Open a draft PR (not merge).
- Push to a throwaway cloud-agent branch.

Examples that stay gated even if the demo is waiting:

- Merge to `main`.
- Production deploy.
- Pay, rotate a key, or email a customer as the user.

## Related threat classes

HITL does not replace design. It is the last lock on [OWASP agentic](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) tool misuse and identity abuse. Inbox bodies and web pages still count as untrusted content — see [security.md](../security.md).

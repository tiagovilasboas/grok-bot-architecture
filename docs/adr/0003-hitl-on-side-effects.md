# ADR 0003 — HITL on side effects

## Status
Accepted

## Context
Agents that merge, deploy, rotate secrets, or message **as the user** create irreversible risk. Optimistic writes look fast in a demo and become an incident in production. Public HITL runtimes pause, persist, and resume; a shrug is not a gate.

## Decision
**Fail closed** on merge to a default branch, publish/deploy, secrets/billing, and **messaging-as-user**. Reads and local drafts may be optimistic. Persist an interrupt record (what, who, deadline, default = wait). Resume only with an explicit human `decision` + `decided_by`. An allowlist is a written policy, not a vibe in the prompt. Aligns with [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) and [OWASP agentic](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) tool-misuse / identity-abuse classes.

## Consequences
+ Safer default for a Staff desktop OS
+ Interrupt is inspectable and eval-able
− Slower demos; document the wait
− “Send the draft” is still a privileged write if it goes out as the user

## See
[architecture.md](../architecture.md) (User ↔ CoS HITL). Silent approval: [cookbook/failure-modes.md](../cookbook/failure-modes.md) · [crew/hitl.md](../crew/hitl.md).

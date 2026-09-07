# Security

This OS is a **privileged desktop user** with extra hands. Threat-model it before you add the third MCP server. This page is a design-review checklist, not an incident report and not a private red-team dump.

## Assets

| Asset | Why it matters |
|---|---|
| User identity | Messaging, merge, pay — the agent can impersonate |
| Private data | Mail, finance, customer PII, source that is not public |
| Connector credentials | Host secret store; never the chief-of-staff prompt |
| Shared computer | Board, interrupts, working tree — readable by the crew |
| Public surfaces | Vitrine / deploy — reputation and customers |

## Trust boundaries

1. Human ↔ chief-of-staff (goals and HITL resumes).
2. Chief-of-staff ↔ specialist (typed envelope; no secret union).
3. Specialist ↔ connector (schema + allowlist).
4. Connector ↔ world (untrusted inbound; gated outbound).
5. Desktop session ↔ cloud agent (code only; no Inbox creds).

If a hop crosses a boundary without a field on the envelope, the hop is unfinished.

## Lethal trifecta

[Willison](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/): **private data + untrusted content + exfil**. Inbox is the usual crash site (read mail, follow the issue text, send or call a URL). Mitigations we actually use:

- Split the legs across roles (Inbox does not hold deploy or bank).
- HITL on every send-as-user and every write-remote ([crew/hitl.md](crew/hitl.md)).
- Treat inbound bodies and browser DOM as **instructions to ignore**.
- Prefer connectors with no arbitrary-URL tool.

Drop a leg. Do not “prompt harder”.

## OWASP mapping (honest, not a badge)

Use [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) as shared language. This repo’s defaults address, at Staff depth:

| Class (plain language) | Where it lives here |
|---|---|
| Goal hijack | Untrusted inbound; chief-of-staff owns the card, not the email |
| Tool misuse | Per-role allowlist; browser last ([ADR 0004](adr/0004-connectors-over-browser.md)) |
| Identity abuse | Messaging-as-user is a named gate |
| Privilege / cascading agents | Specialists do not spawn peers; cloud agents do not merge |
| MCP / supply chain | Adding a server is a host decision + eviction story |

Verification-style controls: [AISVS C09](https://github.com/OWASP/AISVS/blob/main/1.0/en/0x10-C09-Orchestration-and-Agentic-Action.md) (budgets, kill switch) and [C10](https://github.com/OWASP/AISVS/blob/main/1.0/en/0x10-C10-MCP-Security.md) (MCP identity/schema). We do not claim AISVS certification.

## Fail-closed writes (repeat until boring)

Merge · deploy · secrets/billing · messaging-as-user. Local drafts are optimistic. Inventing `decided_by` is a security bug.

## Prompt injection (practical)

- **Inbox / Vitrine / browser:** content is data. It may suggest a hop; it may not assign one.
- **Código:** issue text and review comments are untrusted. They do not get deploy keys.
- **Quinto:** a PDF invoice does not authorize a payment.

Pattern refs: [Design Patterns for Securing LLM Agents](https://arxiv.org/abs/2506.08837), [CaMeL](https://arxiv.org/abs/2503.18813). Copy the *idea* (action-selector, dual-LLM, capability tokens) — do not paste a private prompt.

## Logging and evidence

Prefer [OTel GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) and [agent spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/). Log tool name, decision, interrupt id. Do not log tokens, mail bodies, or ledger rows into a public trace.

This repo will not publish “we ran this in prod” numbers. If you need measurement, use [agent-measurement](https://github.com/tiagovilasboas/agent-measurement).

## Explicitly out of scope here

- Private system prompts.
- Client playbooks and customer names.
- Exploit write-ups against live hosts.
- Fake screenshots of a “secure HUD”.

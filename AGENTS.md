# Agents

Harness-agnostic source of truth for this **desktop / multi-agent assistant OS** pattern. [Grok Bot](https://cursor.com) (Cursor) is the example host, not the architecture.

## Layout

```text
docs/architecture.md          layers: user · chief-of-staff · specialists · connectors · host computer
docs/adr/                     Nygard decision log (Accepted)
docs/crew/roles.md            job · objective · write-boundary
docs/crew/handoffs.md         typed hops (refs, not transcripts)
docs/crew/hitl.md             fail-closed interrupts
docs/routines.md              scheduled / evented loops
docs/connectors.md            MCP / APIs over browser
docs/security.md              lethal trifecta + privileged writes
docs/token-economy.md         context budget as a control
docs/cookbook/                first week · split · cloud
examples/                     filled board + interrupt record
```

## Pattern vs example host

| Layer | Meaning |
|---|---|
| Pattern | Crew of specialists, one shared computer, routines, connectors, HITL |
| Example host | Grok Bot on Cursor. Swap the host; keep roles, gates, and connector contracts |

## Do

- One job per specialist. Chief-of-staff plans, routes, and interrupts — it does not hold every tool secret.
- Pass work as a typed handoff (id, from/to, goal, refs, write_policy). Do not dump the chat.
- Fail closed on merge, deploy, secrets, and messaging-as-user. Persist the interrupt; resume only with an explicit human decision.
- Prefer connectors (MCP / APIs) over driving the browser. Browser is last resort and untrusted content.
- Spend tokens on the current job. Long isolated code work goes to a cloud agent ([ADR 0006](docs/adr/0006-cloud-agents-for-code.md)).

## Don't

- Lock the OS to one vendor, model, or IDE.
- Invent approval, send as the user, or merge because the demo is waiting.
- Publish private system prompts, client IP, or fake screenshots.
- Split an agent for ceremony. Split when context, secrets, or write-boundary actually collide.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing ADRs or crew contracts.

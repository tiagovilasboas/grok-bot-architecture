# Agents

Harness-agnostic source of truth for this **desktop / multi-agent assistant OS** pattern. [Grok Bot](https://cursor.com) (Cursor) is the example host, not the architecture.

## Layout

```text
docs/architecture.md          layers: user · chief-of-staff · specialists · connectors · host computer
docs/adr/                     Nygard decision log (Accepted)
docs/crew/roles.md            job · objective · write-boundary (Mesa · Apps · Hobby)
docs/crew/handoffs.md         typed hops (refs, not transcripts)
docs/crew/hitl.md             fail-closed interrupts
docs/skills.md                host-level reusable skills (recipes, not agents)
docs/routines.md              scheduled / evented loops
docs/connectors.md            MCP / APIs over browser
docs/security.md              lethal trifecta + privileged writes
docs/context-engineering.md   window assembly · thrift · fail-closed
docs/token-economy.md         context budget as a control
docs/cookbook/                first week · capabilities/controls · split · cloud · failure modes · when to use
examples/                     markdown shapes + JSON fixtures (broken/fixed)
scripts/validate-*.mjs        zero-dep; CI in .github/workflows/ci.yml
```

## Pattern vs example host

| Layer | Meaning |
|---|---|
| Pattern | Crew of specialists, one shared computer, routines, connectors, HITL |
| Example host | Grok Bot on Cursor. Swap the host; keep roles, gates, and connector contracts |
| Limit | Pattern / reference, not a hosted OS. The host is replaceable. |

## Do

- One job per specialist. Chief-of-staff plans, routes, and interrupts — it does not hold every tool secret.
- Pass work as a typed handoff (id, from/to, goal, refs, write_policy). Do not dump the chat.
- Fail closed on merge, deploy, secrets, and messaging-as-user. Persist the interrupt; resume only with an explicit human decision. CI rejects invented decisions (`node scripts/validate-all.mjs`).
- Prefer connectors (MCP / APIs) over driving the browser. Browser is last resort and untrusted content.
- Spend tokens on the current job. Long isolated code work goes to a cloud agent ([ADR 0006](docs/adr/0006-cloud-agents-for-code.md)).
- Skills are recipes any specialist can load ([docs/skills.md](docs/skills.md)); they are not agents and do not bypass HITL.

## Don't

- Lock the OS to one vendor, model, or IDE.
- Invent approval, send as the user, or merge because the demo is waiting.
- Publish private system prompts, client IP, or fake screenshots.
- Split an agent for ceremony. Split when context, secrets, or write-boundary actually collide.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing ADRs or crew contracts.

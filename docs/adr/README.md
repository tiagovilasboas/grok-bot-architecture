# Decision log

Architectural Decision Records for this desktop / multi-agent assistant OS. One decision per file. Short form follows [Nygard's template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) as described on [adr.github.io](https://adr.github.io/) (Status · Context · Decision · Consequences).

How to propose a new record: [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Index

| ADR | Status | Title | One-line |
| --- | --- | --- | --- |
| [0001](0001-crew-of-agents.md) | Accepted | Crew of agents | Specialists with job · objective · write-boundary; chief-of-staff plans and routes. |
| [0002](0002-shared-computer-vs-desktop.md) | Accepted | Shared computer vs desktop | The OS is a shared computer (FS, board, interrupts). Desktop chat is one host surface. |
| [0003](0003-hitl-on-side-effects.md) | Accepted | HITL on side effects | Fail closed on merge, deploy, secrets, and messaging-as-user. |
| [0004](0004-connectors-over-browser.md) | Accepted | Connectors over browser | Prefer MCP / APIs. Browser is last resort and untrusted content. |
| [0005](0005-token-thrift.md) | Accepted | Token thrift | Context budget is a control: refs not dumps, split when windows collide. |
| [0006](0006-cloud-agents-for-code.md) | Accepted | Cloud agents for code | Isolated, long-running code work leaves the desktop session. |

## Status lifecycle

`Proposed` → `Accepted` | `Rejected` | `Deprecated` | `Superseded by ADR-NNNN`

Never reuse a number. When reversing a decision, keep the old file and mark it `Superseded` with a pointer to the replacement.

## Related

- Layer model (diagram ↔ this index): [../architecture.md](../architecture.md)
- Crew contracts: [../crew/roles.md](../crew/roles.md)
- When the loop is fast and wrong: [../cookbook/failure-modes.md](../cookbook/failure-modes.md)
- Host swap without a domain rewrite: keep ADRs 0001–0006; change only the example host mapping (Grok Bot / Cursor today)

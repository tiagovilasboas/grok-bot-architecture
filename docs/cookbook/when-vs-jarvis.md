# When this repo vs jarvis

These two are related, not substitutes and not ports of each other. Pick by the artifact you need.

- Use **this repo** when you are standing up a **desktop assistant OS**: chief-of-staff, specialists, shared computer, connectors, routines, HITL. Example host: Grok Bot / Cursor. The pattern stays vendor-agnostic; swap the host, keep the crew contracts.
- Use **[jarvis-architecture](https://github.com/tiagovilasboas/jarvis-architecture)** when you need the host-agnostic **runtime layers** (brain · workers · ops) and a typed `handoff/v1` envelope that survives a runtime swap. That is the layer log, not this OS.
- Use **[kiro-crew](https://github.com/tiagovilasboas/kiro-crew)** when you need pasteable role cards (Planner → Implementer → Reviewer → Ops) for one crew in an agentic IDE.
- Do not copy jarvis `handoff/v1` field names into this envelope, and do not treat Inbox / Código as brain · worker · ops seats. Handoffs here are crew hops ([handoffs.md](../crew/handoffs.md)).
- Evals and AppSec `path:line` review live in [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) and [agentic-code-review](https://github.com/tiagovilasboas/agentic-code-review).

Desktop OS and HITL gates stay here. Layer contracts stay in jarvis-architecture.

# Grok Bot Architecture: Multi-Agent Reference Architecture

[![CI](https://github.com/tiagovilasboas/grok-bot-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/tiagovilasboas/grok-bot-architecture/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An open-source reference architecture for **AI agent orchestration**, **human-in-the-loop approval**, and **MCP connectors** on a shared workspace. Use typed handoffs, explicit tool permissions, and persisted approval requests to coordinate specialists across local and remote agent hosts.

The repository name is historical. The architecture works independently of any model, vendor, IDE, operating system, or agent framework. No model API key is needed to run the contract examples.

[Quick start](#quick-start) · [Walkthrough](examples/walkthrough.md) · [Architecture](docs/architecture.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## What you can use today

- **Six architecture decisions** covering specialist boundaries, shared state, approvals, connectors, context budgets, and isolated remote work.
- **Reusable role contracts** with a job, objective, and write boundary for every specialist.
- **Nine ready-to-load role skills** with procedures, output contracts, and quality review: [skill library](docs/skills.md).
- **Dependency-free JavaScript validators** for handoff and interrupt JSON records, with accepted and rejected examples.
- **Adoption guides** for a first week, failure modes, and deciding when multiple agents are justified.
- **CI checks** for contract fixtures and relative documentation links.

This is a reference architecture with executable contract checks. A consuming host must implement tool authorization, authenticated approvals, durable storage, and execution limits. Passing a JSON validator alone does not authorize an action or prove that a human approved it.

## Quick start

Requirements: Git and Node.js 20 or newer. The optional documentation link check additionally uses Bash; path resolution uses Node.js on both Linux and macOS.

```bash
git clone https://github.com/tiagovilasboas/grok-bot-architecture.git
cd grok-bot-architecture
node scripts/validate-all.mjs
```

No package installation, external services, or credentials are required. The command checks the bundled examples: intentionally broken records must be rejected and corrected records accepted. It exits nonzero when those expectations fail.

Check your own records separately:

```bash
node scripts/validate-handoff.mjs /path/to/handoff.json
node scripts/validate-interrupt.mjs /path/to/interrupt.json
```

These commands only validate files. They do not call connectors or execute the described action. Read the [complete walkthrough](examples/walkthrough.md) to follow a task from assignment to a pending approval and a rejected request.

## When this architecture helps

Use it when several jobs share infrastructure and their context, credentials, or write permissions need different boundaries: for example, inbox triage alongside engineering and publishing.

Start with a coordinator and one specialist. Add another role only when a concrete boundary justifies it. For one person working on one repository with one tool set, a single agent may be sufficient.

Use the [decision guide](docs/cookbook/when-to-use-this-pattern.md) before adding coordination.

## Architecture

```mermaid
flowchart TB
  User["User: goals and approval decisions"]
  CoS["Chief-of-staff: plan, assign, persist interrupts"]
  Specialists["Specialists: scoped work and typed handoffs"]
  Connectors["MCP connectors or first-party APIs"]
  Store["Shared workspace: board, references, interrupts"]
  Worker["Optional isolated remote code worker"]

  User --> CoS
  CoS --> Specialists
  Specialists --> Connectors
  CoS --- Store
  Specialists --- Store
  Specialists --> Worker
  Worker -->|"branch and review references"| Store
  CoS -->|"request approval"| User
```

The coordinator owns assignments and the board. Specialists receive scoped tools and references. The host enforces permissions; a persisted interrupt records a privileged action while the human decides.

See [architecture and trust boundaries](docs/architecture.md) and the [host integration contract](docs/host-integration.md).

## Roles

Keep the role that fits the work; the examples below do not imply that every installation needs the full crew.

| Role | Job | Write boundary |
|---|---|---|
| **Chief-of-staff** | Plan, route, interrupt | Board and interrupt records |
| **Inbox** | Triage inbound | Drafts; send-as-user requires approval |
| **Engineering** | Repository changes and review packaging | Branches; merge and deploy require approval |
| **Publishing** | Public surface | Drafts and previews; publish requires approval |
| **Security** | AppSec, privacy, and operational evidence | Notes; production changes require approval |
| **Career** | Career and professional surface | Drafts; messaging and publishing require approval |
| **Finance** (Apps) | Finance close | Ledger drafts; payments require approval |
| **Product** (Apps) | App product loop | App drafts; merge and production require approval |
| **Hobby** (Hobby, optional) | Side-product loop | Same scoped write and approval rules |

The roles and their names are reusable example labels. No real accounts, financial records, schedules, or personal workspace configuration are required. Full contracts: [roles](docs/crew/roles.md), [handoffs](docs/crew/handoffs.md), and [human-in-the-loop approvals](docs/crew/hitl.md).

## Contract guarantees and limits

| Check | Current behavior | Host responsibility |
|---|---|---|
| Handoff structure | Requires an owner, goal, completion condition, references, and a recognized write-policy shape | Resolve roles, references, and actual tool permissions |
| Approval record | Checks gate, timeout policy, decision fields, and known non-human role labels | Authenticate the approver and bind approval to the exact action |
| Timeout declaration | Requires `default_on_timeout: wait` | Actually pause execution and preserve state |
| References | Requires an array of non-empty strings | Enforce allowed reference schemes, access, and data minimization |
| Remote work | Documents isolated code work and review handoff | Isolate credentials, files, processes, and network access |

The current checkers validate individual records. They do not implement a workflow engine, authenticate identities, prevent replay, or guarantee safe concurrent execution.

## Documentation

| Start here | What you get |
|---|---|
| [Architecture](docs/architecture.md) | Layers, ownership, and trust boundaries |
| [ADRs](docs/adr/README.md) | Six decisions and their tradeoffs |
| [Walkthrough](examples/walkthrough.md) | A complete fictional task lifecycle |
| [Host integration](docs/host-integration.md) | What an adapter must enforce |
| [First week](docs/cookbook/first-week.md) | Adopt a small crew progressively |
| [Failure modes](docs/cookbook/failure-modes.md) | Context waste, excess delegation, and silent approval |
| [Connectors](docs/connectors.md) | MCP/API boundaries and least privilege |
| [Security design](docs/security.md) | Untrusted inputs and privileged operations |
| [Context engineering](docs/context-engineering.md) | References, budgets, and bounded context |

## Contribute and get help

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Small documentation fixes, anonymized adoption reports, and missing negative fixtures are useful contributions. Propose architecture changes through an ADR; use branches and pull requests.

- [Report a bug or improve the docs](https://github.com/tiagovilasboas/grok-bot-architecture/issues/new/choose)
- [Support](SUPPORT.md) and [Code of Conduct](CODE_OF_CONDUCT.md)
- [Report a security concern privately](SECURITY.md)
- [Changes and follow-up priorities](CHANGELOG.md)

Stars and forks indicate interest, not verified production adoption. The repository does not publish measured productivity, security, or cost improvements without supporting evidence.

## License

[MIT License](LICENSE), copyright © 2026 Tiago Vilas Boas. You may use, modify, and redistribute the project, including commercially, under the license terms.

Maintained by [Tiago Vilas Boas](https://github.com/tiagovilasboas). Contributions are welcome from any agent ecosystem.

# Grok Bot Architecture: AI Agent Teams, Skills, MCP & Human Approval

[![CI](https://github.com/tiagovilasboas/grok-bot-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/tiagovilasboas/grok-bot-architecture/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Grok Bot Architecture** is an independent, MIT-licensed reference for organizing **AI agent teams** with reusable **agent skills**, **MCP connectors**, and **human-in-the-loop approval**. Start with a chief-of-staff and scoped specialists, then use typed handoffs and persisted approval requests to coordinate work across local and remote hosts.

Looking for **Grok Bot multi-agent architecture**, **Grok Bot skills**, or a **chief-of-staff AI agent** pattern? This community project explains those design choices with portable role contracts and examples. It is not affiliated with xAI or Cursor and does not contain the Grok Bot product's source code. The architecture is model- and framework-independent; no API key is needed to validate its examples.

[Quick start](#quick-start) · [Walkthrough](examples/walkthrough.md) · [Architecture](docs/architecture.md) · [Grok Bot FAQ](docs/grok-bot-faq.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

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
  Human["Human operator<br/>Goals, scope and approval decisions"]

  subgraph Core["Core team"]
    direction TB
    CoS["Chief-of-staff<br/>Scope · assign · review"]
    Engineering["Engineering<br/>Code · PRs · CI"]
    Publishing["Publishing<br/>Documentation · public content"]
    Security["Security<br/>AppSec · privacy review"]
    Inbox["Inbox<br/>Triage · drafts · scheduling proposals"]
    Career["Career<br/>Opportunity screening · application drafts"]
    CoS --> Engineering
    CoS --> Publishing
    CoS --> Security
    CoS --> Inbox
    CoS --> Career
  end

  subgraph Domain["Domain specialists · optional"]
    direction LR
    Finance["Finance<br/>Finance workflows · reconciliation drafts"]
    Product["Product<br/>Requirements · acceptance · previews"]
    Hobby["Hobby<br/>Research · comparisons · shortlists"]
  end

  subgraph Host["Host adapter · vendor and framework independent"]
    State["Shared state<br/>Board · typed handoffs · references"]
    Skills["Role skills<br/>Nine reusable SKILL.md recipes"]
    Tools["Scoped tool access<br/>Per-role permissions · budgets"]
    Approval["Approval gate<br/>Authenticate · bind action and revision<br/>No decision: wait"]
    Connectors["MCP connectors / first-party APIs<br/>Authorized reads · drafts · approved actions"]
    Worker["Optional isolated code worker<br/>Branch + review evidence"]
  end

  Human -->|"goal and constraints"| CoS
  CoS --> Finance
  CoS --> Product
  CoS --> Hobby
  Core --- State
  Domain --- State
  Skills -.->|"task-specific instructions"| Core
  Skills -.->|"task-specific instructions"| Domain
  Core --> Tools
  Domain --> Tools
  Tools -->|"authorized reads and drafts"| Connectors
  Tools -->|"privileged action request"| Approval
  Approval -->|"request decision"| Human
  Human -->|"explicit decision"| Approval
  Approval -->|"approved action within scope"| Connectors
  Engineering -->|"scoped implementation"| Worker
  Worker -->|"branch and PR references"| State
```

Chief-of-staff coordinates five other Core team roles and three optional Domain specialists. Each role loads its own skill and works through scoped host permissions. Shared state carries assignments and evidence; privileged actions require an authenticated decision bound to the action and revision. Isolated code workers return review artifacts through Engineering.

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

## Grok Bot questions

### What is Grok Bot?

The [official Grok Bot overview](https://docs.x.ai/grok-bot/overview) describes persistent AI teammates that work across connected apps and a shared computer. This repository is an independent architecture reference for organizing that kind of work. Product installation, pricing, and account support belong in the official documentation.

### Is this an open-source Grok Bot implementation?

This reference architecture, its nine role skills, and its local validators are open source under MIT. They are not the Grok Bot service, its backend, an official SDK, or a reverse-engineered implementation.

### How do I organize a Grok Bot team?

Start with Chief-of-staff plus the specialist needed for one task. Define its scope, references, permitted actions, and completion criteria. Use the [nine role contracts](docs/crew/roles.md) and [skill library](docs/skills.md) as recipes; map them to the host's supported tools and approval mechanisms.

### Can I use the agent skills with another model or framework?

Yes. The files are portable instructions and contracts. Adapt tool names, state storage, and skill loading to your host. Compatibility with a specific host needs verification; copying a skill does not install an integration or enforce permissions.

### Do separate bots isolate secrets and tool access?

Role names alone do not create isolation. The host must enforce permissions and data boundaries. On a shared computer, review which files, credentials, and sessions each bot can actually reach. See [host integration](docs/host-integration.md) and the [Grok Bot FAQ](docs/grok-bot-faq.md).

More questions: [Grok Bot skills, MCP, routines, and approval FAQ](docs/grok-bot-faq.md).

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

# Contributing

This repository documents a **harness-agnostic** desktop / multi-agent assistant OS: crew, shared computer, routines, connectors, HITL. Grok Bot (Cursor) is the example host. The same pattern should map onto another desktop harness without rewriting the domain.

Contributing language for this file, issue forms, and pull requests is **English**. Commands and paths stay in English fences.

```text
docs/adr/NNNN-short-title-with-dashes.md
docs/crew/roles.md
docs/crew/handoffs.md
docs/crew/hitl.md
docs/architecture.md
```

Propose changes through issues and pull requests. Do not commit to `main`.

## What belongs here

Architecture, crew contracts, ADRs, cookbooks, and **filled examples that invent no private prompts or screenshots**.

This repo is **not** a vendor SDK, a system-prompt dump, or a client playbook. Do not add host-only APIs as if they were the OS. Do not paste private workspace trees from sister repos.

## Quality bar

Keep the OS **simple, composable, and inspectable**. Public materials we treat as pattern refs, not dependencies:

| Pattern | What to keep in our docs |
|---|---|
| [Orchestrator / workers](https://www.anthropic.com/engineering/building-effective-agents) | Chief-of-staff decomposes; specialists stay in scope. Add a role only when context, secrets, or write-boundary collide. |
| [MCP](https://modelcontextprotocol.io/docs/learn/architecture) | Host / client / server. Tools have a contract. Browser is not a connector. |
| [HITL interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) | Pause, persist, resume with an explicit human decision. Do not invent approval. |
| [12-factor agents](https://github.com/humanlayer/12-factor-agents) | Own prompts, context, and pause/resume. HITL is a tool call, not a vibe. |
| [AGENTS.md](https://agents.md/) | Repo-level agent instructions stay thin and harness-agnostic. |

A useful change is **concrete**: one extra gate, one handoff field, one cookbook rule — not a new abstraction layer.

## How to propose an ADR

An [Architectural Decision Record](https://adr.github.io/) captures **one** architecturally significant decision. The log uses [Nygard's short form](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (Status · Context · Decision · Consequences).

### 1. Open an issue first

Use the **Propose an ADR** form (`.github/ISSUE_TEMPLATE/propose-adr.yml`). An ADR is warranted when the change affects:

- Layer boundaries (user / chief-of-staff / specialists / connectors / host computer)
- HITL or fail-closed write policy
- Connector vs browser, token budget, or cloud vs desktop placement
- Vendor lock-in or a host swap that would force a domain rewrite

Skip an ADR for typos and hygiene.

### 2. Draft the record

Copy the next unused number. Never reuse a number. If a decision is reversed, keep the old file and mark it `Superseded` with a pointer to the replacement.

```text
docs/adr/NNNN-short-title-with-dashes.md
```

```markdown
# ADR NNNN — Short title

## Status
Proposed

## Context
Value-neutral facts and forces.

## Decision
We will …

## Consequences
Positive, negative, and neutral.
```

Status lifecycle: `Proposed` → `Accepted` | `Rejected` | `Deprecated` | `Superseded by ADR-NNNN`.

### 3. Open a pull request

One ADR per PR when the decision is the change. Link the issue. Fill in `.github/PULL_REQUEST_TEMPLATE.md`.

## How to improve crew docs

For each role in `docs/crew/roles.md`, keep three things obvious:

1. **Job** — one sentence.
2. **Objective** — what “done” looks like.
3. **Write boundary** — writes vs comment-only, and whether HITL is required.

Example names (`Inbox`, `Código`, `Vitrine`, `Quinto`, `Entrega`, `Obs`) are pattern labels. Prefer denser contracts over new names.

Handoffs (`docs/crew/handoffs.md`) are a message protocol: next owner + expected output. No silent hop.

HITL (`docs/crew/hitl.md`) fails closed on merge, deploy, secrets, and messaging-as-user. If nobody answers, **wait**.

## Pull requests

- Branch from `main`; never push commits to `main`.
- Keep PRs focused. Hygiene and a new ADR do not belong in the same PR (this initial density PR is the exception).
- Commands and paths in descriptions stay in English fences.

```text
docs/adr/0007-example-decision.md
```

## Principles (do / don't)

**Do**

- Record one decision per ADR, with context and consequences.
- Treat MCP as the agent-to-tool protocol, not as a vendor.
- Keep HITL (or an explicit allowlist) on privileged writes.
- Pass work as a typed envelope, not a pasted transcript.
- Name Grok Bot, Cursor, Goose, Codex, Kiro as examples only.

**Don't**

- Lock the architecture to one IDE, model vendor, or framework.
- Mix chief-of-staff planning with every specialist’s production secrets.
- Add an ADR without an issue and a PR (after this bootstrap).
- Rewrite superseded ADRs in place.
- Invent screenshots, private system prompts, or production token numbers.

## License

Contributions are licensed under [MIT](LICENSE).

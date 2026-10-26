# Grok Bot FAQ: AI agent teams, skills, MCP, and human approval

This is an independent community architecture reference, not product support or a claim about Grok Bot's internal implementation. The public recipes are portable across hosts.

## Where should I start with Grok Bot?

Use the [official product overview](https://docs.x.ai/grok-bot/overview) for supported capabilities and the [official getting-started guide](https://docs.x.ai/grok-bot/get-started) for account and setup instructions. For this reference, follow the [repository quick start](../README.md#quick-start) and [fictional walkthrough](../examples/walkthrough.md). Running local validators does not create a bot or connect an account.

## How is a chief-of-staff agent different from a specialist?

Chief-of-staff scopes, assigns, tracks, and reviews. A specialist owns a bounded deliverable. Begin with two roles and add another when context, expertise, or permissions genuinely need a separate boundary. The coordinator should not inherit every specialist's credentials. See [role contracts](crew/roles.md).

## How do I create Grok Bot skills?

This repository provides nine [SKILL.md recipes](skills.md) describing triggers, procedures, outputs, and review criteria. Use your host's documented skill mechanism and supported format. Treat the repository files as editable instructions; no automatic installation or vendor-specific loader compatibility is promised.

See the [official skills and routines documentation](https://docs.x.ai/grok-bot/skills-routines-and-automations) for the product's current mechanism.

## What is the difference between an agent, a skill, and a routine?

An agent owns a role and task context. A skill is a reusable procedure. A routine starts a bounded task on a schedule or event. A routine still needs an owner, budget, stop condition, and applicable approvals. See [skills](skills.md) and [routines](routines.md).

## How do MCP connectors fit into this architecture?

MCP tools or first-party APIs provide scoped access to external systems. The host configures authentication and permissions. This repository contains connector design guidance, not an MCP server or an integration installer. Use only the capabilities your host actually exposes; browser access is a separately scoped fallback. See [connectors](connectors.md).

## How should multi-agent handoffs work?

Pass a goal, owner, references, write policy, and completion criteria. Return output references and blockers rather than a transcript dump. A well-formed handoff does not grant access to the referenced resource; the host checks that separately. See [handoffs](crew/handoffs.md).

## Does human-in-the-loop mean the JSON validator protects my accounts?

No. The checker validates record shape and certain invariants. The host must authenticate the human, bind approval to the action and target revision, preserve pending state, and prevent replay. A role must not approve its own privileged action by filling a field. See [host integration](host-integration.md).

## Do different bots have separate computers or credentials?

Do not assume separation from role labels. The [official overview](https://docs.x.ai/grok-bot/overview) describes shared computer resources within an account. Verify the current product documentation and actual host permissions before giving a bot sensitive data or tools. Architecture roles are not evidence of operating-system or credential isolation.

## Can I use this with a different agent framework?

Yes, the contracts and instructions are framework-independent. Adapt storage, tool attachment, approval, and execution to the consuming host. Framework-specific compatibility, security, and reliability need their own verification.

## Is this free, and does it include Grok Bot access?

The repository is [MIT licensed](../LICENSE) and its validators run locally without a model API key. It does not include a hosted service, a model subscription, or product account access. Consult official product documentation for current plans.

## Is this the source code or a technical blueprint of the official Grok Bot?

No. It is a community reference with its own design decisions, generic examples, and nine role recipes. It does not establish the vendor's backend, security guarantees, or internal protocols.

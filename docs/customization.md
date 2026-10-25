# Customize your agent team

This reference grew from the maintainer's personal use. Your work, tools, and risk boundaries will differ. Adopt the smallest useful subset and change it deliberately.

## What you can customize

| Surface | Adapt to your use |
|---|---|
| Roles | Names, responsibilities, groups, number of specialists, escalation paths |
| Skills | Triggers, procedure, outputs, domain terminology, review checklist |
| Runtime | Model, provider, framework, local/remote execution, state store |
| Tools | Source-specific connectors, allowed resources, read/draft/write permissions |
| Routines | Events, schedules, filters, batch size, disabled/enabled state |
| Budgets | Time, tokens, tool calls, parallel workers, external contribution batches |
| Reviews | Completion criteria, required evidence, review ownership and approvals |
| Presentation | Output language, summary format, public documentation and examples |

Customization changes the design and its guarantees. Verify the chosen host enforces the boundaries you claim. Role names and instruction files alone do not create isolation.

## First adaptation

1. Choose one real task and a measurable completion criterion.
2. Start with one specialist; add Chief-of-staff when coordination creates value.
3. Copy its [role skill](skills.md), rename it if useful, and remove irrelevant steps.
4. Map tools to specific sources/resources and read, draft, or write authority.
5. Set an explicit budget and stop condition; make any approval gate enforceable by the host.
6. Try a fictional or non-sensitive task first and inspect the output and pending decisions.
7. Add another role only when a concrete boundary or expertise need justifies it.

## Reusable role template

```markdown
# Role name
Mission: What problem this role owns.
Trigger: When to use it.
Inputs: Minimum authorized context and source references.
Procedure: Bounded steps appropriate to the task.
Deliverable: The artifact the next person or agent can inspect.
Authority: Allowed tools/resources/actions and required approvals.
Done when: Observable acceptance criteria.
Stop or escalate: Missing input, exhausted budget, rejection, or missing authority.
```

See [role contracts](crew/roles.md), [skills](skills.md), and [example policy](../examples/operator-policy.example.json). The policy file is illustrative; it is not automatically loaded or enforced.

## Keep your private setup private

Store real accounts, credentials, personal preferences, schedules, and private project mappings in a separate private workspace or host configuration. Publish fictional fixtures and reusable contracts. Keep copyright and license attribution when reusing the MIT material.

## Repository agent instructions

[AGENTS.md](../AGENTS.md) guides contributors to this repository across agent hosts.
[CLAUDE.md](../CLAUDE.md) imports it and gives Claude a practical navigation/workflow entry point.
Neither file deploys the crew or replaces the consuming project's own instructions.

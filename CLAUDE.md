# Claude contributor entry point

@AGENTS.md

## Start here
Read the imported AGENTS.md as shared repository policy.
This file helps Claude navigate and execute that policy without duplicating it.
If importing is unsupported by your host, read AGENTS.md directly before acting.

## Select the working role
Use the user request to choose the needed expertise, not a fixed persona for every task.
- Code, validators, fixtures, CI: skills/engineering/SKILL.md.
- README, public docs, positioning: skills/publishing/SKILL.md.
- Security or privacy review: skills/security/SKILL.md.
- Coordination across distinct deliverables: skills/chief-of-staff/SKILL.md.
- Other domains: use docs/skills.md to find the one relevant skill.
Loading a skill is not permission to send, buy, merge, deploy, or attach tools.
Do not start a nine-agent crew merely because nine role files exist.

## Practical contribution loop
1. Read the affected file, its relevant contract, and CONTRIBUTING.md.
2. State concrete completion criteria and use a short plan when several changes depend on each other.
3. Inspect existing work and preserve unrelated edits. Create a focused branch for the proposal.
4. Edit the smallest set that makes the request coherent; update cross-links and examples as needed.
5. Use the relevant checks from AGENTS.md and inspect their output.
6. Return the reviewable artifact, verification performed, limitations, and next required decision.

## Examples of useful judgment
For a README request, explain the project's personal origin and reusable value without
exposing the maintainer's private setup. Keep links, role names, and capability claims accurate.
For a validator change, inspect both accepted and rejected cases; a fixture suite does not
prove authenticated approval, runtime isolation, or production safety.
For a customization request, change procedures and configuration while retaining an explicit
owner, bounded permissions, completion criteria, and applicable human approval.
For a tool or access failure, record the exact operation and observed reason. Do not retry
unchanged requests indefinitely or claim that consent alone fixed a missing credential.

## Keep context and handoffs small
Load the one skill and source files required by the current task.
Use references rather than complete logs or inbox contents.
Report facts and uncertainty in plain language. Respect the user's requested language;
repository-facing contributions and commit descriptions use English.
A useful final handoff states what changed, why, how it was checked, and any pending gate.

## What this file does not configure
It does not provision a model, install connectors, schedule routines, create accounts,
or grant execution permissions. Runtime configuration belongs to the consuming host.
Keep shared rules in AGENTS.md and reusable role procedures in skills/.

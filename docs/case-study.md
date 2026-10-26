# Case study: a team of bots that acted on its own

Sanitized. Bot names, clients, repositories, employers, and identifiers are removed. The numbers are not given because none was measured.

## Problem

A small team of Grok Bot teammates ran several routines on a schedule. One routine was written to be helpful end to end: when it found an open pull request, it replied on the pull request, asked a contributor for co-authorship, and, in a cleanup step, deleted a fork using a flag that confirms every prompt. Each step looked reasonable on its own. Together they were external actions taken without anyone asking for them, and one of them was not reversible.

The routine had no stop condition and no budget. Nothing in it said what counted as done, so the only limit was the routine's own judgment.

## Decision

Two rules, applied to every routine on the team:

1. **List and wait.** A routine may read and draft. Any step that changes something outside the workspace (a comment, a merge, a push, a deletion, a message) is written on the card as "needs your yes", and the routine stops until the human answers in the owning Bot's direct chat. Silence means wait.
2. **Budget and stop on every routine.** Each routine names an owner, a maximum number of Bots, messages, and minutes, a stop condition, and a write policy (read, draft, or human-approved). If the budget runs out or the source cannot be read, the routine writes one blocked card with the reason, and it does not retry.

These rules follow [ADR 0003](adr/0003-hitl-on-side-effects.md) and the [routine contract](routines.md). The example routine in [grok-bot/routines](../grok-bot/routines/example-routine.md) applies them.

## Alternative considered and discarded

An importable JSON template for each bot profile, so the whole team could be set up in one step. It was discarded because the app does not import profile files. Pasteable text works in the app today, so it was the cheaper option.

## Result

The decision is recorded. Applying it to the team's live routines was still pending when this was written, so there is no before-and-after measurement and no claim that the incident class is gone. What changed is the rule every new routine must meet before it is enabled.

## Limits

- One team, one operator, and one class of incident. This does not show that the rules generalize.
- The budget lives in the routine's instructions, not in the product. Grok Bot documents no budget setting for routines, so a Bot can still ignore it.
- The rules are only as good as the approval gates behind them. See the [approval policy](hosts/grok-bot/approval-policy.md) for the settings that back them.

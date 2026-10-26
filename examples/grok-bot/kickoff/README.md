# Grok Bot kickoff messages

Copy-paste first messages for the nine roles in [docs/crew/roles.md](../../../docs/crew/roles.md). Each message gives one Bot its job, sources, approval boundary, and done-when, then asks it to remember them. These are fictional, generic examples. None has been run on a real Grok Bot account; see [Not verified](../../../docs/hosts/grok-bot/mapping.md#not-verified).

## Start with one Bot

xAI recommends one Bot that owns an end-to-end outcome. Add a specialist only for a distinct goal, toolset, working style, approval boundary, or recurring schedule ([platform facts](../../../docs/hosts/grok-bot/platform-facts.md)). Most projects should start with one kickoff, not all nine.

## Use a kickoff file

1. Choose the role that owns the outcome.
2. Replace `<Name>`, `<project>`, and `<user>`. Replace each source with a real, authorized source. Delete any source you do not authorize.
3. Read the approval boundary. Keep every line unless you have a documented reason to change it.
4. Open a one-to-one chat with the new Bot and paste the block.
5. Wait for the Bot to confirm the rules back. If it misses one, correct it before the first task.
6. Send the first task, then check the result against the done-when line.

The "First task" note under each file is a fictional example. Replace it with a real, bounded task from your board.

## What a kickoff does not do

- It does not enforce permissions. Bots on one account share `/workspace`, connected apps, and sign-ins. Approvals and Auto Review are the enforced levers ([mapping](../../../docs/hosts/grok-bot/mapping.md)).
- Memory is not authoritative. Keep changing facts in their source systems, and ask the Bot to reopen them before a consequential decision.
- Never paste passwords, one-time codes, tokens, or account numbers into a kickoff. Login, two-factor, and secret steps belong to the human.

## Coordinator group kickoff

Use a group only when several Bots must hand work to each other. A group holds two to six Bots, and one coordinator Bot can assign work inside it ([platform facts](../../../docs/hosts/grok-bot/platform-facts.md)).

- Name the coordinator Bot in the group's first message. It routes work; it does not own the specialist outcomes.
- Give each stage one owner. xAI advises against parallel handoffs on the same item, because they cause duplicate work.
- Approval requests and secret or login requests do not appear in group chats. Approvals still happen in the owning Bot's direct chat.
- Bot-to-group handoffs are text-only. Pass a board card reference and a short summary, not a transcript.
- Stop-now ends work but does not undo completed actions. Record any completed action on the board.

## Files

| Role | File | Job |
|---|---|---|
| Chief-of-staff | [chief-of-staff.md](chief-of-staff.md) | Coordinate scoped work and review specialist evidence. |
| Inbox | [inbox.md](inbox.md) | Triage authorized inbound sources and prepare attention or scheduling drafts. |
| Engineering | [engineering.md](engineering.md) | Implement and package one repository change for review. |
| Publishing | [publishing.md](publishing.md) | Improve accurate public documentation and technical content. |
| Security | [security.md](security.md) | Review scoped application security and technical privacy risks. |
| Career | [career.md](career.md) | Screen opportunities and prepare truthful tailored applications. |
| Finance | [finance.md](finance.md) | Own finance-application requirements and draft reconciliation workflows. |
| Product | [product.md](product.md) | Own one application's product loop from problem to reviewable increment. |
| Hobby | [hobby.md](hobby.md) | Research discretionary interests and compare options transparently. |

The approval boundaries follow the Write boundary in [roles.md](../../../docs/crew/roles.md) and the Safety and authority section of each `skills/<role>/SKILL.md`.

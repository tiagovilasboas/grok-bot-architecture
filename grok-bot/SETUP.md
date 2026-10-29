# Setup in 10 steps

From zero to a first card with a human approval stop. Use placeholders for your project and never real account data. Each step ends with **Done when:**, a check you can see.

Concepts used: Bot, group chat, skill, routine, connector, memory. The product's exact menus can change, so this guide names what to do, not where to click. If a step does not match your app, check the [official Grok Bot docs](../docs/hosts/grok-bot/platform-facts.md).

1. **Create the coordinator Bot.** In the app, create a Bot for the Chief-of-staff role. Give it a name.
   **Done when:** the Bot opens a one-to-one chat with you.

2. **Load its hard rules.** Paste the block in [profiles/chief-of-staff.md](profiles/chief-of-staff.md) as the first message, and ask it to remember the rules and confirm them back.
   **Done when:** it repeats the rules back, including the approval and budget rules.

3. **Create the specialist Bots.** Create an Engineering Bot and an Inbox Bot the same way, using the hard rules in [profiles/engineering.md](profiles/engineering.md) and [profiles/inbox.md](profiles/inbox.md) (for the remaining six roles, use the full role kickoffs in [examples/grok-bot/kickoff/](../examples/grok-bot/kickoff/README.md)). Each one has one job.
   **Done when:** each specialist confirms its own rules, and no specialist repeats another's.

4. **Add the skills.** Open the `SKILL.md` you want from this repo, paste its full text, and ask the Bot to save it as a private skill. Start with the engineering skill for the Engineering Bot.
   **Done when:** typing `/` in that Bot's chat lists the skill.

5. **Create a group chat.** Add the coordinator and the two specialists to one group. Describe the shared outcome and who owns each stage.
   **Done when:** the group shows all three Bots, and each stage has one owner.

6. **Write the approval rules.** Add Ask first rules for merge, deploy, secrets, and messaging as the user, using the text in [approval-policy.md](../docs/hosts/grok-bot/approval-policy.md). Use the approval level that document recommends.
   **Done when:** the four rules appear in the app's Auto Review settings.

7. **Create the board.** In the shared workspace, create `board.md` with one card: owner, goal, write boundary, done-when. Use the format in [board.example.md](../examples/board.example.md) or generate and validate it via [`scripts/board.mjs`](../scripts/board.mjs).
   **Done when:** the Engineering Bot reads the card and names its owner back.

8. **Connect only what the card needs.** Connect one connector, if the card needs one. Do not connect more.
   **Done when:** the connector shows as connected, and only the Bot that needs it can use it.

9. **Send a read-only first card.** Ask the Engineering Bot to check the repository's status and report evidence, without changing anything.
   **Done when:** it returns the evidence and states the done-when check it ran.

10. **Trigger one approval on a safe target.** Ask the Engineering Bot to merge a test change in a repository you do not care about. It must stop and ask in its direct chat.
    **Done when:** the approval request appears in that Bot's chat, and nothing changes until you answer. Then answer no, and confirm nothing changed.

## After setup

- Turn on a routine only after its budget and stop are in place. Start from [the example routine](routines/example-routine.md).
- Run a routine's **Test** only with an input that is safe to act on.
- To check the whole path again, follow the [walkthrough](../examples/grok-bot/walkthrough.md).

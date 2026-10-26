# Grok Bot walkthrough: from install to approval stop

This walkthrough guides a newcomer through one end-to-end path on Grok Bot: installing role skills, creating a Bot, writing a board card in `/workspace`, running a scoped task, scheduling a routine, and hitting a human-in-the-loop approval stop.

**Documentation status: documented, not observed on a real account.** Steps involving Grok Bot UI actions and plugin installation reflect official documentation as recorded in [platform facts](../../docs/hosts/grok-bot/platform-facts.md) and [host mapping](../../docs/hosts/grok-bot/mapping.md). Running it on a live account is optional; see the [verification report](../../docs/hosts/grok-bot/verification-report.md). All identifiers, repositories, and tasks below are fictional; no real credentials, tokens, or private data are required.

---

## 1. Install role skills

Choose one of the documented installation paths in the [Grok Bot install guide](../../docs/hosts/grok-bot/install.md):

- **Cursor plugin:** Import this repository into the Cursor dashboard or team marketplace using the manifest at `.cursor-plugin/plugin.json`. *(Status: pending real-account verification).*
- **Paste-and-save:** Open the role skill file (e.g. [skills/engineering/SKILL.md](../../skills/engineering/SKILL.md)), copy its full content including frontmatter, paste it into a direct chat with your Bot, and ask it to save it as a private skill. Verify that typing `/` in the composer lists the skill.

Remember: saving a skill provides instructions; it does not grant permissions or bypass approvals ([mapping.md](../../docs/hosts/grok-bot/mapping.md)).

## 2. Create the Bot and send its kickoff message

Following xAI's advice to start with **one Bot that owns an end-to-end outcome** ([platform facts](../../docs/hosts/grok-bot/platform-facts.md)):

1. In Grok Bot, create a new Bot named `Engineering`.
2. Open [examples/grok-bot/kickoff/engineering.md](kickoff/engineering.md).
3. Replace the placeholder items (`<project>`, `<repo>`, `<user>`) with your project facts, keeping all approval boundaries intact.
4. Paste the kickoff prompt into the direct chat with the new Bot.
5. Wait for the Bot to confirm the rules back before sending any task.

If coordinating multiple Bots, use a group chat with a designated coordinator Bot as described in [kickoff/README.md](kickoff/README.md).

## 3. Set up the board in `/workspace`

All Bots on an account share the persistent microVM computer and its `/workspace` directory ([platform facts](../../docs/hosts/grok-bot/platform-facts.md)). Shared state lives in files on disk, not in chat memory.

Create `/workspace/board.md` following the format from [examples/board.example.md](../board.example.md):

```markdown
# Board

Updated: 2026-10-26
Coordinator: human

## Card card-2026-10-26-01

| Field | Value |
|---|---|
| id | card-2026-10-26-01 |
| goal | Add rate limiting to the webhook receiver in <repo> |
| from | human |
| to | Engineering |
| kind | assign |
| refs | docs/architecture.md, src/webhook.js |
| write_policy | draft (branch feat/webhook-limit). hitl:merge to default |
| done_when | Unit tests pass on branch, PR opened, no merge |
| status | open |
| output_refs | none |
```

Keep tokens, secrets, and raw chat logs off the board, as all Bots can read `/workspace`.

If this repository is cloned in `/workspace`, you can also create, list, and validate cards from the terminal using [`scripts/board.mjs`](../../scripts/board.mjs):

```bash
node scripts/board.mjs check --file /workspace/board.md
node scripts/board.mjs list --file /workspace/board.md
```

## 4. Run the scoped task

In the direct chat with the `Engineering` Bot, assign the card:

```text
Please execute card-2026-10-26-01 from /workspace/board.md using the engineering skill.
Work strictly on branch feat/webhook-limit. Do not merge or push to main.
```

The Bot executes the 5 steps defined in [skills/engineering/SKILL.md](../../skills/engineering/SKILL.md):
1. Reads repository instructions and existing code.
2. Implements the rate limiting change on the branch.
3. Runs the test suite and verifies acceptance criteria.
4. Updates `/workspace/board.md` setting status to `done` and adding `output_refs: pr://example/1`.
5. Prepares a residual risk summary.

## 5. Schedule a routine

Automate recurring checks only after the one-time task has succeeded by hand ([docs/hosts/grok-bot/routines.md](../../docs/hosts/grok-bot/routines.md)):

1. Open routine creation for the `Engineering` Bot.
2. Fill the 6 Grok Bot creation fields:
   - **Owning Bot:** `Engineering`
   - **Trigger:** Schedule (e.g. daily at 09:00 UTC)
   - **Input source:** `/workspace/board.md` and CI check outputs
   - **Expected result:** Report pending PRs with check status; halt if budget exceeds 5 minutes
   - **Approval boundary:** Draft notes only; do not merge or deploy
   - **Missing source behavior:** Log a warning note to `/workspace/board.md` and stop
3. Avoid pressing **Test** unless inputs are safe to act on, because a Test run performs real side effects ([platform facts](../../docs/hosts/grok-bot/platform-facts.md)).

## 6. Hit the approval stop

When the Bot reaches a privileged action (such as merging the PR into the default branch):

1. **Auto Review rule:** The configured personal **Ask first** rule (`Ask first: any push to the default branch or merge of a pull request`, from [approval-policy.md](../../docs/hosts/grok-bot/approval-policy.md)) stops the action.
2. **Approval prompt:** Grok Bot presents an approval card with the proposed operation, diff, and choices: **Allow once**, **Always allow**, and **Deny** ([platform facts](../../docs/hosts/grok-bot/platform-facts.md)).
3. **Location:** The prompt surfaces in the owning Bot's **one-to-one chat**, never in a group chat ([platform facts](../../docs/hosts/grok-bot/platform-facts.md)).
4. **Decision:**
   - Choose **Deny** (or allow the request to time out): the action fails closed, execution halts, and no changes are merged.
   - Never select **Always allow** for merge, deploy, secrets, or messaging-as-user gates ([approval-policy.md](../../docs/hosts/grok-bot/approval-policy.md)).

## 7. Close the task on the board

The human reviews the card outcome, residual risk, and decision status. Update `/workspace/board.md`:

```markdown
| status | closed |
| decision | rejected by operator |
| output_refs | pr://example/1 (closed/retained) |
```

This completes the loop: scoped task → shared board → skill execution → routine automation → fail-closed HITL gate.

---

Related documents:
- [Grok Bot host mapping](../../docs/hosts/grok-bot/mapping.md)
- [Grok Bot platform facts](../../docs/hosts/grok-bot/platform-facts.md)
- [Grok Bot approval policy](../../docs/hosts/grok-bot/approval-policy.md)
- [Grok Bot routines](../../docs/hosts/grok-bot/routines.md)
- [Grok Bot install guide](../../docs/hosts/grok-bot/install.md)
- [Kickoff messages](kickoff/README.md)
- [Generic walkthrough](../walkthrough.md)

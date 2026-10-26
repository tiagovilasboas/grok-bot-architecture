# Grok Bot routines

This page maps the repository routine contract ([docs/routines.md](../../routines.md)) onto Grok Bot's routine creation fields and limits. It describes Grok Bot **as documented on 2026-10-26**. Each product fact comes from the [platform facts](platform-facts.md), which link to the official page. Product behavior changes, so re-check the official page before you create a routine. Nothing on this page has been run on a real account; see [Not verified](#not-verified).

## Contract to creation fields

The repository contract has seven fields. Grok Bot asks for six things when a routine is created. The table shows where each repository field lands, and which Grok Bot fields have no repository field.

| Repository field | Grok Bot creation field | Notes |
|---|---|---|
| `name` | None documented | Put the stable name in the routine's text so you can match its run records to it. |
| `trigger` | Trigger type: a schedule, or a supported event | Use a schedule when one fits. Grok Bot documents schedules and supported events; it does not document webhooks, so a webhook trigger has no documented equivalent. |
| (none) | Schedule and time zone | Set both when you create the routine. Scheduled runs happen at the time zone you choose. |
| `owner` | Owning Bot | One Bot per routine. A group-chat coordinator is not documented as an owner, so name the owning Bot. |
| (none) | Input source | Name the source the routine reads. Memory is not authoritative, so have the routine reopen the source system for consequential facts ([Bots](https://docs.x.ai/grok-bot/bots)). |
| `budget` | None documented | No documented Grok Bot equivalent. Set the budget in the routine's instructions: maximum items read, maximum steps, and maximum time. |
| `stop` | Expected result (the done condition) | No stop control is documented. Write the done condition and the budget stop in the instructions, and report when either one is reached. |
| `write_policy` | Approval boundary | Grok Bot's approval prompts gate proposed actions, not work already done ([Security](https://docs.x.ai/grok-bot/security)). The routine text must still say what is a draft, what is a write, and what needs approval. |
| `refs` | Input source and the outputs the routine writes | Point the routine at its inputs and at the files it writes, such as the board in `/workspace`. Grok Bot keeps only the 20 most recent run records per routine (see Limits). |
| (none) | Behavior when a source is missing | Write the no-data and stale-data rules into the routine. See the examples below. |

## Limits

The product limits below are from the same official page ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations)).

- **50 routines per Bot.** Plan one owning Bot per outcome, and retire routines you no longer need. Source: [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).
- **20 most recent run records per routine.** Older run records are not kept, so the outputs the routine writes to `/workspace` are the durable record. Source: [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).
- **Schedules at least five minutes apart.** Source: [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

Other documented behavior, not a limit: a **Test** run performs real work, and routines can be paused after a long absence ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations)).

## Before you create a routine

Work through this list in order. Grok Bot's guidance is to make the task reliable by hand, save it as a skill, and only then automate it ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations)).

1. **Run the task once by hand**, as a one-time task. Confirm the inputs, the output, and the stop point.
2. **Make it reliable.** Repeat the one-time run until the result is consistent and the no-data and stale-data cases behave as written.
3. **Save it as a skill.** Ask a Bot to keep the completed process, or record it with **Teach a task**. Check that the skill states when to use it, required inputs and access, the sequence, how to validate the result, what to return, and what requires approval.
4. **Automate the preparation before the action.** The routine gathers and drafts; a person approves any action that changes something outside the Bot's own files.
5. **Check the approval boundary.** The approval-policy page is not on `main` at this writing, so check the gates in [crew/hitl.md](../../crew/hitl.md). Merge, deploy, secrets, and messaging-as-user wait for a person. If nobody answers, the routine waits.
6. **Write the no-data and stale-data rules** into the routine text.
7. **Make retries idempotent.** A rerun must not send twice, create duplicate drafts, or write a second copy of the same output.
8. **Fill the creation fields:** owning Bot, schedule and time zone, input source, expected result, approval boundary, and behavior when a source is missing.
9. **Test only with inputs that are safe to act on** (see the warning below).

## Test first, with a warning

> **Warning: a Test run performs real work.** It reads, writes, drafts, and calls apps as the signed-in member, the same as a scheduled run. Test only with inputs that are safe to act on. If no input is safe to act on, do not press Test. Review the routine text against the checklist instead.

Source for the Test behavior: [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## Examples

Both examples are fictional. Replace the placeholders with your own values. Paste each text block into a Bot's chat to create the routine; check every field against the creation form, because its labels may differ from these.

### a. Weekly inbox digest, draft only

```text
Routine: inbox-weekly-digest
Owner: Inbox Bot
Trigger: schedule. Weekly, on <weekday> at <time>, time zone <time-zone>.
Input source: the mailbox view "<mailbox-view>", which the member has already connected.
  Read only items dated within the last 7 days.
Expected result:
  1. A digest grouped by sender and topic, with counts, saved to
     /workspace/inbox/<yyyy-mm-dd>-digest.md.
  2. One draft reply for each item that needs an answer. Drafts only.
Approval boundary: nothing is sent. Creating drafts is allowed. Any send needs an
  approval request in this Bot's direct chat. Wait for an explicit approve.
No-data rule: if the view has no items in the window, write "no items in window"
  in the digest and stop. Do not invent items or summarize older mail.
Stale-data rule: if the newest item is older than the window, write
  "newest item dated <date>" in the digest and stop. Create no drafts.
Budget: read at most <n> items. Stop when the digest is written and the drafts are listed.
Retries: a rerun for the same day overwrites the same digest file. Before creating a
  draft, check for an existing draft with the same subject and date, and skip it if found.
```

### b. PR status digest

```text
Routine: pr-status-daily
Owner: Engineering Bot
Trigger: schedule. Daily, at <time>, time zone <time-zone>.
Input source: the open pull requests of the repository <repository>, which the member
  can read. Read the current state on each run; do not reuse results from earlier runs.
Expected result: a status table with one row per pull request and the columns PR, title,
  author, age in days, CI status, review state, and last updated. Save it to
  /workspace/status/<repository>/<yyyy-mm-dd>.md.
Approval boundary: read only. No merge, no comment, no label change, no review. Any write
  needs a separate approval request in this Bot's direct chat.
Stale-data rule: if a pull request's data cannot be read, list it with the value
  "unknown" in every column that could not be read. Do not carry values forward from an
  earlier run.
Missing-source rule: if <repository> cannot be read, stop and report the failure with the
  error message. Do not write a partial table.
Retries: a rerun on the same day overwrites the same file.
```

## Not verified

Nothing below has been checked on a real Grok Bot account:

- Routine behavior in practice: the 20-run history, pausing after a long absence, and whether scheduled runs honor the approval boundary written in the routine text.
- Whether a routine can reference a saved skill, and whether it can run a skill's steps without restating them.
- Whether the example text blocks create a routine as written, and whether the creation form's field labels match the ones used here.
- How a routine behaves when two routines write to the same `/workspace` path.

The mapping is a reference for an operator to verify, not evidence that these routines work. The roadmap's real-account walkthrough is where that evidence belongs ([mapping](mapping.md#not-verified)).

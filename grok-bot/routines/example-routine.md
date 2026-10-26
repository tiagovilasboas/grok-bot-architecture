# Example routine: weekly repository digest

Fictional and generic. Copy the specification into the owning Bot's chat and replace the placeholders. Every field is required: a routine that cannot name its stop is a daemon, not a routine ([routine contract](../../docs/routines.md)).

## Specification

```text
Routine: weekly-repo-digest
Owner: the Engineering Bot (one owner; the Chief-of-staff only routes)
Trigger: weekly, Monday 09:00, time zone <time-zone>
Input: open pull requests and failed checks of <repo>, read only
Output: one digest card on /workspace/<project>/board.md
write_policy: read | draft | hitl. This routine is read and draft only.

Budget (enforced by these instructions, not by the product):
- 1 Bot, at most 3 messages, at most 15 minutes of work per run
- no retries

Stop:
- done: the digest card is written.
- budget exceeded, or <repo> cannot be read: write one "blocked" card with the reason, then stop. Do not retry. Do not reuse data from an earlier run.

No-data rule: if there are no open pull requests, write "none open" and stop.

External actions: none. Anything that would change the outside world is listed on the card as "needs your yes" and waits for the human's yes in this Bot's direct chat. That includes commenting on or merging a pull request, asking for co-authorship, pushing, deleting a branch, fork, or repository, and sending any message. Silence means wait.
```

## Notes

- **Approval:** the last paragraph applies the fail-closed gates of [ADR 0003](../../docs/adr/0003-hitl-on-side-effects.md). A routine gets no pass on them.
- **Budget:** Grok Bot documents no budget setting for a routine, so the budget lives in the instructions above. See [routines on Grok Bot](../../docs/hosts/grok-bot/routines.md).
- **Test:** a Test run performs real work. Run it only with an input that is safe to act on.
- **Before you enable it:** check that the owner, the budget, the stop, the write_policy, and the external-action rule are all present. If one is missing, do not enable the routine.

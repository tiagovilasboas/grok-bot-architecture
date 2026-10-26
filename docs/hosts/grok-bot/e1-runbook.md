# Optional runbook: live check on a Grok Bot account

This runbook is optional. It suggests one order for checking the paths in [verification-report.md](verification-report.md) on a real account, for anyone who wants to. Sign-in, two-factor steps, and payment belong to the member, as the [platform facts](platform-facts.md) state. Record only what you observed.

Nothing here is required to use the repository. Pick the checks you care about and skip the rest.

## Before you start

1. Record the plan type you are on (individual, Teams, or Enterprise). Some checks need Enterprise, and the report needs the plan.
2. Use a test account or a throwaway workspace if you can. Do not paste credentials, tokens, or private messages into the repository, and do not commit screenshots that show personal data.
3. Write observations as you go, in a scratch note. Copy only the one-line result into the report.

## Checks, in order

Run them in this order, because later checks depend on earlier ones.

| # | Check | Question to answer | Record in report row |
|---|---|---|---|
| 1 | Paste-and-save | Copy one `skills/<role>/SKILL.md` into a Bot chat and ask it to save the skill. Does the skill appear when you type `/` in the composer, and under Private skills? | Paste-and-save |
| 2 | Local plugin | Follow [install.md](install.md#b-local-plugin). Is the local plugin discovered by Cursor, and is it visible to a Bot? The local path is not documented, so write down where you looked. | Cursor plugin (Local folder) |
| 3 | Team marketplace | Follow [install.md](install.md#a-team-marketplace). Does the Cursor dashboard offer the import step, and does a Bot see the plugin? Requires a team organization. | Cursor plugin (Team Marketplace) |
| 4 | Kickoff retention | Create a Bot with the Engineering kickoff. Does the Bot confirm the rules back before the first task? Does it keep the boundary in the first real turn? | Role kickoff prompts |
| 5 | Shared board | Create `/workspace/board.md` with one card. From a second Bot on the same account, can it read the card? | Shared board in `/workspace` |
| 6 | Approval stop | Ask a Bot for an action that the approval policy marks Ask first. Does the approval prompt appear in that Bot's direct chat, with Allow once, Always allow, and Deny? | Ask first Auto Review rules |
| 7 | Routine test | Create one routine from [routines.md](routines.md) with a safe input. Use **Test** and read the result. Note that Test performs real work. | (add a row if it is not in the report) |
| 8 | Walkthrough | Follow [walkthrough.md](../../../examples/grok-bot/walkthrough.md) from start to end, with fictional values. Note each step that fails or differs from the text. | End-to-end walkthrough |

## Recording a result

Use the [results template](results-template.md) for each run. It has one line per check, and it leaves a check as "Not run" when you did not run it.

Each row in the report takes one status and one line. Use these statuses:

- **Worked:** the check matched the text in this repository, and you saw it yourself.
- **Partly:** some of the check worked. Say which part in the observation.
- **Failed:** the check did not work as documented.
- **Not available:** the feature is missing on your plan, or the screen did not offer it.

Example row, with no identifiers:

`| Paste-and-save | ... | 2026-10-27 | Worked | Skill appeared under "/" after save; Private skills listed it. |`

Do not write "Verified" unless you saw the result on your account. "Documented, not observed" in the report means the documentation says so, and it does not count as a live check.

## When a check fails

1. Record the failure in the report row. Do not edit the docs to match the failure yet.
2. Open an issue with the label `needs-maintainer` and link it from the row.
3. Only after the failure is written down, change the docs. Keep the original claim visible in the history, so the difference can be seen.

## Sharing results

If you record results, add them to the report row, with the plan type and the date. A failed or unavailable check is useful too: say so, so the next reader knows what not to expect.

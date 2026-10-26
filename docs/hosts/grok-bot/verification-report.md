# Grok Bot verification report

Reviewed: 2026-10-26 (task E1, the optional live check; its tracking issue was deleted).

This report records what is documented for each path and, where a maintainer or contributor has run it, what was observed on a Grok Bot account. Live checks are a recommendation, not a release gate: each reader chooses which paths to check and records the result. Paths that have not been observed are shown as documented, not as working.

## Verification status by path

| Path | Doc reference | Plan tested | Date | Status | Notes |
|---|---|---|---|---|---|
| Role crew: coordinator Bot, specialist Bots, group chats | [mapping.md](mapping.md#mapping) | Premium (reported by maintainer) | 2026-10-26 | Worked | Observed on the maintainer's account: a pinned coordinator Bot, specialist Bots for engineering, security, inbox and career, and two group chats (core team and domain). The maintainer's own Bot names differ from the generic names in this repository. Skills, kickoffs and plugin from this repository were not part of that observation. |
| Cursor plugin (Team Marketplace) | [install.md](install.md#a-team-marketplace) | — | 2026-10-26 | Documented, not observed | Requires Cursor dashboard organization with marketplace plugin import enabled. |
| Cursor plugin (Local folder) | [install.md](install.md#b-local-plugin) | — | 2026-10-26 | Documented, not observed | Local plugin discovery directory in Cursor desktop needs observation. |
| Paste-and-save private skill | [install.md](install.md#c-paste-and-save) | — | 2026-10-26 | Documented, not observed | Direct paste into Bot conversation with `/` composer completion check. |
| Role kickoff prompts | [kickoff/README.md](../../../examples/grok-bot/kickoff/README.md) | — | 2026-10-26 | Documented, not observed | Check that Bot retains bounds in first conversation turn. |
| Shared board in `/workspace` | [mapping.md](mapping.md#mapping) | — | 2026-10-26 | Documented, not observed | MicroVM file sharing across account Bots is documented xAI platform architecture. |
| Ask first Auto Review rules | [approval-policy.md](approval-policy.md) | — | 2026-10-26 | Documented, not observed | Custom rules in Auto Review settings documented on official Security page. |
| End-to-end walkthrough | [walkthrough.md](../../../examples/grok-bot/walkthrough.md) | — | 2026-10-26 | Documented reference | Walkthrough verified against contract shapes and local mock lifecycle. |

## Optional checklist

- [x] Each install path is documented with clear steps and marked as documented, not observed.
- [x] Documented claims are distinguished from local contract checks that the repository runs.
- [x] Zero account identifiers, private credentials, or live transcripts committed to the repository.
- [ ] Optional: run a path on a Grok Bot account and record the date, plan type, and observation.

# Reusable role skills

Each role has a ready-to-load `SKILL.md` with a trigger, required context, procedure, authority boundary, output contract, and pre-handoff quality review. Skills are public, generic recipes licensed under MIT; they do not grant tool permissions or authenticate approvals.

| Role | Skill | Primary deliverable |
|---|---|---|
| Chief-of-staff | [chief-of-staff](../skills/chief-of-staff/SKILL.md) | Assignment card or acceptance review: owner, scope, hard constraints, done_when, evidence, status, blocker/next action. |
| Engineering | [engineering](../skills/engineering/SKILL.md) | Reviewable branch or PR reference; behavior before/after; check results; residual risks; remaining approvals. |
| Publishing | [publishing](../skills/publishing/SKILL.md) | Draft/preview reference; audience and goal; source-backed claims; validation summary; publication status. |
| Security | [security](../skills/security/SKILL.md) | Findings with path:line or equivalent source reference; severity rationale; evidence; remediation; reviewed scope and limitations. |
| Inbox | [inbox](../skills/inbox/SKILL.md) | Prioritized digest; item references; proposed dispositions; drafts; scheduling conflicts; approval status. |
| Career | [career](../skills/career/SKILL.md) | Opportunity table with source/date, hard-constraint fit, gaps, recommendation, and application draft/status. |
| Finance | [finance](../skills/finance/SKILL.md) | Requirements/acceptance criteria or reconciled draft; source totals; discrepancy list; assumptions; review status. |
| Product | [product](../skills/product/SKILL.md) | Problem statement; prioritized increment; acceptance criteria; implementation handoff or preview; validation and next decision. |
| Hobby | [hobby](../skills/hobby/SKILL.md) | Comparison with source/date, total-price assumptions, condition/authenticity evidence, tradeoffs, and recommendation. |

## Load a skill

Choose one role for the scoped task. Point your host's skill loader at its directory, or copy that directory into the host's documented skill location. If the host has no skill-loader convention, supply the file as task instructions. No vendor-specific installation path is required.

Read the consuming project's instructions and operator policy first. Give the role only the tools and references authorized for its card. Add host-specific tool mappings separately, and retain the public role boundaries.

## Quality bar

These skills aim for reviewer-quality outputs: source-backed facts, explicit acceptance criteria, proportionate verification, visible uncertainty, and bounded actions. Their behavior has not been benchmarked across models or hosts; a numeric quality promise would require evaluation. Skills cannot make an unsafe tool configuration safe by themselves.

[Roles](crew/roles.md) · [host integration](host-integration.md) · [walkthrough](../examples/walkthrough.md)

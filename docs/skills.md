# Reusable role skills

Each role has a ready-to-load `SKILL.md`. Skills marked as v2 follow the [template below](#template-v2); the others keep the earlier layout (trigger, required context, procedure, safety and authority, output contract, quality review) until they are converted. Skills are public, generic recipes licensed under MIT; they do not grant tool permissions or authenticate approvals.

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

## Template v2

A v2 skill marks itself with the HTML comment `<!-- template: v2 -->` on its own line, directly under the H1 title. The frontmatter stays `name` and `description` only; the marker is the only v2 signal.

A v2 skill has these level-2 headings, each exactly once and in this order, and then one worked example:

1. `## When to use`: the trigger and the cases where the skill does not apply.
2. `## Inputs and access`: required inputs, data sources, and the access level.
3. `## Steps`: the numbered procedure.
4. `## Validation`: how to check the result before handoff.
5. `## Output`: what to return, by reference where possible.
6. `## Approval`: the concrete actions that need the operator's approval.
7. `## Worked example`: one fictional example, with placeholders such as `<project>` and `<repo>`.

Rules:

- **Self-contained.** No relative links: a link target must be an external URL, a `mailto:` link, or a same-file `#anchor`. Name other roles in plain text.
- **No host section.** Host mapping lives in [host integration](host-integration.md). A skill never authenticates a human or enforces permissions, so the skill body does not claim either.
- **Boilerplate budget.** Body lines are non-blank lines that are not headings, frontmatter, or the marker. A body line is shared when the same text appears in at least two v2 skills. Shared lines must be at most 30 percent of all v2 body lines. Write role-specific wording instead of reusing paragraphs.
- **Fictional examples.** The worked example uses no real names, accounts, emails, or companies.

`node scripts/validate-plugin.mjs` checks the headings, their order, the single worked example, the links, and the budget for v2 skills, and prints the ratio. Skills without the marker keep only the manifest and frontmatter checks.

## Load a skill

Choose one role for the scoped task. Point your host's skill loader at its directory, or copy that directory into the host's documented skill location. If the host has no skill-loader convention, supply the file as task instructions. No vendor-specific installation path is required.

Read the consuming project's instructions and operator policy first. Give the role only the tools and references authorized for its card. Add host-specific tool mappings separately, and retain the public role boundaries.

## Quality bar

These skills aim for reviewer-quality outputs: source-backed facts, explicit acceptance criteria, proportionate verification, visible uncertainty, and bounded actions. Their behavior has not been benchmarked across models or hosts; a numeric quality promise would require evaluation. Skills cannot make an unsafe tool configuration safe by themselves.

[Roles](crew/roles.md) · [host integration](host-integration.md) · [walkthrough](../examples/walkthrough.md)

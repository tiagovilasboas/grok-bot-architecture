# Skills

## Decision

Host-level **skills** are reusable recipes (typically a `SKILL.md` library on the host) that any specialist can load for a job. They are **vendor-agnostic**: the pattern does not require a particular IDE, vault layout, or product path. Grok Bot / Cursor is the example host mapping only.

## What a skill is

| Skill | Agent |
|---|---|
| A named recipe with steps, checks, and refs | A role with job · objective · write-boundary |
| Loaded into a specialist’s window when the card needs it | Owns a write-boundary and may hold connectors |
| Does **not** bypass HITL | Still pauses on merge · deploy · secrets · messaging-as-user |

Skills are **not** agents. They do not spawn peers, invent `decision` / `decided_by`, or widen a role’s connector allowlist by themselves.

## Example house skills (public names only)

Cite by **name**. Do not paste skill bodies or private host paths into this repository.

| Skill name | Typical use (pattern) |
|---|---|
| `github-commit-as-owner` | Commit / PR hygiene as the repo owner on an allowlisted host mapping |
| `showcase-readme-standard` | README density and Staff showcase bar for public repos |
| `post-dev-to-like-montanha` | Draft / structure a public DEV.to-style post (publish still HITL) |
| `write-for-dev-community` | Optional DEV.to editorial recipe (tone, structure, links) |
| `repo-ai-assisted-house-style` | In-repo AI-assisted house style for docs and comments |
| `mesa-bots-runbook` | How Mesa specialists load skills and hand off without swarming |
| `ui-ux-master` | UI/UX review checklist for public surfaces (Vitrine / Apps) |

Rename or omit on your host. Keep the rule: **recipe ≠ agent ≠ HITL bypass**.

## How specialists use skills

1. CoS cards the job with `write_policy` and `done_when`.
2. The specialist loads zero or more skills by name for that card.
3. Work stays inside the role’s write-boundary and connector allowlist.
4. Privileged writes still open an interrupt ([crew/hitl.md](crew/hitl.md)).

## Limit

This page names a **pattern**: a host skills library. It is not a dump of private prompts, not a path map to any personal machine, and not a product SKU. If a skill only works as a secret system prompt or a private vault path, it does not belong in this repo. Crew contracts: [crew/roles.md](crew/roles.md). Architecture: [architecture.md](architecture.md).

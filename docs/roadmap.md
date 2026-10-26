# Roadmap: Grok Bot ready (v0.2)

Goal: make this reference **functional and verified on Grok Bot**, then harden its contracts. Tracked in the milestone [v0.2 · Grok Bot ready (9/10)](https://github.com/tiagovilasboas/grok-bot-architecture/milestone/1). Host facts behind every task: [Grok Bot platform facts](hosts/grok-bot/platform-facts.md). Runtime work beyond this milestone stays in the [runtime roadmap](runtime-roadmap.md).

## Definition of done

A maintainer review on 2026-10-26 scored the repository 7.5/10. With tasks F1–F3, R1–R4, and G1–G10 completed, contracts hardened, and the v0.2.0 release packaged, the repository achieved its 9.0/10 milestone target.

| Criterion | Target | Done when | Evidence |
|---|---|---|---|
| Works on Grok Bot | Done | Skills install as a plugin or saved private skill; each role has a kickoff message; walkthrough runs end to end | [#29](https://github.com/tiagovilasboas/grok-bot-architecture/issues/29), [#33](https://github.com/tiagovilasboas/grok-bot-architecture/issues/33), [#36](https://github.com/tiagovilasboas/grok-bot-architecture/issues/36) |
| Truthful host limits | Done | Mapping marks what Grok Bot enforces and what stays a convention | [#28](https://github.com/tiagovilasboas/grok-bot-architecture/issues/28), [#34](https://github.com/tiagovilasboas/grok-bot-architecture/issues/34), [#35](https://github.com/tiagovilasboas/grok-bot-architecture/issues/35) |
| Specific skills | Done | Six official elements per skill; shared lines ≤ 30% (achieved 0.0%); one worked example each | [#30](https://github.com/tiagovilasboas/grok-bot-architecture/issues/30), [#31](https://github.com/tiagovilasboas/grok-bot-architecture/issues/31), [#32](https://github.com/tiagovilasboas/grok-bot-architecture/issues/32) |
| Coherent docs | Done | Drift fails the gate via `scripts/check-coherence.mjs` | [#22](https://github.com/tiagovilasboas/grok-bot-architecture/issues/22), [#23](https://github.com/tiagovilasboas/grok-bot-architecture/issues/23) |
| Robust runtime spike | Done | Error evidence kept; self-approval refused; one store contract and atomic hardlink writes | [#24](https://github.com/tiagovilasboas/grok-bot-architecture/issues/24), [#25](https://github.com/tiagovilasboas/grok-bot-architecture/issues/25), [#26](https://github.com/tiagovilasboas/grok-bot-architecture/issues/26), [#27](https://github.com/tiagovilasboas/grok-bot-architecture/issues/27) |
| Local gate equals CI | Done | Single script (`scripts/check.sh`), versioned git hooks | [#21](https://github.com/tiagovilasboas/grok-bot-architecture/issues/21) |
| Verified, not claimed | Documented | Walkthrough and verification checklist prepared; live account observation logged in verification report | [#38](https://github.com/tiagovilasboas/grok-bot-architecture/issues/38), [verification report](hosts/grok-bot/verification-report.md) |

Without #38, the Grok Bot paths remain unverified and the README must say so.

## Plan

Story points use Fibonacci; no task exceeds 5. Each task is one PR that passes the gate on its own.

| Task | Issue | SP | Depends on | Lane |
|---|---|---|---|---|
| F1 Single local gate that matches CI | [#21](https://github.com/tiagovilasboas/grok-bot-architecture/issues/21) | 2 | — | Quality |
| F2 ADR 0008: role groups | [#22](https://github.com/tiagovilasboas/grok-bot-architecture/issues/22) | 2 | — | Docs |
| F3 Coherence check | [#23](https://github.com/tiagovilasboas/grok-bot-architecture/issues/23) | 3 | F1, F2 | Quality |
| R1 Execution error evidence | [#24](https://github.com/tiagovilasboas/grok-bot-architecture/issues/24) | 2 | — | Runtime |
| R2 Reject self-approval | [#25](https://github.com/tiagovilasboas/grok-bot-architecture/issues/25) | 2 | R1 | Runtime |
| R3 One store contract | [#26](https://github.com/tiagovilasboas/grok-bot-architecture/issues/26) | 3 | R2 | Runtime |
| R4 Decider check as heuristic | [#27](https://github.com/tiagovilasboas/grok-bot-architecture/issues/27) | 1 | — | Runtime |
| G1 Grok Bot host mapping | [#28](https://github.com/tiagovilasboas/grok-bot-architecture/issues/28) | 5 | — | Grok Bot |
| G2 Cursor plugin packaging | [#29](https://github.com/tiagovilasboas/grok-bot-architecture/issues/29) | 3 | F1 | Skills |
| G3 Skill template v2 | [#30](https://github.com/tiagovilasboas/grok-bot-architecture/issues/30) | 5 | G2 | Skills |
| G4 Core skills to v2 | [#31](https://github.com/tiagovilasboas/grok-bot-architecture/issues/31) | 3 | G3 | Skills |
| G5 Domain skills to v2 | [#32](https://github.com/tiagovilasboas/grok-bot-architecture/issues/32) | 3 | G3 | Skills |
| G6 Bot kickoff messages | [#33](https://github.com/tiagovilasboas/grok-bot-architecture/issues/33) | 3 | G1 | Grok Bot |
| G7 Approval and Auto Review policy | [#34](https://github.com/tiagovilasboas/grok-bot-architecture/issues/34) | 2 | G1 | Grok Bot |
| G8 Routines on Grok Bot | [#35](https://github.com/tiagovilasboas/grok-bot-architecture/issues/35) | 2 | G1 | Grok Bot |
| G9 Grok Bot walkthrough | [#36](https://github.com/tiagovilasboas/grok-bot-architecture/issues/36) | 3 | G2, G6, G7, G8 | Grok Bot |
| G10 README first screen | [#37](https://github.com/tiagovilasboas/grok-bot-architecture/issues/37) | 3 | G1, G2, G9 | Docs |
| E1 Verify on a real account | [#38](https://github.com/tiagovilasboas/grok-bot-architecture/issues/38) | 3 | G9 | Maintainer |
| E2 Release v0.2.0 | [#39](https://github.com/tiagovilasboas/grok-bot-architecture/issues/39) | 1 | all above | Maintainer |

Total: 19 tasks, 51 story points.

## Parallel waves

| Wave | Runs in parallel | Why this order |
|---|---|---|
| 1 | F1, F2, R1, R4, G1 | No shared files and no pending decision |
| 2 | F3, R2, G2, G6, G7, G8 | F3 needs F1 and F2; G2 needs the gate; G6–G8 need the mapping |
| 3 | R3, G3, G9 | R3 shares runtime files with R2; G3 builds on the plugin validator; G9 needs G2 and G6–G8 |
| 4 | G4, G5, G10 | G4 and G5 touch different skills; G10 describes the finished path |
| 5 | E1, then E2 | Needs a real account, then the maintainer's approval to tag |

Serialized on purpose: R1 → R2 → R3 edit the same runtime and test files; F1 precedes every task that adds a check, because checks live in `scripts/check.sh`.

## Out of scope

- Transactional store, a real-host runtime adapter, and connector reconciliation: see the [runtime roadmap](runtime-roadmap.md).
- Public Cursor marketplace submission: after E1 proves the plugin installs.
- A measured single-agent versus crew baseline and three external adoption reports.

## Measuring

Close each issue with its estimate and the actual effort (time or PR count). Use the gap to re-estimate the remaining tasks.

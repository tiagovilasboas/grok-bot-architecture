# Changelog

## v0.2.0 - 2026-10-26

Milestone: Grok Bot ready.

### Added
- **Grok Bot host mapping & platform facts:** [mapping.md](docs/hosts/grok-bot/mapping.md), [platform-facts.md](docs/hosts/grok-bot/platform-facts.md), [approval-policy.md](docs/hosts/grok-bot/approval-policy.md), [install.md](docs/hosts/grok-bot/install.md), and [routines.md](docs/hosts/grok-bot/routines.md) mapping all concepts to documented xAI levers with explicit distinction between enforced rules and conventions.
- **Nine role kickoffs:** copy-paste first conversation messages for all nine roles in [examples/grok-bot/kickoff/](examples/grok-bot/kickoff/).
- **Grok Bot walkthrough:** step-by-step path from skill installation to the approval stop in [examples/grok-bot/walkthrough.md](examples/grok-bot/walkthrough.md).
- **Cursor plugin packaging:** `.cursor-plugin/plugin.json` manifest packaging the nine role skills.
- **Skill template v2:** all nine role skills converted to the six-element template with worked examples and zero shared boilerplate lines across roles.
- **Coherence & packaging validators:** `scripts/check-coherence.mjs` and `scripts/validate-plugin.mjs` running in the single repository gate `scripts/check.sh`.
- **Approval runtime hardening:** anti-self-approval check, sanitized execution error evidence (`errorEvidence`), terminal `not_sent` handling, atomic file creation via `wx` + `link()`, and separation into `stores.mjs`.
- **ADR 0008:** role groups formalized as Core team and optional Domain specialists.

### Unverified notice
- Live Grok Bot account executions are documented as pending maintainer observation in [verification-report.md](docs/hosts/grok-bot/verification-report.md).

## v0.1.0 - 2026-10-25

- Add a runnable local approval lifecycle reference with trusted-host identity and authorization callbacks, exact action binding, fail-closed recovery, and explicit single-process limitations.
- Add ADR 0007, a runtime roadmap, lifecycle tests, and CI coverage for the host-conformance example.
- Improve the README's description, natural search terms, quick start, navigation, and MIT reuse terms.
- Refine nine role contracts with English names and add a reusable SKILL.md for each role.
- Generalize personal project mappings, routines, host assumptions, and skill names.
- Add a fictional lifecycle walkthrough, operator policy example, and host integration responsibilities.
- Add support, conduct, and security reporting guidance.
- Align the non-human role denylist with the public roles.
- Remove the `edit` interrupt decision (edits require a new request), re-check approval expiry after host authorization, and fix leftover role labels in the architecture docs.

This changelog begins with this contribution and does not invent earlier releases.

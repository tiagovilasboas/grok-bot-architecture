# Case study: repository self-audit and milestone closure

Unlike the fictional product scenario in [walkthrough.md](walkthrough.md), this walkthrough records a verifiable sequence of tasks executed against this public repository during the `v0.2.0` → `v0.3.0` transition (commits `26d7f36` through `556e15a`). Every file path, command, and commit reference below exists in this repository's git history.

---

## 1. Scope and initial audit

An operator asked **Chief-of-staff** to audit the repository after the Wave 3 documentation and runtime merges, identify any contract or modularity drift, and close the remaining milestone items through small, verifiable pull requests.

Inspection of the repository surfaced four concrete workstreams:

1. **Documentation coherence drift:** `README.md` still stated "Six accepted decisions", `docs/skills.md` claimed role skills had not yet been migrated to template v2, and `AGENTS.md` / `llms.txt` omitted the new `scripts/validate-plugin.mjs` and `scripts/check-coherence.mjs` gates.
2. **Module size boundary:** `examples/approval-runtime/runtime.mjs` (383 lines), `scripts/validate-handoff.mjs` (308 lines), and `scripts/validate-interrupt.mjs` (351 lines) mixed core logic with storage adapters or inline self-test fixtures.
3. **Missing Grok Bot onboarding artifacts:** issues `#36`, `#37`, `#38`, and `#39` required a Grok Bot walkthrough, a first-screen quick path in `README.md`, and an explicit verification report separating local checks from unverified live-account behavior.
4. **Manual board editing:** users had to hand-edit Markdown tables to follow [docs/crew/handoffs.md](../docs/crew/handoffs.md) without a CLI helper or automated board checker.

---

## 2. Managing the board via `scripts/board.mjs`

With the zero-dependency board CLI ([scripts/board.mjs](../scripts/board.mjs)), the coordinator creates and validates board cards directly from the terminal instead of hand-editing Markdown tables:

```bash
# Inspect existing cards on the example board
node scripts/board.mjs list --file examples/board.example.md

# Validate all board cards against ADR-0001 and handoff invariants
node scripts/board.mjs check --file examples/board.example.md
```

To add a new scoped engineering card on a working board (`/tmp/audit-board.md`):

```bash
node scripts/board.mjs add --file /tmp/audit-board.md \
  --id card-2026-10-26-01 \
  --goal "Extract inline self-tests from handoff and interrupt validators" \
  --from chief-of-staff \
  --to engineering \
  --kind assign \
  --refs "scripts/validate-handoff.mjs,scripts/validate-interrupt.mjs" \
  --write-policy "draft" \
  --done-when "Every JS module in scripts/ is under 300 lines and bash scripts/check.sh passes"
```

When **Engineering** finishes the branch and opens the pull request, updating the card enforces the `done` invariant (requiring non-empty `output_refs`):

```bash
node scripts/board.mjs status --file /tmp/audit-board.md \
  --id card-2026-10-26-01 \
  --status done \
  --output-refs "commit:2537513,scripts/lib/validator-self-tests.mjs"
```

If an agent attempts to mark a card `done` without `output_refs`, or assigns a non-existent role, `node scripts/board.mjs` exits non-zero and prints the contract violation.

---

## 3. Executed increments and evidence

Each card was delivered on an isolated branch, verified locally with `bash scripts/check.sh`, checked in GitHub Actions, and merged only after the repository gate passed:

| Increment | Owner role | Write policy | Verified output reference | Outcome |
|---|---|---|---|---|
| Fix post-Wave 3 doc drifts across 6 files | `publishing` | `draft` → `hitl:merge` | Commit `26d7f36` (PR `#57`) | Aligned ADR count (7 accepted + 1 proposed), skill v2 status, and gate commands |
| Extract `MemoryStore` and `JsonFileStore` | `engineering` | `draft` → `hitl:merge` | Commit `ce74bb0` (PR `#58`), [stores.mjs](../examples/approval-runtime/stores.mjs) | Reduced [runtime.mjs](../examples/approval-runtime/runtime.mjs) from 383 to 263 lines; 27 tests green |
| Add Grok Bot end-to-end walkthrough | `publishing` | `draft` → `hitl:merge` | Commit `791d5ff` (PR `#59`), [grok-bot/walkthrough.md](grok-bot/walkthrough.md) | Closed issue `#36` with explicit unverified live-account notice |
| Streamline `README.md` first screen | `publishing` | `draft` → `hitl:merge` | Commit `e39be9e` (PR `#60`), [README.md](../README.md) | Closed issue `#37`; archived search-intent working note |
| Record verification status and release `v0.2.0` | `chief-of-staff` | `draft` → `hitl:merge` | Commit `8fb977b` (PR `#61`), [verification-report.md](../docs/hosts/grok-bot/verification-report.md) | Closed issues `#38` and `#39`; published tag `v0.2.0` |
| Extract validator self-test fixtures | `engineering` | `draft` → `hitl:merge` | Commit `2537513` (PR `#62`), [validator-self-tests.mjs](../scripts/lib/validator-self-tests.mjs) | All JS modules under 300 lines (`validate-handoff.mjs` 222L, `validate-interrupt.mjs` 248L) |
| Add Markdown board CLI and unit tests | `engineering` | `draft` → `hitl:merge` | Commit `556e15a` (PR `#63`), [board.mjs](../scripts/board.mjs), [board.test.mjs](../scripts/board.test.mjs) | Added `list`, `check`, `add`, `status` CLI commands and 4 board unit tests (31 total tests) |

---

## 4. Verification and human-in-the-loop boundary

Throughout the sequence, two boundaries held:

1. **Automated sensor gate (`bash scripts/check.sh`):** Every branch ran contract self-tests, broken/fixed JSON fixtures, Markdown board validation, Cursor plugin packaging validation, retired-label coherence checks, 31 unit tests, the approval runtime walkthrough, and relative Markdown link checks before merge.
2. **Truthful verification reporting (`docs/hosts/grok-bot/verification-report.md`):** Because no live Grok Bot cloud account was connected in the local environment, the verification report explicitly marked live UI steps (plugin import, slash-command rendering, routine Test run, and 1-to-1 approval prompt) as *Not yet verified on a real account* rather than simulating or inferring live host behavior.

# Cookbook — first week

Stand up a **thin** assistant OS. Do not hire seven specialists on Monday.

## Goal

By Friday you have: a board, two write-boundaries, one HITL gate you have actually used, and one connector that is not the browser. You do **not** have a private prompt pack or a fake screenshot of the HUD.

## Day 0 — name the computer

1. Pick the **example host** you actually sit at (Grok Bot / Cursor is ours; another desktop harness is fine).
2. Create the shared FS corners: board file, interrupt file, a place for refs. Copy the shapes from [`examples/board.example.md`](../../examples/board.example.md) and [`examples/interrupt-record.example.md`](../../examples/interrupt-record.example.md). Blank the filled fields.
3. Read [`AGENTS.md`](../../AGENTS.md) once. If the host wants extra rule files, they **only** point here (see `.cursor/rules` and `.github/copilot-instructions.md` in this repo).

## Day 1 — two roles, one gate

Start with **Chief-of-staff + one specialist** that matches the pain:

| If the pain is… | Specialist |
|---|---|
| Mail / mentions | Inbox |
| A real repo | Código |
| A public page | Vitrine |
| Money close | Quinto |

Write job · objective · write-boundary on one page. Enable **one** fail-closed gate you will hit this week (usually messaging-as-user or merge). Leave the other gates documented but unused.

Do not attach the union of MCP servers.

## Day 2 — one connector

Add **one** schema’d connector the specialist needs ([connectors.md](../connectors.md)). Prove read. Prove that a write pauses. If the only path is the browser, record it as an exception, not as the architecture.

## Day 3 — one real card

Run the happy path once, out loud:

1. User: one sentence.
2. Chief-of-staff: card with `done_when` and `write_policy`.
3. Specialist: work + refs.
4. If the card needs a privileged write: interrupt, walk away, resume with a real `decided_by`.

If you skipped step 4 because “it’s just us”, you did not finish the day.

## Day 4 — routine or cloud, not both

Pick **one**:

- A tiny routine (morning triage **drafts only**, or a weekly Obs note) with a budget and a stop ([routines.md](../routines.md)), or
- One isolated Código job on a cloud agent ([when-to-use-cloud-agent.md](when-to-use-cloud-agent.md)).

Doing both in week one is how the board dies.

## Day 5 — what you refuse

Write down what you will **not** automate yet. Suggested defaults: send-as-user, prod deploy, bank, “watch the web”. Add a third specialist only if [when-to-split-an-agent.md](when-to-split-an-agent.md) fires. If the loop already feels fast and slightly wrong, read [failure-modes.md](failure-modes.md) before hiring.

## Done-when (week)

- [ ] Board has at least one `done` card with refs
- [ ] One interrupt record with a human `decided_by`
- [ ] `AGENTS.md` still ≤ 80 lines and still harness-agnostic
- [ ] No private prompts or invented screenshots landed in git

## Sister repos when you need them

Not this OS. One job each:

- [jarvis-architecture](https://github.com/tiagovilasboas/jarvis-architecture) — brain · workers · ops; swap a host without rewriting the domain
- [kiro-crew](https://github.com/tiagovilasboas/kiro-crew) — IDE Planner / Implementer / Reviewer / Ops
- [awesome-agentic-ai](https://github.com/tiagovilasboas/awesome-agentic-ai) — MCP · harness · HITL · agent security
- [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) — eval harness; measure, do not train
- [agentic-code-review](https://github.com/tiagovilasboas/agentic-code-review) — skills · runbooks · guardrails (`path:line`)

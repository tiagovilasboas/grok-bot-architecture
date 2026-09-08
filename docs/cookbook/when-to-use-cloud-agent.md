# Cookbook — when to use a cloud agent

Cloud / remote agents are **extra machines** for isolated code, not a second Inbox. [ADR 0006](../adr/0006-cloud-agents-for-code.md). The desktop chief-of-staff keeps the board and the merge gate.

Grok Bot / Cursor Cloud is the **example mapping**. The decision is host-agnostic: long isolated implementation leaves the shared desktop session. Do not confuse the Mac session with the box ([failure-modes.md](failure-modes.md) — Mac vs box).

## Use a cloud agent when all of these hold

1. The work is **code-shaped** (one repo, one card, checkable `done_when`).
2. It is **isolated** — no messaging-as-user, no vault, no prod deploy.
3. It is **long enough** that a desktop sleep or an Inbox ping would wreck the thread (think: a real PR, not a typo).
4. The output is a **branch + PR (or equivalent refs)** the desktop crew can review.
5. HITL for **merge / deploy** stays on the desktop / human side.

## Keep it on the desktop when

- The human must watch (API shape taste, local device, design).
- The job needs Inbox, Quinto, or Vitrine connectors.
- The change is small enough that dispatch costs more than the edit.
- You cannot state `done_when` without a conversation.
- You were about to send a cloud agent at **production** with deploy keys. That is Entrega + HITL, not cloud.

## Dispatch contract

Chief-of-staff (or Código) writes a card the remote job can execute without the chat:

| Field | Cloud job needs |
|---|---|
| `goal` | One sentence |
| `refs` | Repo, branch base, issue, paths |
| `done_when` | Tests / acceptance |
| `write_policy` | `draft` (PR). Not `hitl:merge` |
| `stop` | PR opened, budget hit, or `block` |

The cloud agent **does not** merge, rotate secrets, or mail the user. It may push a feature branch if the host allowlist says so.

## After it returns

1. Código or the chief-of-staff attaches PR / SHA refs to the board.
2. Review happens like any other change ([agentic-code-review](https://github.com/tiagovilasboas/agentic-code-review) if you want that kit).
3. Entrega + HITL for merge/deploy.

If the remote job opened a PR and also merged it, the gate failed — treat it as an incident, not a speed win.

## Token note

You pay for a **clean window**. That is often cheaper than stuffing a SWE loop into a desktop session that also holds mail. It is not free. Do not dispatch three cloud agents because the board looks busy; dispatch the one card that meets the tests above.

## Vendor leak check

If this cookbook only works when the host string is “Cursor Cloud”, rewrite the mapping sentence and keep the five tests. The OS does not require that product.

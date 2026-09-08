# Cookbook — when to split an agent

Split when **windows, secrets, or write-boundaries collide**. Do not split because a slide had seven swimlanes.

## Keep one specialist when

- The same human would do the work in one sitting.
- Tools overlap and none of them send/merge/pay.
- You cannot write a second `done_when` that is not a prefix of the first.
- The only pain is model quality. That is a prompt/eval problem, not a crew problem.

A Chief-of-staff + one specialist is a legal OS ([first-week.md](first-week.md)).

## Split when at least one is true

| Collision | Symptom | Split |
|---|---|---|
| **Secrets** | Inbox context can see bank or deploy | Quinto / Entrega off Inbox |
| **Write-boundary** | The same window drafts mail *and* merges | Inbox vs Código vs Entrega |
| **Untrusted content** | Issue text or mail can reach an exfil tool | Drop a lethal-trifecta leg ([security.md](../security.md)) |
| **Token window** | Routing needs a summary because the body no longer fits | New role **or** a tighter query — try the query first ([token-economy.md](../token-economy.md)) |
| **Cadence** | A routine and an ad-hoc job keep preempting each other | Same role, two cards — split only if secrets differ |
| **Machine** | A 40-minute SWE loop blocks HITL on the desktop | Not a new personality: cloud agent ([when-to-use-cloud-agent.md](when-to-use-cloud-agent.md)) |

If you cannot fill that table, do not add a role.

## How to split (minimum ceremony)

1. Name the **job** in one sentence.
2. Name **objective** (checkable).
3. Name **write-boundary** and the HITL gate it inherits.
4. Cut the connector allowlist to what that job needs.
5. Add **one** hop on [handoffs.md](../crew/handoffs.md). If you need a mesh, you over-split.

Example names in this repo (`Inbox`, `Código`, `Vitrine`, `Quinto`, `Entrega`, `Obs`) are labels for those collisions — not a hiring plan.

## Refusals

- **Evaluator as a seventh agent** when you have no eval artifact. Use [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) first.
- **Mirror every human job title.** The OS is smaller than the company.
- **Split to “move faster.”** Extra hops are tokens and missed gates. Anthropic’s effective-agents note still applies: add complexity when it measurably helps. Fan-out spam is a failure mode, not a crew ([failure-modes.md](failure-modes.md)).

## After you split

Re-read the chief-of-staff write-boundary. If it gained the new specialist’s tools, you did not split — you cloned.

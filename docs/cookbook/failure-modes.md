# Cookbook — failure modes

Ways a working crew becomes an expensive toy. Each row is a **symptom**, the **mistake**, and the **control already in the OS**. Do not add a role to fix them.

Pattern first: crew, shared computer, HITL, connectors. [Grok Bot](https://cursor.com) / Cursor is the example host mapping, not the decision.

## Token burn

| | |
|---|---|
| **Symptom** | The board looks busy; quality and the bill both drop. Hops carry last week’s mail. Código greps the whole tree. A routine “summarizes the inbox” every morning. |
| **Mistake** | Treating context as free and coordination as intelligence. Transcript dumps, union tool schemas on the chief-of-staff, browser pixels as “context”. |
| **Control** | [ADR 0005](../adr/0005-token-thrift.md) · [token-economy.md](../token-economy.md). Refs, not blobs. One job in the window. Routine `budget` + `stop`. Measure with traces; do not invent prod numbers here. |

**Stop doing:** Pasting the chat into the next specialist. Attaching every MCP server “for routing”. Dispatching three cloud agents because the board has three open cards.

## Fan-out spam

| | |
|---|---|
| **Symptom** | One user sentence becomes five specialists, two cloud jobs, and a mesh of hops. Nobody owns `done_when`. Inbox pings Código “just in case”. |
| **Mistake** | Orchestrator as a fan-out switch. Splitting for ceremony. Specialists spawning peers. |
| **Control** | [ADR 0001](../adr/0001-crew-of-agents.md) · [when-to-split-an-agent.md](when-to-split-an-agent.md). Chief-of-staff assigns **one** specialist. Extra hops need a collision (secrets, write-boundary, window). Routines: one owner, optional one hop to Obs ([routines.md](../routines.md)). |

**Stop doing:** “Notify the whole crew.” Evaluator-as-seventh-agent with no eval artifact. Cloud fan-out that fails the five tests in [when-to-use-cloud-agent.md](when-to-use-cloud-agent.md).

## Mac vs box

| | |
|---|---|
| **Symptom** | The laptop chat *is* the OS. Or the remote machine *is* a second OS that can merge, mail, and pay. HITL lives “wherever the model is running.” The only board is the thread. |
| **Mistake** | Confusing the **desktop session** (the Mac you sit at) with the **shared computer** (board, interrupts, working tree) and with **extra rooms** (cloud / remote boxes). |
| **Control** | [ADR 0002](../adr/0002-shared-computer-vs-desktop.md) · [ADR 0006](../adr/0006-cloud-agents-for-code.md). The OS is the shared computer. The Mac session is the keyboard. A box is an extra machine for isolated code. Merge / deploy / secrets / messaging-as-user stay on the human + desktop side. Cloud returns branch + PR **refs**, not a shipped product. |

**Stop doing:** Letting a cloud agent merge because the Mac is asleep. Keeping the board only in chat. Copying Inbox or Quinto connectors onto the box “so it can finish.”

Grok Bot / Cursor Cloud is the mapping we use. Any desktop host + any remote code runner must keep the same split.

## Silent approval

| | |
|---|---|
| **Symptom** | `decided_by` is a model. The demo was waiting. “It’s just us.” A cloud PR is already on `main`. A draft RSVP left the mailbox. |
| **Mistake** | HITL as a personality setting. Inventing resume. Treating `default_on_timeout=wait` as `approve`. |
| **Control** | [ADR 0003](../adr/0003-hitl-on-side-effects.md) · [hitl.md](../crew/hitl.md). Persist the interrupt. Empty `decision` until a human writes it. If nobody answers, **wait**. Allowlists are dated files, not vibes. |

**Stop doing:** Completing the interrupt form to be helpful. Merging from the box. Sending as the user because the draft looked done. Skipping the real gate in [first-week.md](first-week.md) because it felt ceremonial.

## How to use this page

When a loop feels fast and slightly wrong, find the row before you add a role. If the row is not here, it is probably a product bug or an eval miss — not a new swimlane.

[architecture.md](../architecture.md) (diagram ↔ ADRs) · [security.md](../security.md) · [token-economy.md](../token-economy.md)

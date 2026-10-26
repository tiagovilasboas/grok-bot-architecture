# Grok Bot approval policy

This page maps the four repository gates in [crew/hitl.md](../../crew/hitl.md) (merge, deploy, secrets, messaging-as-user) to Grok Bot levers, as documented on 2026-10-26. It is a policy to adopt, not a claim that the product enforces the repository's rules. Product facts come from [platform-facts.md](platform-facts.md). Menu labels come from the official [Security](https://docs.x.ai/grok-bot/security) and [Teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises) pages and have not been seen on an account; see [Not verified](#not-verified).

Ask first rules are text that Auto Review's independent model evaluates against each action. How the reviewer matches rule text to an action is not documented. Treat each rule as a request to pause, not as a deterministic filter.

## Gate mapping

| Gate | Grok Bot lever to set | Exact rule text for Ask first (copy-paste) | Scope it must not exceed | Source | Enterprise only? |
|---|---|---|---|---|---|
| Merge | Personal Auto Review rule of type **Ask first** (Settings → General → Auto-review, Custom Rules). Approval level: **Allow once**, never Always allow. | `Ask first: any push to the default branch or merge of a pull request` | Covers merges and default-branch pushes. Not a permission to open or update a draft PR, push a feature branch, or delete a branch. | [Security](https://docs.x.ai/grok-bot/security) | No for a personal rule. Yes for a team-wide rule (Configure Rules). |
| Deploy | Personal Auto Review rule of type **Ask first**. Approval level: **Allow once**. | `Ask first: any deploy, publish, or change to a production system` | Covers production and customer-visible publish, as hitl.md defines the gate. Not a basis to allow other deploys silently. | [Security](https://docs.x.ai/grok-bot/security) | No for a personal rule. Yes for a team-wide rule. |
| Secrets | Personal Auto Review rule of type **Ask first**. Approval level: **Allow once**. | `Ask first: any read or write of credentials, tokens, billing, bank, or tax records` | Covers reads and writes of those records. Logins, two-factor steps, payments, and CAPTCHAs are handed to the human by the platform ([platform-facts](platform-facts.md)), so this rule adds to that; it does not replace it. Never Always allow for an app call that reads a vault or billing page. | [Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps), [Security](https://docs.x.ai/grok-bot/security) | No for a personal rule. |
| Messaging-as-user | Personal Auto Review rule of type **Ask first**. Approval level: **Allow once**. Answer in the owning Bot's one-to-one chat, because approval requests do not appear in group chats. | `Ask first: any message, email, post, or invitation sent as the member` | Covers each send as the member. A local draft is not a send (hitl.md). Approval for one send does not authorize later sends to other recipients. | [Chat and collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration), [Security](https://docs.x.ai/grok-bot/security) | No for a personal rule. |

**Companion rule for the merge gate.** hitl.md also pauses force-pushes and tags. The merge rule text above does not name them, so add a second Ask first rule with this text: `Ask first: any force-push or tag push`.

## Settings baseline

- **Local execution policy: Never allow.** Platform facts say xAI recommends this unless a Bot needs local files. If one does, use **Ask every time**, not Always allow. Menu label (not verified on an account): Settings → Computer → Your computer, "Execution on this computer".
- **Apply to MCP servers: on wherever an allowlist is used.** It is an Enterprise-only switch under Network Controls and is off by default. An allowlist mode without it does not restrict MCP servers ([platform-facts](platform-facts.md)).
- **Enforce Auto-review: on, on Enterprise.** It stops members from turning Auto Review off. It is off by default. See the Enterprise section below.
- **No Always allow for actions that send, publish, delete, or purchase.** Always allow can save a matching rule ([platform-facts](platform-facts.md)), so a saved rule would skip the gate for every later instance.
- **Narrow rules tied to known actions.** The Security page warns against broad rules such as "allow everything in the browser" and gives a narrow example instead: asking before any external email. Do not write broad allow rules for the four gates.
- **Do not use Allow automatically for the four gates.** That rule type applies only when the reviewer finds no other reason to stop the action, so it can let a gated action through.

## Enterprise-only levers

These need an Enterprise plan. Verify the plan before relying on them.

- **Enforce Auto-review** (off by default). When on, Bots check risky actions and ask for approval, including Team Bots in chats where nobody can answer. The request then waits for an answer, which matches the fail-closed default.
- **Team-wide Auto Review rules** (Configure Rules). Ask first wins when rules conflict. Members see these rules but cannot edit them.
- **Inference Hooks** (beta, for all Enterprise teams). Each model request is sent to the team's AI security server, which allows or denies it. New configurations start in **Shadow mode**, which logs denials without blocking. Do not count Shadow mode as enforcement.
- **MCP allowlist and Apply to MCP servers.** Covered above.

## Auto Review gaps

The Security page names these side effects as outside Auto Review's review: **memory writes** and **most settings changes**. The repository does not depend on Auto Review for them. The response is:

1. **Approval of the action where possible.** If a settings change falls inside a gate's scope (for example, a connector that can send messages, or a network policy), the Bot asks in chat before making it and waits for an answer. The product does not enforce this. It is a convention the operator must check.
2. **Memory writes.** Do not put approvals, secrets, or decisions into memory (mapping.md, memory row). If a Bot has written a memory that bears on a gate, add a note on the board in `/workspace` that a human must check it against the source system.
3. **Anything else that is not reviewed and not approvable** gets a board note, and a human checks it before the next consequential action.

## Not verified

- Whether an Ask first rule stacks with a saved Always allow or an Allow once decision in practice. The Security page says Ask first always stops matching actions and wins conflicts. It does not say how a saved Always allow rule interacts with it.
- How the reviewer matches rule text to an action (literal wording or meaning).
- Menu labels, all of them from official page text and none from an account: Settings → General → Auto-review, Custom Rules, Configure Rules, Settings → Computer → Your computer, Execution on this computer, Network Controls, Apply to MCP servers, Enforce Auto-review.
- Whether personal Custom Rules are available on every plan. The Security page describes them; the Teams-versus-Enterprise table on the Teams page does not list them.
- Whether Team Bots behave differently under the same rules.
- Whether Team Secrets (an Enterprise dashboard item) can hold the credentials named in the secrets gate. The page lists the label; its use here is not described.

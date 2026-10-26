# Grok Bot platform facts

Reviewed: 2026-10-26. This page records what the official Grok Bot documentation states, so the mapping and roadmap rest on the host as it is, not as this reference wishes it to be. Each fact is paraphrased and linked. Items from community sources are marked **community** and need confirmation on a real account.

Re-check these pages before relying on a fact; product behavior and menu names change.

## Bots and memory

- A Bot is a persistent teammate with a name, a job, its own conversation, and context that builds over time. You define the job, sources, and approval boundaries in the first message and ask the Bot to remember them. ([Bots](https://docs.x.ai/grok-bot/bots))
- xAI recommends starting with **one Bot that owns an end-to-end outcome** and adding a specialist only for a distinct goal, toolset, working style, approval boundary, or recurring schedule. ([Bots](https://docs.x.ai/grok-bot/bots))
- Memory is not authoritative. Keep changing facts in source systems and have the Bot reopen current data for consequential decisions. ([Bots](https://docs.x.ai/grok-bot/bots))
- No model selection, numeric Bot limit, or per-Bot permission settings are documented. ([Bots](https://docs.x.ai/grok-bot/bots))

## Shared computer

- All Bots on one account share one persistent cloud computer: files, browser sessions, and app logins. Each user gets a dedicated microVM; users cannot reach each other's computers. ([Overview](https://docs.x.ai/grok-bot/overview), [Teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises))
- Durable project files belong in `/workspace`, which every Bot on the account can see. Screens are separate work surfaces, **not security boundaries**. ([Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps))
- One Bot runs one computer-use task on its screen at a time. ([Overview](https://docs.x.ai/grok-bot/overview))
- Deleting a Bot removes its profile, conversation, and routines; shared files and sign-ins can remain. ([Bots](https://docs.x.ai/grok-bot/bots))

## Apps, MCP, and credentials

- Connected apps are account-wide: every Bot on the account can use them. OAuth tokens stay on Cursor's connector backend and are not given to the Bot. ([Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps))
- A Bot has no identity of its own. It acts as the signed-in member, with no more access than that person. ([Security](https://docs.x.ai/grok-bot/security))
- Login, two-factor, payment, and CAPTCHA steps are handed to the human. Passwords and one-time codes do not belong in chat; supported connections offer a masked secret request. ([Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps))
- Grok Bot inherits the team's Cursor plugin and MCP policy; there is no separate Grok Bot connector list. The MCP allowlist and network allowlists are Enterprise features. ([Teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises))

## Skills and packaging

- A skill is a reusable set of task instructions. Private skills form one library shared by all of the account's Bots. Create one by asking a Bot to save a completed process, or record a demonstration with **Teach a task**. Reference a saved skill with `/` in the composer. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))
- A useful skill states six things: when to use it, required inputs and access, the sequence of work, how to validate the result, what to return, and what requires approval. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))
- **Connect apps** installs supported apps and packaged skills. The official Grok Bot pages do not document a skill file format. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))
- Cursor plugins bundle skills as `skills/<name>/SKILL.md` with `name` and `description` frontmatter, under a `.cursor-plugin/plugin.json` manifest whose only required field is a kebab-case `name`. ([Cursor plugin reference](https://cursor.com/docs/reference/plugins))
- **Community:** Grok Bot plugins are distributed through the Cursor marketplace or a team marketplace, using the Cursor plugin format. Example: [orgx-grokbot-plugin](https://github.com/useorgx/orgx-grokbot-plugin). Not yet confirmed on an account by this repository's maintainer.
- **Not Grok Bot:** [xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace) and its `.grok-plugin` format describe plugins for **Grok Build**, a different product.

## Routines

- A routine tells one Bot when to run a workflow, on a schedule or after a supported event. When creating one, confirm the owning Bot, schedule and time zone, input source, expected result, approval boundary, and behavior when a source is missing. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))
- Limits: up to 50 routines per Bot, the 20 most recent run records per routine, and schedules at least five minutes apart. A **Test** run performs real work. Routines can be paused after a long absence. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))
- xAI's guidance: make a one-time task reliable first, save it as a skill, then automate; automate preparation before action; define a no-data and stale-data policy; make retries idempotent. ([Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations))

## Approvals and Auto Review

- An approval prompt shows the proposed operation and inputs with **Allow once**, **Always allow** (can save a matching rule), and **Deny**. It controls the proposed action, not work already done. ([Security](https://docs.x.ai/grok-bot/security))
- Local command execution: **Ask every time** (member default), **Always allow**, or **Never allow**; xAI recommends **Never allow** unless a Bot needs local files. ([Security](https://docs.x.ai/grok-bot/security))
- Auto Review is an independent model that evaluates risky actions (shell commands, app calls, computer use, automation writes, delegation) and can allow, ask, or deny. Custom **Ask first** rules always stop matching actions and win conflicts. It does **not** review every side effect: memory writes and most settings changes are named exceptions. ([Security](https://docs.x.ai/grok-bot/security))
- An MCP allowlist only restricts MCP servers when **Apply to MCP servers** is turned on. ([Security](https://docs.x.ai/grok-bot/security))

## Collaboration

- Group chats hold two to six Bots; one coordinator Bot can assign work within a group. Bots also send each other asynchronous direct messages. ([Chat and collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration))
- Approval requests, secret and login requests, and email or Slack drafts **do not appear in group chats**. Bot-to-group handoffs are text-only. ([Chat and collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration))
- xAI advises a single owner at each stage; many parallel handoffs cause duplicate work. "Stop now" ends work but does not undo completed actions. ([Chat and collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration))

## What this means for this reference

1. **Role separation is a convention on Grok Bot, not an enforced boundary.** Apps, files, and sessions are shared by every Bot on an account. Per-role allowlists in this repository describe intent; the enforced levers are approvals, Auto Review rules, local execution policy, Enterprise network and MCP controls, and separate accounts or Team Bots.
2. **HITL happens in one-to-one chats.** A coordinator can route in a group, but the approval itself surfaces in the owning Bot's direct conversation.
3. **The board belongs in `/workspace`**, because memory is not authoritative and files are the shared, durable state.
4. **Skills need two install paths:** a Cursor plugin for packaged installation, and a paste-and-save prompt for a private skill. Both must be verified on a real account before the README claims them.
5. **The approval-runtime spike does not run inside Grok Bot.** Grok Bot's native approvals are the gate there. The spike remains a conformance reference for hosts that embed their own runtime.

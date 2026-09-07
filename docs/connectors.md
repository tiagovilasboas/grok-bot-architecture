# Connectors

Connectors are how the shared computer talks to the world. They are **not** the architecture. [ADR 0004](adr/0004-connectors-over-browser.md): schema’d MCP / APIs first; browser last.

## Placement

```text
specialist  →  host MCP client  →  server (tools · resources · prompts)
                     │
                     └── secrets stay in the host store
```

[MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture) is the host / client / server split. This OS adds one rule: **each specialist sees a subset**. The chief-of-staff does not get the union “for routing convenience”.

## Contract (minimum before you add one)

| Question | Fail closed if unanswered |
|---|---|
| Which role may call it? | Shared kitchen drawer |
| Read vs write tools? | Writes inherit HITL ([crew/hitl.md](crew/hitl.md)) |
| Auth / identity? | Token-passthrough or “the user’s cookie” |
| What untrusted content can it ingest? | Inbox and web bodies are hostile |
| What is the exfil path? | Send, write-remote, arbitrary URL |
| How do we evict it? | No uninstall story |

Adding a server is a **host decision**. Do not paste catalogs into this repo. Curation criteria live in [awesome-agentic-ai](https://github.com/tiagovilasboas/awesome-agentic-ai). Official security notes: [MCP security best practices](https://modelcontextprotocol.io/docs/latest/tutorials/security/security_best_practices).

## Allowlists (by role, examples)

| Role | Typical connectors | Never by default |
|---|---|---|
| Chief-of-staff | Board, interrupt store, read-only status | Bank, deploy, mail send |
| Inbox | Mail/chat **read** + draft | Send, calendar invite-as-user |
| Código | Git host, repo FS, test runner, cloud-agent spawn | Production deploy keys |
| Vitrine | CMS / storefront **draft** APIs | Live publish |
| Quinto | Ledger export **read**, local sheet | Payment rails |
| Entrega | Staging, package registry (staging) | Prod deploy, customer mail |
| Obs | OTel / eval backends | Alert mute, log delete |

These are pattern examples. Write the real map on the shared computer.

## Browser (computer-use)

Allowed when:

1. No connector exists,
2. The job is **read** or a recorded one-off,
3. A human is watching **or** the output cannot leave the machine without HITL.

Treat DOM/pixels as untrusted content. Do not “click Send” in a web UI to bypass the messaging gate. Do not use the browser as a generic API client for a surface that already has MCP.

## Anti-patterns

- **Tool soup.** If the window lists thirty tools, you are not routing — you are hoping.
- **One server for the whole crew.** That is how Quinto secrets show up in Inbox context.
- **Resource bodies in the hop.** Summarize + ref. The next agent can fetch.
- **Custom auth schemes.** Prefer the MCP authorization model; do not invent a shared PAT in the board file.

## Host swap

When you leave Grok Bot / Cursor, keep the **allowlist table** and replace the attachment mechanism. If a specialist cannot run without a vendor-specific tool name, the connector layer leaked into the domain. Fix the contract, not the README adjective.

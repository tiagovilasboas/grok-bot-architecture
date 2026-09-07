# Board example

Filled **shape** for a shared-computer board. Invented product work, not a screenshot and not a private workspace dump. Copy the headings; blank the fields.

```text
# Board

Updated: 2026-09-07
Chief-of-staff: <host session id or "desktop">
```

## Card `card-2026-09-07-01`

| Field | Example value |
|---|---|
| `id` | `card-2026-09-07-01` |
| `goal` | Draft a reply to the conference invite; do not send |
| `from` | user |
| `to` | Inbox |
| `kind` | `assign` |
| `refs` | `mail://inbox/msg-1842` (connector id, not the body) |
| `write_policy` | `draft` + `hitl:messaging-as-user` if we later send |
| `done_when` | Draft in the host draft folder; interrupt filed if send is requested |
| `status` | `done` |
| `output_refs` | `mail://drafts/d-992`, `interrupt-2026-09-07-01` (none if unsent) |

## Card `card-2026-09-07-02`

| Field | Example value |
|---|---|
| `id` | `card-2026-09-07-02` |
| `goal` | Add a fail-closed check on the ship script in this repo’s docs (example: a checklist heading) |
| `from` | Chief-of-staff |
| `to` | Código |
| `kind` | `assign` |
| `refs` | `docs/crew/hitl.md`, `docs/cookbook/when-to-use-cloud-agent.md` |
| `write_policy` | `draft` (branch). `hitl:merge` to default |
| `done_when` | PR ref with the checklist; no merge |
| `status` | `done` |
| `output_refs` | `pr://example/grok-bot-architecture/1` (placeholder host mapping) |
| `cloud_agent` | not used — change was small |

## Card `card-2026-09-07-03`

| Field | Example value |
|---|---|
| `id` | `card-2026-09-07-03` |
| `goal` | Staging checklist for the docs PR; do not deploy anything |
| `from` | Código |
| `to` | Entrega |
| `kind` | `review` |
| `refs` | `card-2026-09-07-02`, `pr://example/grok-bot-architecture/1` |
| `write_policy` | `read` (this repo has no prod) |
| `done_when` | Residual risk named; merge still HITL |
| `status` | `block` — waiting on user merge decision |

## Legend

- `status`: `open` · `done` · `block` · `dropped`
- No mail bodies, no tokens, no customer names.
- If your host is not files-on-disk, keep the **fields**; change the store.

# Interrupt record example

Filled **shape** for a persisted HITL pause. Not a UI capture. Not an approval invented by the model.

```text
id:                 interrupt-2026-09-07-01
gate:               messaging-as-user
asked_at:           2026-09-07T14:02:00Z
asked_by:           Inbox
card:               card-2026-09-07-01
summary:            Send the conference RSVP draft as the user
refs:               mail://drafts/d-992
default_on_timeout: wait
decision:           <empty until a human writes it>
decided_by:         <empty>
decided_at:         <empty>
notes:              Draft only so far. Do not send on timeout.
```

## After a human resumes (same record, edited)

```text
id:                 interrupt-2026-09-07-01
gate:               messaging-as-user
asked_at:           2026-09-07T14:02:00Z
asked_by:           Inbox
card:               card-2026-09-07-01
summary:            Send the conference RSVP draft as the user
refs:               mail://drafts/d-992
default_on_timeout: wait
decision:           reject
decided_by:         tiago
decided_at:         2026-09-07T16:40:00Z
notes:              Keep as draft; I will reply from the phone.
```

Rules:

- `decided_by` is a human identifier the host already knows.
- A specialist must not fill `decision` to be helpful.
- Merge / deploy / secrets use the same shape with a different `gate`.

# ADR 0008 — Role groups: Core team and Domain specialists

## Status
Accepted

## Context
ADR 0001 grouped the roles under labels that later drifted: "Apps hub", "Staff Core team", "Staff crew", and rename leftovers such as "Obs" and "Cibersec". The README and the crew docs use **Core team** and **Domain specialists**. Readers met two different groupings for the same roles. The role set itself did not change.

## Decision
We group the roles as follows.

- **Core team** (coordination and cross-cutting work): Chief-of-staff, Inbox, Engineering, Publishing, Security, Career.
- **Domain specialists** (optional, adopted when a need appears): Finance, Product, Hobby.

Role names are unchanged. Release is still not a seat, as ADR 0001 states.

"Apps hub", "Staff Core team", and "Staff crew" are retired labels. They may remain in history, such as this ADR and the earlier records, but not in current guidance.

ADR 0001 stays Accepted. Its decision (a crew of specialists with HITL and typed handoffs) is unchanged. Only its group labels are superseded by this record.

## Consequences
+ One grouping across the README, the architecture diagram, the crew docs, and the cookbook.
+ A coherence check can fail on retired labels outside the history (planned in task F3).
− ADR 0001 keeps its original wording, so readers of that file alone still see the old labels. The note under its status points here.

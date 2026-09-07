# ADR 0005 — Token thrift

## Status
Accepted

## Context
Multi-agent designs lose on coordination and context long before they lose on model IQ. Transcript dumps across hops, full-repo greps in every specialist, and “summarize the week” on a hot Inbox window are how the bill (and the quality) dies. Published multi-agent write-ups treat token use as the score, not a footnote.

## Decision
**Token thrift is a control.** Handoffs carry **refs** (paths, issue ids, SHAs, interrupt ids), not blobs. Each specialist loads only the files for the current job. Routines have a budget and a stop. Split a role when windows collide ([docs/cookbook/when-to-split-an-agent.md](../cookbook/when-to-split-an-agent.md)); do not split for ceremony. Measure with traces/evals ([agent-measurement](https://github.com/tiagovilasboas/agent-measurement), [OTel GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/)) — do not invent production numbers in this repo.

## Consequences
+ Cheaper, more eval-able hops
+ Forces a real board instead of chat archaeology
− Adapters must resolve refs; chat-only hosts feel thinner
− A tight budget will refuse useful-but-huge context; that is the point

# Search intent research: Grok Bot Architecture

> **Archive note:** This document preserves early editorial research (2026-10-25) into search intent. It is kept for historical context; active guidance lives in [docs/architecture.md](../architecture.md) and [docs/hosts/grok-bot/mapping.md](../hosts/grok-bot/mapping.md).

These are editorial hypotheses, not measured keyword rankings or traffic predictions.

## Google Trends attempt

Requested a worldwide, past-12-month comparison of search terms: grok bot, grok ai, ai agents, multi agent, and mcp. The Explore page did not expose comparable series through the research tool; the public data request returned HTTP 429. No time series, relative scores, related-query rankings, absolute volumes, or growth rates were obtained.

[Reproduce worldwide comparison](https://trends.google.com/trends/explore?date=today%2012-m&q=grok%20bot%2Cgrok%20ai%2Cai%20agents%2Cmulti%20agent%2Cmcp&hl=en)

Repeat separately for Brazil (geo=BR), with fixed dates and the same search surface before making a quantitative comparison. Broad terms such as MCP can include unrelated meanings. Do not interpret Google Trends' normalized 0–100 interest as absolute search volume; see [Google's explanation](https://support.google.com/trends/answer/4365533?hl=en).

## Supported editorial choices

The [official overview](https://docs.x.ai/grok-bot/overview) and its linked product documentation cover persistent teammates, shared computers, skills, routines, collaboration, and approvals. These subjects are relevant to this reference's actual content.

| Intent hypothesis | Public content |
|---|---|
| Grok Bot architecture / multi-agent teams | README introduction and diagram |
| Grok Bot skills / chief-of-staff agent | Role contracts and nine public skill recipes |
| Grok Bot MCP connectors | Connector guidance with explicit host requirements |
| Grok Bot approvals / shared computer security | FAQ and authenticated approval boundaries |
| Open-source agent architecture | MIT reuse, portable contracts, quick start |

The FAQ answers these questions without implying affiliation, official product source, guaranteed host integration, or measurable demand. Google Search results helped identify official documentation; their presence does not measure keyword demand.

## Follow-up measurement

If authorized analytics become available, record a baseline of repository views, unique visitors, referrers, and adoption reports. Compare equivalent periods after publication while accounting for releases and promotion. GitHub README edits do not provide control over search-engine title tags, ranking, or indexing timing.

## GitHub metadata proposal

Repository description and topics could not be applied: the repository metadata API returned HTTP 403 on 2026-10-25. These require repository administration access through a suitable connection.

Suggested description: Independent MIT reference for Grok Bot-style AI agent teams, agent skills, MCP connectors and human-in-the-loop approval. Model- and framework-agnostic.

Suggested topics (retain existing relevant topics): agentic-ai, architecture, desktop-agents, grok-bot, hitl, mcp, multi-agent, staff-engineer, ai-agents, agent-skills, agent-orchestration, human-in-the-loop, model-context-protocol.

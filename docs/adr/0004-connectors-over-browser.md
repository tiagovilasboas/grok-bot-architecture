# ADR 0004 — Connectors over browser

## Status
Accepted

## Context
Driving the live desktop browser is tempting: every SaaS has a UI. It also feeds the agent **untrusted content**, burns tokens on pixels/DOM, and skips auth contracts. The [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) (private data + untrusted content + exfil) shows up first in “just click through the inbox”.

## Decision
Prefer **connectors** — [MCP](https://modelcontextprotocol.io/docs/learn/architecture) tools/resources or first-party APIs — with a schema, auth, and a write-boundary. Browser (computer-use) is **last resort**: no contract, one-off read, or a human already watching. Treat page content as hostile. Do not use the browser to send as the user when a connector exists.

## Consequences
+ Smaller tool surface; easier HITL and threat modeling
+ Swap a server without rewriting the specialist
− Some surfaces have no MCP/API; browser stays, with a recorded exception
− Connector sprawl is still a host decision ([awesome-agentic-ai](https://github.com/tiagovilasboas/awesome-agentic-ai) criteria), not a catalog dump

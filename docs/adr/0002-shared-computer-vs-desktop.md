# ADR 0002 — Shared computer vs desktop

## Status
Accepted

## Context
“Desktop agent” is sold as the product. Staff need the machine: a filesystem, a board, interrupt records, connector credentials, and a browser that is not the architecture. Confusing the chat surface with the computer makes host lock-in look like design.

## Decision
The OS is a **shared computer**: working tree, `examples/`-shaped board, persistable interrupts, and connector config. A **desktop session** (Grok Bot / Cursor or another host) is one way to sit at that computer. Cloud agents ([ADR 0006](0006-cloud-agents-for-code.md)) are extra machines with a narrower write-boundary, not a second OS. Layers stay vendor-agnostic — same stance as [jarvis-architecture ADR 0003](https://github.com/tiagovilasboas/jarvis-architecture/blob/main/docs/adr/0003-vendor-agnostic.md).

## Consequences
+ Host is replaceable; the board and gates survive
+ Honest split between “I typed in chat” and “the computer changed”
− Chat-only hosts need a thin adapter (files or a ticket) for board + interrupt
− Shared FS is a trust boundary: specialists still do not share every secret

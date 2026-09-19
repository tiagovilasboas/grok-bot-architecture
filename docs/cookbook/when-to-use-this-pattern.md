# Cookbook — when to use this pattern

Use this repo when you are deciding **how a desktop assistant is organized**, not which model or IDE to buy. The artifact is the ADR log plus the validators that prove the contracts.

## Use this pattern when

- More than one job shares a computer (inbox, code, ship, money) and **secrets or write-boundaries collide**.
- Privileged writes (merge, deploy, secrets, messaging-as-user) must **fail closed** and resume only with a human `decision`.
- The assistant should talk to the world through **connectors** (MCP / APIs), not by driving the browser as the architecture.
- Handoffs must be **typed envelopes** (`refs`, not transcripts) because token burn and silent hops are the usual failure.
- You need a **host-agnostic** staff log: swap Grok Bot / Cursor for another desktop harness; keep ADRs 0001–0006.

## Do not use this pattern when

- One human, one repo, one chat is enough. A crew is ceremony ([when-to-split-an-agent.md](when-to-split-an-agent.md)).
- You only need an eval suite, a PR review checklist, or a curated link list. Those are not this OS; keep them in your tree.
- You want a product CLI or a host SDK. This repo is ADRs + contracts + `node scripts/validate-all.mjs`.
- You are looking for a private prompt pack or a screenshot of a HUD.

## What to read first

1. The decision on the [README](../../README.md), then prove it: `node scripts/validate-all.mjs`
2. [architecture.md](../architecture.md) and [adr/README.md](../adr/README.md)
3. [first-week.md](first-week.md) if you are standing the OS up

When the loop already feels fast and slightly wrong: [failure-modes.md](failure-modes.md).

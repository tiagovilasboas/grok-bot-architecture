# Install the role skills for Grok Bot

The nine role skills (`skills/<role>/SKILL.md`) are packaged as one Cursor plugin, `grok-bot-architecture-roles`, with the manifest at `.cursor-plugin/plugin.json`. Check the package with `node scripts/validate-plugin.mjs`.

**Verification status: documented, not observed on an account.** Every path below is a documented procedure. Recording a live run is optional; see the [verification report](verification-report.md). Describe a path as working only after someone has observed it on an account. The facts behind these steps are in [platform-facts.md](platform-facts.md), and the host mapping is in [mapping.md](mapping.md).

## Not claimed

- **No public marketplace listing.** The plugin is not listed on any marketplace. The Cursor plugin reference says plugins are reviewed by the Cursor team and that a public listing submission needs a public repository ([Cursor plugin reference](https://cursor.com/docs/reference/plugins)).
- **No native Grok Bot skill file format.** The official Grok Bot pages do not document one ([platform-facts.md](platform-facts.md)).

## a. Team marketplace

Status: documented, not observed on an account.

1. In the Cursor dashboard, open **Plugins** and import this repository with **Import from Repo**, so that Grok Bot's connected apps can offer the plugin. The Cursor plugin reference does not describe this import step, so check the current dashboard before relying on it.
2. The reference does not state how a team marketplace reads a repository. It says that a repository publishing several plugins places `.cursor-plugin/marketplace.json` at its root, and that each entry points to a plugin directory through `source`. This repository publishes one plugin at its root and does not add that file.

## b. Local plugin

Status: documented, not observed on an account.

Link or copy this repository directory into the local Cursor plugins folder. **The local install path is not documented; check Cursor's current plugin docs for where local plugins live.**

Whether a locally installed plugin is visible to Grok Bot is not documented either. Verify it on an account before relying on it.

## c. Paste-and-save

Status: documented, not observed on an account.

1. Open one role's `skills/<role>/SKILL.md` and copy the whole text, including the frontmatter.
2. In a Bot's chat, paste the text and ask the Bot to save it as a private skill.
3. Check that the skill appears when you type `/` in the composer, and under **Private skills**.

If the skill does not appear, [platform-facts.md](platform-facts.md) does not say whether a private skill needs enabling for each Bot. Look for an enabling setting on that Bot before concluding that the save failed.

Saving a skill does not change what a Bot may do. Approvals and Auto Review still apply ([mapping.md](mapping.md)). All nine role skills follow the v2 six-element shape.

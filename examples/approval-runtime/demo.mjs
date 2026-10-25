import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createApprovalRuntime, JsonFileStore } from "./runtime.mjs";

const directory = await mkdtemp(path.join(os.tmpdir(), "approval-runtime-demo-"));
try {
  const action = {
    operation: "publish-preview",
    resource: "docs/release-notes.md",
    revision: "fictional-revision-1",
    arguments: { visibility: "preview" },
  };
  const runtime = await createApprovalRuntime({
    store: new JsonFileStore(directory),
    // Demo-only identity mapping. Replace it with the consuming host's real auth.
    authenticateHuman: async (credential) => credential === "demo-human-session"
      ? { type: "human", subject: "demo-reviewer" }
      : null,
    authorizeApproval: async () => true,
    resolveCurrentAction: async () => action,
    authorizeAction: async () => true,
    executeAction: async (approvedAction, { idempotencyKey }) => ({
      simulated: true,
      operation: approvedAction.operation,
      idempotencyKey,
    }),
  });

  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  const pending = await runtime.request({
    id: "demo-preview-approval",
    gate: "deploy",
    action,
    requestedBy: "fictional-publishing-agent",
    expiresAt,
  });
  console.log(`Saved approval: ${pending.status}`);
  const approved = await runtime.decide({
    id: pending.id,
    credential: "demo-human-session",
    decision: "approve",
  });
  console.log(`Recorded decision: ${approved.status} by ${approved.decision.by}`);
  const result = await runtime.resume({ id: pending.id });
  console.log(`Simulated result: ${JSON.stringify(result.result)}`);
  console.log("No external service was called and no real content was published.");
} finally {
  await rm(directory, { recursive: true, force: true });
}

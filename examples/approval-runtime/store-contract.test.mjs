import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { JsonFileStore, MemoryStore } from "./runtime.mjs";

// One contract, two stores: every behavior below must match in both.
const stores = {
  MemoryStore: async () => ({ store: new MemoryStore(), cleanup: async () => {} }),
  JsonFileStore: async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "approval-store-"));
    return { store: new JsonFileStore(directory), cleanup: () => rm(directory, { recursive: true, force: true }) };
  },
};

const record = (id, status = "pending") => ({
  id,
  status,
  actionDigest: "digest-1",
  expiresAt: "2026-10-25T13:00:00.000Z",
});

for (const [name, open] of Object.entries(stores)) {
  test(`${name}: round-trips a record and lists it`, async () => {
    const { store, cleanup } = await open();
    try {
      assert.equal(await store.get("approval-1"), null);
      await store.create(record("approval-1"));
      assert.deepEqual(await store.get("approval-1"), record("approval-1"));
      assert.deepEqual(await store.list(), [record("approval-1")]);
    } finally {
      await cleanup();
    }
  });

  test(`${name}: create refuses an existing id`, async () => {
    const { store, cleanup } = await open();
    try {
      await store.create(record("approval-1"));
      await assert.rejects(store.create(record("approval-1")), { code: "already_exists" });
    } finally {
      await cleanup();
    }
  });

  test(`${name}: put updates an existing record`, async () => {
    const { store, cleanup } = await open();
    try {
      await store.create(record("approval-1"));
      await store.put(record("approval-1", "approved"));
      assert.equal((await store.get("approval-1")).status, "approved");
    } finally {
      await cleanup();
    }
  });

  test(`${name}: put refuses a missing id with the same code`, async () => {
    const { store, cleanup } = await open();
    try {
      await assert.rejects(store.put(record("approval-missing")), { code: "not_found" });
      assert.equal(await store.get("approval-missing"), null);
    } finally {
      await cleanup();
    }
  });
}

test("JsonFileStore: a filesystem without hard links fails clearly and leaves no temporary file", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "approval-store-"));
  try {
    const noHardLinks = async () => {
      throw Object.assign(new Error("operation not permitted"), { code: "EPERM" });
    };
    const store = new JsonFileStore(directory, { linkFile: noHardLinks });
    await assert.rejects(store.create(record("approval-1")), { code: "store_unsupported" });
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

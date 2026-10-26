import { randomUUID } from "node:crypto";
import { open, mkdir, readFile, readdir, link, rename, unlink } from "node:fs/promises";
import path from "node:path";

const ID = /^[a-zA-Z0-9._-]{1,128}$/;

export class RuntimeError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RuntimeError";
    this.code = code;
  }
}

export function fail(code, message) {
  throw new RuntimeError(code, message);
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function assertId(id) {
  if (typeof id !== "string" || !ID.test(id)) {
    fail("invalid_id", "ID must use 1-128 letters, digits, dot, underscore, or dash");
  }
}

export class MemoryStore {
  #records = new Map();

  async get(id) {
    const record = this.#records.get(id);
    return record ? clone(record) : null;
  }

  async list() {
    return [...this.#records.values()].map(clone);
  }

  async create(record) {
    if (this.#records.has(record.id)) fail("already_exists", `Approval ${record.id} already exists`);
    this.#records.set(record.id, clone(record));
  }

  async put(record) {
    if (!this.#records.has(record.id)) fail("not_found", `Approval ${record.id} does not exist`);
    this.#records.set(record.id, clone(record));
  }
}

/** Local demonstration store. It is not safe for multiple processes or workers. */
export class JsonFileStore {
  #directory;
  #linkFile;

  // linkFile is injectable so tests can simulate filesystems without hard links.
  constructor(directory, { linkFile = link } = {}) {
    this.#directory = path.resolve(directory);
    this.#linkFile = linkFile;
  }

  #file(id) {
    assertId(id);
    return path.join(this.#directory, `${id}.json`);
  }

  async get(id) {
    try {
      return JSON.parse(await readFile(this.#file(id), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async list() {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const names = await readdir(this.#directory);
    const records = [];
    for (const name of names.filter((item) => /^[a-zA-Z0-9._-]{1,128}\.json$/.test(item))) {
      records.push(JSON.parse(await readFile(path.join(this.#directory, name), "utf8")));
    }
    return records;
  }

  async create(record) {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const target = this.#file(record.id);
    const temporary = path.join(this.#directory, `.${record.id}.${randomUUID()}.tmp`);
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(record, null, 2));
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      // link() creates the final name atomically and fails if it already exists;
      // rename() would replace an existing approval on POSIX systems.
      await this.#linkFile(temporary, target);
      await unlink(temporary);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      if (error.code === "EEXIST" || error.code === "ENOTEMPTY") {
        fail("already_exists", `Approval ${record.id} already exists`);
      }
      if (["EPERM", "ENOTSUP", "EOPNOTSUPP"].includes(error.code)) {
        fail("store_unsupported", "The filesystem does not support hard links, which this store needs");
      }
      throw error;
    }
  }

  async put(record) {
    if (!(await this.get(record.id))) fail("not_found", `Approval ${record.id} does not exist`);
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    const target = this.#file(record.id);
    const temporary = path.join(this.#directory, `.${record.id}.${randomUUID()}.tmp`);
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(record, null, 2));
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      await rename(temporary, target);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
  }
}

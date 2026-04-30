import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import kv from "./index.js";

const API_SET = "https://api.keyval.org/set";
const API_GET = "https://api.keyval.org/get";

/** Sample key/value aligned with integration examples (e.g. [api.keyval.org](https://api.keyval.org/set/testkey/testkeypass)). */
const TEST_KEY = "testkey";
const TEST_VALUE = "testkeypass";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("set: POST JSON to /set with key and val, returns parsed body", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, API_SET);
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(
      options.body,
      JSON.stringify({ key: TEST_KEY, val: TEST_VALUE })
    );

    return {
      json: async () => ({
        status: "SUCCESS",
        key: TEST_KEY,
        val: TEST_VALUE
      })
    };
  };

  const out = await kv.set(TEST_KEY, TEST_VALUE);
  assert.deepEqual(out, {
    status: "SUCCESS",
    key: TEST_KEY,
    val: TEST_VALUE
  });
});

test("set: returns ERROR envelope without throwing (caller checks status)", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, API_SET);
    assert.equal(options.method, "POST");
    return {
      json: async () => ({ status: "ERROR", key: "x" })
    };
  };

  const out = await kv.set("x", "y");
  assert.deepEqual(out, { status: "ERROR", key: "x" });
});

test("get: POST JSON to /get with key, returns parsed body", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, API_GET);
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.body, JSON.stringify({ key: TEST_KEY }));

    return {
      json: async () => ({
        status: "SUCCESS",
        key: TEST_KEY,
        val: TEST_VALUE
      })
    };
  };

  const out = await kv.get(TEST_KEY);
  assert.deepEqual(out, {
    status: "SUCCESS",
    key: TEST_KEY,
    val: TEST_VALUE
  });
});

test("get: returns ERROR envelope without throwing", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, API_GET);
    assert.equal(options.method, "POST");
    return {
      json: async () => ({ status: "ERROR", key: "missing" })
    };
  };

  const out = await kv.get("missing");
  assert.deepEqual(out, { status: "ERROR", key: "missing" });
});

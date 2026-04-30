import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliJs = path.join(__dirname, "cli.js");
const fetchStubImport = path.join(__dirname, "test", "fetch-register-stub.mjs");

const TEST_KEY = "testkey";
const TEST_VALUE = "testkeypass";

function runCli(args = [], env = {}) {
  const importStub = pathToFileURL(fetchStubImport).href;

  return spawnSync(
    process.execPath,
    ["--import", importStub, cliJs, ...args],
    {
      encoding: "utf8",
      env: { ...process.env, TEST_KEYVAL_FAIL: "none", ...env },
      windowsHide: true
    }
  );
}

test("CLI prints usage when command is omitted", () => {
  const r = runCli([]);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(r.stdout.includes("Usage"));
  assert.ok(r.stdout.includes("keyval set"));
});

test("CLI set: POSTs testkey/testkeypass, prints success", () => {
  const r = runCli(["set", TEST_KEY, TEST_VALUE]);
  assert.equal(r.status, 0, r.stderr + r.stdout);

  assert.ok(/Success\s+key:\s+testkey/.test(r.stdout));
  assert.ok(/value:\s+testkeypass/.test(r.stdout));
});

test("CLI get: POSTs lookup for testkey, prints testkeypass", () => {
  const r = runCli(["get", TEST_KEY], { TEST_KEYVAL_FAIL: "none" });

  assert.equal(r.status, 0, r.stderr + r.stdout);
  assert.equal(r.stdout.trim(), TEST_VALUE);
});

test("CLI surfaces set failure when API responds with ERROR", () => {
  const r = runCli(["set", TEST_KEY, TEST_VALUE], {
    TEST_KEYVAL_FAIL: "set"
  });

  assert.equal(r.status, 1);
  assert.ok(r.stderr.includes("Error:"));
});

test("CLI surfaces get failure when API responds with ERROR", () => {
  const r = runCli(["get", TEST_KEY], { TEST_KEYVAL_FAIL: "get" });

  assert.equal(r.status, 1);
  assert.ok(r.stderr.includes("Error:"));
});

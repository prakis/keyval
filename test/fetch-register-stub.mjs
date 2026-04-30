/** Preloads a global fetch stub for subprocess tests (CLI). Do not load from library code. */
const API_BASE = "https://api.keyval.org";
const PATH_SET = `${API_BASE}/set`;
const PATH_GET = `${API_BASE}/get`;

const TEST_KEY = "testkey";
const TEST_PASS = "testkeypass";

function shouldFail(endpoint) {
  const fail = process.env.TEST_KEYVAL_FAIL;
  if (!fail || fail === "none") return false;
  if (fail === "all") return true;
  if (fail === "set" && endpoint === "set") return true;
  if (fail === "get" && endpoint === "get") return true;
  return false;
}

globalThis.fetch = async (url, init) => {
  const u = String(url);

  if (u === PATH_SET) {
    if (shouldFail("set")) {
      return { json: async () => ({ status: "ERROR" }) };
    }

    let key = "";
    let val = "";
    try {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      key = body.key ?? "";
      val = body.val ?? "";
    } catch {
      /* ignore */
    }

    return {
      json: async () => ({
        status: "SUCCESS",
        key,
        val
      })
    };
  }

  if (u === PATH_GET) {
    if (shouldFail("get")) {
      return { json: async () => ({ status: "ERROR" }) };
    }

    let key = "";
    try {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      key = body.key ?? "";
    } catch {
      /* ignore */
    }

    let val =
      key === TEST_KEY
        ? TEST_PASS
        : process.env.TEST_KEYVAL_GET_VALUE ?? `stub-${key}`;

    return {
      json: async () => ({
        status: "SUCCESS",
        key,
        val
      })
    };
  }

  return { json: async () => ({ status: "ERROR" }) };
};

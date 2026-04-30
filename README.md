# keyval

A small command-line helper for storing and retrieving key–value pairs through the **[keyval.org](https://www.keyval.org)** API—no global install needed if you use `npx`.

## Requirements

- [Node.js](https://nodejs.org/) (recommended: current LTS or newer)

## CLI usage with `npx`

You can run **`keyval`** without installing it in your project by using **`npx`**:

### Set a value

```bash
npx keyval set <key> <value>
```

Example:

* Suggest to have the key atleast 10 character long

```bash
npx keyval set my-10-plus-char-key "hello world"
```

### Get a value

```bash
npx keyval get <key>
```

Example:

```bash
npx keyval get my-10-plus-char-key
```

The CLI prints a success summary for `set`, and prints the stored value line for `get`. If something goes wrong, you’ll see an error message on stderr and a non-zero exit code.

## If `npx keyval` does not work

Caching, an unpublished local version, or an older npm can sometimes give you stale or unexpected behavior. Pin the registry package explicitly:

```bash
npx keyval@latest set <key> <value>
npx keyval@latest get <key>
```

## Learn more

- Website and service: **[keyval.org](https://www.keyval.org)**

## Module usage

This package exposes `default` `{ set, get }` from `index.js`, so you can also `import kv from 'keyval'` in your own Node projects when you depend on **`keyval`** as an npm dependency.

```
npm install keyval

----

import kv from "keyval";

const s = await kv.set("hello-from-keyval-org", "hello-there");
const v = await kv.get("hello-from-keyval-org");
console.log(v);

OR

async function main() {
  const s = await kv.set("hello-from-keyval-org", "hello-there");
  const v = await kv.get("hello-from-keyval-org");
  console.log(v);
}
main();

```

Please open an ticket for any bugs or updates at https://github.com/prakis/keyval
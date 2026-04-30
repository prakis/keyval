#!/usr/bin/env node

import kv from "./index.js";

const [, , cmd, key, value] = process.argv;
const STATUS_SUCCESS = "SUCCESS";

async function run() {
    try {

        if (cmd === "set") {
            const setResult = await kv.set(key, value);
            if (setResult.status !== STATUS_SUCCESS) {
                throw new Error("Set operation failed");
            } else {
                console.log("Success key:", setResult.key, " value:", setResult.val);
            }
        } else if (cmd === "get") {
            const getResult = await kv.get(key);
            if (getResult.status !== STATUS_SUCCESS) {
                throw new Error("Get operation failed");
            } else {
                console.log(getResult.val);
            }
        } else {
            console.log("Usage:");
            console.log("  keyval set <key> <value>");
            console.log("  keyval get <key>");
        }
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

run();
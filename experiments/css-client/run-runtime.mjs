import assert from "node:assert/strict";
import { copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../../scripts/measure-page-loading.mjs";

const [transport, run] = process.argv.slice(2);
assert.ok(["attribute", "template"].includes(transport) && ["1", "2"].includes(run));
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const directory = join(root, ".artifacts/css-client", transport, "runtime");
await build(join(directory, "project"), join(directory, "astro.config.mjs"));
copyFileSync(join(directory, "server.json"), join(directory, "server-run-" + run + ".json"));
console.log("Saved", transport, "independent server run", run);

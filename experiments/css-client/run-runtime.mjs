import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build, captureLoadingContext } from "../../scripts/measure-page-loading.mjs";

const [transport, run] = process.argv.slice(2);
assert.ok(["attribute", "template"].includes(transport) && ["1", "2"].includes(run));
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const directory = join(root, ".artifacts/css-client", transport, "runtime");
await build(join(directory, "project"), join(directory, "astro.config.mjs"));
const report = JSON.parse(readFileSync(join(directory, "server.json"), "utf8"));
const { environment, source } = captureLoadingContext(pathToFileURL(join(directory, "benchmark.mjs")));
assert.equal(report.environment.node, environment.node, "Server and launcher Node versions must match");
writeFileSync(join(directory, "server-run-" + run + ".json"),
  JSON.stringify({ ...report, environment, source }, null, 2) + "\n");
console.log("Saved", transport, "independent server run", run);

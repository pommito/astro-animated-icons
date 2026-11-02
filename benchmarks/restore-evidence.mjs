import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

const root = new URL("../", import.meta.url);
const archive = new URL("evidence/2026-11-02/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("import-manifest.json", archive), "utf8"));
for (const [path, expected] of Object.entries(manifest.files)) {
  if (!path.startsWith("benchmarks/evidence/")) continue;
  const body = readFileSync(new URL(path, root));
  assert.equal(createHash("sha256").update(body).digest("hex"), expected.sha256, path);
}
for (const name of ["server-run-1.json", "server-run-2.json", "browser-run-1.json", "browser-environment.json", "summary.json"]) {
  const target = new URL(".artifacts/recipe-delivery-runtime/" + name, root);
  mkdirSync(dirname(target.pathname), { recursive: true });
  copyFileSync(new URL("runtime/" + name, archive), target);
}
const target = new URL(".artifacts/page-loading/baseline.json", root);
mkdirSync(dirname(target.pathname), { recursive: true });
copyFileSync(new URL("loading-baseline.json", archive), target);
console.log("Restored archived samples after SHA-256 verification; no builds or new measurements.");

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkModeBudgets } from "./loading-budgets.mjs";

test("restores verified benchmark evidence in a checkout with spaces", t => {
  const workspace = mkdtempSync(join(tmpdir(), "icon-benchmark-"));
  t.after(() => rmSync(workspace, { recursive: true, force: true }));
  const checkout = join(workspace, "checkout with spaces");
  const archive = new URL("../benchmarks/evidence/2026-11-02/", import.meta.url);
  cpSync(archive, join(checkout, "benchmarks/evidence/2026-11-02"), { recursive: true });
  const script = join(checkout, "benchmarks/restore-evidence.mjs");
  copyFileSync(new URL("../benchmarks/restore-evidence.mjs", import.meta.url), script);

  execFileSync(process.execPath, [script]);

  assert.deepEqual(readFileSync(join(checkout, ".artifacts/page-loading/baseline.json")),
    readFileSync(new URL("loading-baseline.json", archive)));
  assert.deepEqual(readFileSync(join(checkout, ".artifacts/recipe-delivery-runtime/server-run-1.json")),
    readFileSync(new URL("runtime/server-run-1.json", archive)));
});

test("warm budgets reject invalid byte counts and JavaScript file counts", () => {
  const { modes: { minimal } } = JSON.parse(readFileSync(new URL(
    "../docs/history/2026-11-02-low-javascript-loading.json", import.meta.url), "utf8"));
  const [first] = minimal.warm;
  for (const { field, value, message } of [
    { field: "javascriptFiles", value: -1, message: /warm JavaScript file budget/ },
    { field: "raw", value: null, message: /warm page raw budget/ },
    { field: "gzip", value: "1", message: /warm page gzip budget/ },
  ]) {
    const row = field === "javascriptFiles"
      ? { ...first, javascriptFiles: value }
      : { ...first, page: { ...first.page, [field]: value } };
    assert.throws(() => checkModeBudgets("minimal", { ...minimal, warm: [row, ...minimal.warm.slice(1)] }), message);
  }
  checkModeBudgets("minimal", minimal);
});

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const check = () => execFileSync(process.execPath, ["scripts/fixture.mjs", "check"], { cwd: root, encoding: "utf8", stdio: "pipe" });

test("consecutive preparations reuse unchanged sources and output", () => {
  const output = execFileSync("pnpm", ["test:prepare"], { cwd: root, encoding: "utf8" });
  assert.match(output, /Reusing fixture: sources and output match/);
  assert.match(check(), /Fixture output matches current sources/);
});

test("adding a fixture input rejects built output until that input is removed", () => {
  const directory = mkdtempSync(new URL("../tests/fixtures/astro/.cache-input-", import.meta.url));
  try {
    writeFileSync(`${directory}/input.txt`, "changed source");
    assert.throws(check, /Fixture output is missing, modified, or stale/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
  assert.match(check(), /Fixture output matches current sources/);
});

test("modified output cannot pass the freshness check", () => {
  const path = new URL("../tests/fixtures/astro/dist/plain/index.html", import.meta.url);
  const original = readFileSync(path);
  try {
    writeFileSync(path, "<html>Changed output</html>");
    assert.throws(check, /Fixture output is missing, modified, or stale/);
  } finally {
    writeFileSync(path, original);
  }
  assert.match(check(), /Fixture output matches current sources/);
});

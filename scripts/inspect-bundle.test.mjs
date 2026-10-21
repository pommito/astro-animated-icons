import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";
import { verifyBundles } from "./inspect-bundle.mjs";

const built = new URL("../tests/fixtures/astro/dist/", import.meta.url);
const directory = mkdtempSync(join(tmpdir(), "animated-icons-bundle-"));
const output = pathToFileURL(directory + "/");

before(() => cpSync(built, directory, { recursive: true }));
after(() => rmSync(directory, { recursive: true, force: true }));

function withFile(path, change, run) {
  const original = readFileSync(path, "utf8");
  try {
    writeFileSync(path, change(original));
    run();
  } finally {
    writeFileSync(path, original);
  }
}

test("the production fixture satisfies every bundle case", () => {
  const messages = [];
  verifyBundles(built, (message) => messages.push(message));
  assert.equal(messages.at(-1), "Selective loading verified: shared CSS only, unused icon behavior excluded.");
});

test("an unused registration reports its route and exact tag", () => {
  const html = readFileSync(new URL("single/index.html", output), "utf8");
  const entry = new URL(html.match(/<script[^>]*src="([^"]+)"/)[1].slice(1), output);
  withFile(entry, source => source + '\ncustomElements.define("grave-check", class extends HTMLElement {});', () => {
    assert.throws(() => verifyBundles(output, () => {}), /single: unused registration grave-check must not load/);
  });
});

test("a missing registration reports the expected icon", () => {
  verifyBundles(output, () => {});
  const html = readFileSync(new URL("check-single/index.html", output), "utf8");
  const entry = new URL(html.match(/<script[^>]*src="([^"]+)"/)[1].slice(1), output);
  withFile(entry, source => source.replaceAll("grave-check", "missing-check"), () => {
    assert.throws(() => verifyBundles(output, () => {}), /check-single: expected registration grave-check is missing/);
  });
});

test("icon-specific CSS cannot become the shared CSS baseline", () => {
  withFile(new URL("single/index.html", output), html => html + "<style>grave-check { color: red }</style>", () => {
    assert.throws(() => verifyBundles(output, () => {}), /single: icon-specific CSS for check must not load/);
  });
});

test("missing shared CSS cannot become the baseline for every icon", () => {
  withFile(new URL("single/index.html", output), html => html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, ""), () => {
    assert.throws(() => verifyBundles(output, () => {}), /single: shared wrapper CSS is missing/);
  });
});

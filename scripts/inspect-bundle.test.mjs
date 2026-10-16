import assert from "node:assert/strict";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { verifyBundles } from "./inspect-bundle.mjs";

const built = new URL("../tests/fixtures/astro/dist/", import.meta.url);

function withOutput(run) {
  const directory = mkdtempSync(join(tmpdir(), "animated-icons-bundle-"));
  const output = pathToFileURL(directory + "/");
  try {
    cpSync(built, directory, { recursive: true });
    run(output);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("the production fixture satisfies every bundle case", () => {
  const messages = [];
  verifyBundles(built, (message) => messages.push(message));
  assert.equal(messages.at(-1), "Selective loading verified: shared CSS only, unused icon behavior excluded.");
});

test("an unused registration reports its route and exact tag", () => {
  withOutput((output) => {
    const html = readFileSync(new URL("single/index.html", output), "utf8");
    const entry = html.match(/<script[^>]*src="([^"]+)"/)[1];
    appendFileSync(new URL(entry.slice(1), output), '\ncustomElements.define("grave-check", class extends HTMLElement {});');
    assert.throws(() => verifyBundles(output, () => {}), /single: unused registration grave-check must not load/);
  });
});

test("a missing registration reports the expected icon", () => {
  withOutput((output) => {
    const html = readFileSync(new URL("check-single/index.html", output), "utf8");
    const entry = new URL(html.match(/<script[^>]*src="([^"]+)"/)[1].slice(1), output);
    writeFileSync(entry, readFileSync(entry, "utf8").replaceAll("grave-check", "missing-check"));
    assert.throws(() => verifyBundles(output, () => {}), /check-single: expected registration grave-check is missing/);
  });
});

test("icon-specific CSS cannot become the shared CSS baseline", () => {
  withOutput((output) => {
    const route = new URL("single/index.html", output);
    writeFileSync(route, readFileSync(route, "utf8") + "<style>grave-check { color: red }</style>");
    assert.throws(() => verifyBundles(output, () => {}), /single: icon-specific CSS for check must not load/);
  });
});

test("missing shared CSS cannot become the baseline for every icon", () => {
  withOutput((output) => {
    const route = new URL("single/index.html", output);
    const html = readFileSync(route, "utf8")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
      .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, "");
    writeFileSync(route, html);
    assert.throws(() => verifyBundles(output, () => {}), /single: shared wrapper CSS is missing/);
  });
});

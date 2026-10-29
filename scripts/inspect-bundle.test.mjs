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
  assert.equal(messages.at(-1), "Selective loading verified: selected generated CSS, unused icon behavior excluded.");
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

test("a production CSS recipe rejects missing, changed, or duplicated generated styles", () => {
  const file = new URL("bell-single/index.html", output);
  for (const change of [
    html => html.replace(/<style[^>]*>@keyframes grave-cycle-bell[\s\S]*?<\/style>/, ""),
    html => html.replace("animation-duration:0.5s", "animation-duration:0.7s"),
    html => html + html.match(/<style[^>]*>@keyframes grave-cycle-bell[\s\S]*?<\/style>/)[0],
  ]) withFile(file, change, () => {
    assert.throws(() => verifyBundles(output, () => {}), /bell-single: selected generated CSS and shared CSS/);
  });
});

test("generated CSS for an unused recipe cannot enter production", () => {
  withFile(new URL("single/index.html", output), html => html + "<style>@keyframes grave-cycle-bell-entry{to{transform:rotate(0deg)}}</style>", () => {
    assert.throws(() => verifyBundles(output, () => {}), /selected generated CSS and shared CSS/);
  });
});

test("combined-transform records reject changed independent offsets", () => {
  withFile(new URL("key-circle-single/index.html", output), html => {
    const changed = html.replace("[0,0.25,0.5,0.75,1]", "[0,0.2,0.5,0.75,1]");
    assert.notEqual(changed, html);
    return changed;
  }, () => assert.throws(() => verifyBundles(output, () => {}), /key-circle-single: serialized recipe matches key-circle/));
});

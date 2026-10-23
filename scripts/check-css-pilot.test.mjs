import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { verifyCssPilot } from "./check-css-pilot.mjs";

const directory = mkdtempSync(join(tmpdir(), "css-parity-"));
const output = pathToFileURL(directory + "/");
cpSync(new URL("../tests/fixtures/astro/dist/", import.meta.url), directory, { recursive: true });
after(() => rmSync(directory, { recursive: true, force: true }));

function change(path, transform, run) {
  const file = new URL(path, output);
  const original = readFileSync(file, "utf8");
  try { writeFileSync(file, transform(original)); run(); }
  finally { writeFileSync(file, original); }
}

test("CSS parity routes satisfy their loading and drawing contract", () => verifyCssPilot(output, () => {}));
test("CSS route rejects an unexpected inline script", () => change("css-pilot/managed/bell/index.html",
  html => html + '<script>console.log("unexpected");</script>',
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/bell: no inline scripts/),
));
test("unused icon keyframes cannot accumulate through the pilot barrel", () => change("css-pilot/managed/bell/index.html",
  html => html + '<style>@keyframes grave-cycle-chevron-right-entry {to {opacity:0}}</style>',
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/bell: only rendered icon CSS, chevron-right/),
));
test("CSS pilot rejects a changed drawing", () => change("css-pilot/managed/bell/index.html",
  html => html.replace("M6 8a6", "M7 8a6"),
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/bell: initial SVG matches/),
));
test("LoaderCircle rejects experimental CSS", () => change("css-pilot/managed/loader/index.html",
  html => html + '<style>@keyframes grave-cycle-loader-entry {to {opacity:0}}</style>',
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/loader: only rendered icon CSS, loader/),
));

test("generated CSS timing cannot drift from the shared recipe", () => change("css-pilot/managed/bell/index.html",
  html => html.replace("animation-duration:0.5s", "animation-duration:0.7s"),
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/bell: CSS matches the shared recipe, bell/),
));

test("server CSS markers cannot disappear and cause duplicate client sheets", () => change("css-pilot/managed/bell/index.html",
  html => html.replace('data-grave-cycle-style="bell"', ""),
  () => assert.throws(() => verifyCssPilot(output, () => {}), /managed\/bell: active sheet marker for bell/),
));

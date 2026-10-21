import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDrawing } from "./check-drawings.mjs";

const icon = { slug: "example", tag: "grave-example" };
const drawing = [{ tag: "path", attrs: { d: "M0 0h1" } }];
const standalone = `<grave-example id="standalone"><svg aria-label="Example" role="img" /></grave-example>`;
const html = `<a id="primary" href="#destination"><grave-example data-grave-icon="true"><svg aria-hidden="true" viewBox="0 0 24 24" stroke-width="2"><g><path d="M0 0h1" /></g></svg></grave-example></a>${standalone}<p id="destination"></p>`;

test("the drawing contract accepts rendered geometry and native controls", () => {
  checkDrawing(html, icon, drawing);
});

test("the drawing contract rejects a missing shape and changed coordinates", () => {
  assert.throws(() => checkDrawing(html.replace('<path d="M0 0h1" />', ""), icon, drawing), /shape count/);
  assert.throws(() => checkDrawing(html.replace('d="M0 0h1"', 'd="M0 0h2"'), icon, drawing), /shape 0 d/);
});

test("the drawing contract rejects broken wiring and a missing native destination", () => {
  assert.throws(() => checkDrawing(html.replaceAll("grave-example", "grave-wrong"), icon, drawing), /rendered tag/);
  assert.throws(() => checkDrawing(html.replace('href="#destination"', 'href="#missing"'), icon, drawing), /native destination/);
  assert.throws(() => checkDrawing(html.replace('aria-label="Example"', ""), icon, drawing), /labeled standalone/);
});

test("the labeled standalone icon cannot be hidden from assistive technology", () => {
  assert.throws(() => checkDrawing(html.replace('aria-label="Example"', 'aria-hidden="true" aria-label="Example"'), icon, drawing), /standalone.*accessible/);
  assert.throws(() => checkDrawing(html.replace('id="standalone"', 'id="standalone" aria-hidden="true"'), icon, drawing), /standalone.*accessible/);
});

test("an unrelated labeled SVG cannot satisfy the standalone icon check", () => {
  const unrelated = standalone.replaceAll("grave-example", "grave-other");
  assert.throws(() => checkDrawing(html.replace(standalone, unrelated), icon, drawing), /standalone tag/);
  assert.throws(() => checkDrawing(html.replace('id="standalone"', 'id="other"'), icon, drawing), /standalone tag/);
});

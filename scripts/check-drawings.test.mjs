import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDrawing } from "./check-drawings.mjs";

const icon = { slug: "example", tag: "grave-example" };
const drawing = [{ tag: "path", attrs: { d: "M0 0h1" } }];
const html = `<a id="primary" href="#destination"><grave-example data-grave-icon="true"><svg aria-hidden="true" viewBox="0 0 24 24" stroke-width="2"><g><path d="M0 0h1" /></g></svg></grave-example></a><grave-example><svg aria-label="Example" role="img" /></grave-example><p id="destination"></p>`;

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

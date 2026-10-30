import assert from "node:assert/strict";
import { test } from "node:test";
import plans from "../tests/helpers/path-paint-proof-plans.json" with { type: "json" };
import { paintCSS, measureTargets, validateProofScope } from "../tests/fixtures/astro/src/path-paint-proof/compiler.mjs";
import scope from "../tests/helpers/path-paint-scope.json" with { type: "json" };

test("the paint compiler keeps EyeOff's two-length dash and signed offset", () => {
  const css = paintCSS(plans["eye-off"]);
  assert.match(css, /stroke-dasharray:calc\(var\(--pp-length\) \* 2\) calc\(var\(--pp-length\) \* 1\)/);
  assert.match(css, /stroke-dashoffset:calc\(var\(--pp-length\) \* -2\)/);
  assert.doesNotMatch(css, /pathLength|@property/);
});

test("the proof keeps all 89 scoped candidates explicit without certifying WindArrowDown", () => {
  const slugs=scope.map(icon=>icon.slug);
  const retained={"wind-arrow-down":"Retained y/opacity sampling needs a separately proved composition adapter; #103 Phase 2."};
  assert.equal(validateProofScope(plans,slugs,retained),89);
  assert.throws(()=>validateProofScope(plans,slugs,{}),/wind-arrow-down/);
  assert.throws(()=>validateProofScope({...plans,unexpected:plans.wind},slugs,retained),/unexpected/);
  assert.throws(()=>validateProofScope(plans,slugs,{...retained,wind:"duplicate"}),/wind/);
});

test("geometry is read once per affected target per playback, never for opacity-only paths", () => {
  const calls=[0,0,0];
  const target = index => ({ getTotalLength() { calls[index]++; return 20; } });
  const drawing = { children: [target(0), target(1), target(2)] };
  assert.deepEqual([...measureTargets(plans["bluetooth-connected"], drawing)], [[2,20],[3,20]]);
  assert.deepEqual(calls,[0,1,1]);
  assert.deepEqual([...measureTargets(plans["message-circle-dashed"], { children: [] })], []);
  assert.throws(() => measureTargets(plans["eye-off"], { children: [] }), /not SVG geometry/);
  assert.throws(() => measureTargets(plans["circle-check"], { children: [{ getTotalLength: () => 0 }, { getTotalLength: () => 0 }] }), /positive measured length/);
});

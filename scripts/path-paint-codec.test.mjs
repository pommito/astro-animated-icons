import assert from "node:assert/strict";
import { test } from "node:test";
import plans from "../tests/helpers/path-paint-proof-plans.json" with { type: "json" };
import { encodePaint, decodePaint } from "../tests/fixtures/astro/src/path-paint-proof/codec.mjs";

test("the wire representation keeps PhoneOff's linear entry and timed return", () => {
  assert.deepEqual(encodePaint(plans["phone-off"]),["phone-off",0,0,[[2,1,400,0,2,[0,1]]],[[2,1,300,0,3,[null,1]]]]);
  assert.deepEqual(decodePaint(["phone-off",0,0,[[2,1,400,0,2,[0,1]]],[[2,1,300,0,3,[null,1]]]]),plans["phone-off"]);
});

test("the wire encoder refuses a non-unit gap instead of changing its stroke", () => {
  const plan=structuredClone(plans["phone-off"]);
  plan.entry[0].values[0]=[0,2];
  assert.throws(()=>encodePaint(plan),/unit measured gap/);
});

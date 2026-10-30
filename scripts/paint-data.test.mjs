import assert from "node:assert/strict";
import { test } from "node:test";
import { paintRecipes,encodePaint,decodePaint } from "./css-paint.mjs";

test("production PhoneOff wire data keeps its source timing and measured gap", () => {
  const expected=["phone-off",0,0,[[2,1,400,0,2,[0,1]]],[[2,1,300,0,3,[null,1]]]];
  assert.deepEqual(encodePaint(paintRecipes.get("phone-off")),expected);
  assert.deepEqual(decodePaint(expected),paintRecipes.get("phone-off"));
  const changed=structuredClone(paintRecipes.get("phone-off"));changed.entry[0].values[0]=[0,2];
  assert.throws(()=>encodePaint(changed),/unit measured gap/);
});

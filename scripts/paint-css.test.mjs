import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";
const source = readFileSync(new URL("../packages/animated-icons/src/shared/paint-css.ts",import.meta.url),"utf8");
const { paintCSS, measurePaintTargets } = await evaluateTypeScriptData(source.replace(/^import .*;\n/gm,""));

test("measured CSS preserves two-length signed paint and accepts zero geometry", () => {
  const channel={target:1,property:"strokeDashoffset",values:[[0],[-2]],offsets:[0,1],intervalEase:["linear","linear"],duration:600,delay:0,ease:"ease-out"};
  const plan={id:"eye-off",finish:"hold",replay:"restart",entry:[channel],returning:[]};
  assert.match(paintCSS(plan),/stroke-dashoffset:calc\(var\(--grave-paint-length\) \* -2\)/);
  assert.deepEqual([...measurePaintTargets(plan,{children:[{getTotalLength:()=>0}]})],[[1,0]]);
  assert.throws(()=>measurePaintTargets(plan,{children:[{}]}),/SVG geometry/);
});

test("opacity-only return does not measure entry-only strokes", () => {
  const channel={target:1,property:"strokeDasharray",values:[[0,1],[1,1]],offsets:[0,1],intervalEase:["linear","linear"],duration:200,delay:300,ease:"ease-out"};
  const plan={id:"user-round-plus",finish:"hold",replay:"restart",entry:[channel],returning:[{...channel,property:"opacity",values:[null,1]}]};
  assert.deepEqual([...measurePaintTargets(plan,{children:[{getTotalLength(){throw Error("return must not read geometry");}}]},true)],[]);
});

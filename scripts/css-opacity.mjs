import { readFileSync } from "node:fs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";
const source = new URL("../packages/animated-icons/src/", import.meta.url);
const shared = path => readFileSync(new URL("shared/" + path, source), "utf8");
const { opacityCSS, ensureOpacityCSS } = await evaluateTypeScriptData(shared("cycle-css.ts") + shared("opacity-parts.ts") + shared("opacity-css.ts").replace(/^import .*;\n/gm, ""));
export { ensureOpacityCSS };
export const opacityParts = new Map();
export const generatedOpacityCSS = new Map();
for (const id of ["calendar-days", "circle-dashed"]) {
  const data = await evaluateTypeScriptData(readFileSync(new URL("icons/" + id + "/parts.ts", source), "utf8"));
  const parts = Object.values(data)[0];
  opacityParts.set(id, parts);
  generatedOpacityCSS.set(id, opacityCSS(id, parts));
}

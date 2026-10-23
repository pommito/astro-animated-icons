import { existsSync, readFileSync } from "node:fs";
import { readCatalog } from "./catalog.mjs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";

const source = new URL("../packages/animated-icons/src/", import.meta.url);
const { cycleCSS } = await evaluateTypeScriptData(readFileSync(new URL("shared/cycle-css.ts", source), "utf8"));
export const cycles = new Map();
for (const icon of readCatalog()) {
  const path = new URL(`icons/${icon.slug}/cycle.ts`, source);
  if (!existsSync(path)) continue;
  const data = await evaluateTypeScriptData(readFileSync(path, "utf8"));
  for (const cycle of Object.values(data)) {
    if (cycle.id === icon.slug) cycles.set(cycle.id, cycle);
  }
}
export const generatedCSS = new Map([...cycles].map(([id, cycle]) => [id, cycleCSS(cycle)]));

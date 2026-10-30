import { existsSync, readFileSync } from "node:fs";
import { readCatalog } from "./catalog.mjs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";
const source=new URL("../packages/animated-icons/src/",import.meta.url);
const shared=name=>readFileSync(new URL("shared/"+name,source),"utf8");
export const {paintCSS}=await evaluateTypeScriptData(shared("paint-css.ts").replace(/^import .*;\n/gm,""));
export const {encodePaint,decodePaint}=await evaluateTypeScriptData(shared("paint-data.ts"));
export const paintRecipes=new Map();
for(const {slug}of readCatalog()) {
  const file=new URL("icons/"+slug+"/paint.ts",source);
  if(!existsSync(file))continue;
  const data=await evaluateTypeScriptData(readFileSync(file,"utf8"));
  paintRecipes.set(slug,Object.values(data)[0]);
}
export const generatedPaintCSS=new Map([...paintRecipes].map(([id,paint])=>[id,paintCSS(paint)]));

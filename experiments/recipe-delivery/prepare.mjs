import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
const experiment = dirname(fileURLToPath(import.meta.url));
const root = resolve(experiment, "../..");
const { clientRecipes } = await import(pathToFileURL(join(root, "scripts/registration-contract.mjs")));
const generated = join(root, ".artifacts/recipe-delivery/generated");
mkdirSync(generated, { recursive: true });
const imports = [];
const rows = [];
const records = {};
let index = 0;
for (const [id, { data, attribute }] of clientRecipes) {
  const json = JSON.stringify(data);
  const filename = process.argv.includes("--long-urls") ? `r-${createHash("sha256").update(json).digest("hex").slice(0, 12)}.json` : `${id}/r.json`;
  mkdirSync(dirname(join(generated, filename)), { recursive: true });
  writeFileSync(join(generated, filename), json);
  imports.push(`import r${index} from ${JSON.stringify("./" + filename + "?url&no-inline")};`);
  rows.push(`${JSON.stringify("grave-" + id)}:r${index}`);
  records[id] = { file: filename, attribute, sha256: createHash("sha256").update(json).digest("hex"), data };
  index++;
}
writeFileSync(join(generated, "assets.ts"), imports.join("\n") + "\nexport const assets: Record<string,string> = {" + rows.join(",") + "};\n");
writeFileSync(join(generated, "records.json"), JSON.stringify(records, null, 2) + "\n");
for (const [name, module, factory, generic] of [
  ["cycle", "css-cycle", "createCSSCycleRecipe", "TransformCycle"],
  ["opacity", "css-opacity", "createCSSOpacityRecipe", "{ id: string; parts: OpacityPart[] }"],
  ["paint", "css-paint", "createCSSPaintRecipe", "PaintWire"],
]) {
  const type = name === "cycle" ? 'import type { TransformCycle } from "../../packages/animated-icons/src/shared/finite-transform-cycle";'
    : name === "opacity" ? 'import type { OpacityPart } from "../../packages/animated-icons/src/shared/opacity-parts";'
      : 'import { decodePaint, type PaintWire } from "../../packages/animated-icons/src/shared/paint-data";';
  const create = name === "opacity" ? "data => createCSSOpacityRecipe(data.id, data.parts)" : name === "paint" ? "data => createCSSPaintRecipe(decodePaint(data))" : factory;
  writeFileSync(join(experiment, `register-${name}.ts`), `import { ${factory} } from "../../packages/animated-icons/src/shared/${module}";\n${type}\nimport { registerDeliveryProof } from "./register";\nregisterDeliveryProof<${generic}>("data-grave-${name}-recipe", ${create});\n`);
}
for (const [wrapper, kind, variable] of [["CssIcon", "cycle", "cycle"], ["CssOpacityIcon", "opacity", "{ id, parts }"], ["CssPaintIcon", "paint", "encodePaint(paint)"]]) {
  let source = readFileSync(join(root, "packages/animated-icons/src/" + wrapper + ".astro"), "utf8");
  source = source.replaceAll('from "./Icon.astro"', 'from "../../packages/animated-icons/src/Icon.astro"')
    .replaceAll('from "./shared/', 'from "../../packages/animated-icons/src/shared/')
    .replace('interface Props', 'import { assets } from "../../.artifacts/recipe-delivery/generated/assets";\ninterface Props')
    .replace(`data-grave-${kind}-recipe={serializeRecipe(${variable})}`, `data-grave-${kind}-recipe={include ? serializeRecipe(${variable}) : undefined} data-grave-${kind}-src={include ? undefined : assets[tag]}`)
    .replace(`"./shared/register-css-${kind}"`, `"./register-${kind}"`);
  writeFileSync(join(experiment, wrapper + ".astro"), source);
}
console.log(`Prepared ${clientRecipes.size} generated recovery assets and three isolated wrappers.`);

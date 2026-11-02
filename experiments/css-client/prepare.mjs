import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const experiment = dirname(fileURLToPath(import.meta.url));
const root = resolve(experiment, "../..");
const src = join(root, "packages/animated-icons/src");
const quote = JSON.stringify;

export function prepareProof(transport) {
  assert.ok(["attribute", "template"].includes(transport));
  const generated = join(root, ".artifacts/css-client", transport, "generated");
  mkdirSync(generated, { recursive: true });
  const sourceImports = source => source.replace(/(from\s*")(\.[^"]+)(")/g, (_, before, specifier, after) => before + resolve(src, "shared", specifier) + after);
  const opacity = readFileSync(join(src, "shared/css-opacity.ts"), "utf8")
    .replace('import { ensureOpacityCSS } from "./opacity-css";\n', "")
    .replace('parts: OpacityPart[]): IconRecipe', 'parts: OpacityPart[], ensure: (document: Document) => void): IconRecipe')
    .replaceAll('ensureOpacityCSS(id, parts, host.ownerDocument)', 'ensure(host.ownerDocument)');
  writeFileSync(join(generated, "opacity.ts"), sourceImports(opacity));
  let paint = readFileSync(join(src, "shared/css-paint.ts"), "utf8")
    .replace('import { ensureRecipeCSS } from "./recipe-css";\n', "")
    .replace('{ paintCSS, measurePaintTargets, trackName, cssProperty } from "./paint-css"', '{ measurePaintTargets, trackName, cssProperty } from "./paint-runtime"')
    .replace('plan: PaintRecipe): IconRecipe', 'plan: PaintRecipe, ensure: (document: Document) => void): IconRecipe')
    .replace('  const ensure = (document: Document) => ensureRecipeCSS(plan.id, document, () => paintCSS(plan));\n', "");
  paint = sourceImports(paint).replace(quote(join(src, "shared/paint-runtime")), '"./paint-runtime"');
  writeFileSync(join(generated, "paint.ts"), paint);
  let paintSupport = readFileSync(join(src, "shared/paint-css.ts"), "utf8");
  paintSupport = paintSupport.slice(0, paintSupport.indexOf("export function paintCSS")) + paintSupport.slice(paintSupport.indexOf("export function measurePaintTargets"));
  writeFileSync(join(generated, "paint-runtime.ts"), sourceImports(paintSupport));
  const sampling = readFileSync(join(src, "shared/combined-transform-cycle.ts"), "utf8");
  const duration = sampling.slice(sampling.indexOf("export function combinedDuration"), sampling.indexOf("function sampledEase"));
  const pose = sampling.slice(sampling.indexOf("export function combinedPose"), sampling.indexOf("export function combinedTransform"));
  writeFileSync(join(generated, "combined-sampling.ts"), `import type { CombinedTransformCycle as OriginalCycle } from ${quote(join(src, "shared/combined-transform-cycle"))};\nexport type CombinedTransformCycle = OriginalCycle & { basis: { base: number[][]; weights: number[][] }[] };\n${duration}\n${pose}\nexport function combinedFrames(cycle: CombinedTransformCycle, returning: boolean, from = cycle.tracks.map(track => track.rest)) { const { base, weights } = cycle.basis[Number(returning)]; return base.map((frame, index) => frame.map((value, channel) => value + weights[index][channel] * (from[channel] - cycle.tracks[channel].rest))); }\n`);
  const combined = readFileSync(join(src, "shared/css-combined-cycle.ts"), "utf8")
    .replace('from "./combined-transform-cycle"', 'from "./combined-sampling"')
    .replace('import { ensureCombinedCycleCSS } from "./combined-cycle-css";\n', "")
    .replace('cycle: CombinedTransformCycle)', 'cycle: CombinedTransformCycle, ensure: (document: Document) => void)')
    .replace('document => ensureCombinedCycleCSS(cycle, document)', 'ensure');
  writeFileSync(join(generated, "combined.ts"), sourceImports(combined).replace(quote(join(src, "shared/combined-sampling")), '"./combined-sampling"'));
  for (const name of ["combined", "opacity", "paint"]) {
    const factoryName = name === "combined" ? "createCSSCombinedCycleRecipe" : name === "opacity" ? "createCSSOpacityRecipe" : "createCSSPaintRecipe";
    const factory = name === "combined" ? factoryName + "({ ...record.data, basis: record.basis! }, ensure)" : name === "opacity" ? factoryName + "(record.data.id, record.data.parts, ensure)" : factoryName + "(record.data, ensure)";
    writeFileSync(join(generated, `runtime-${name}.ts`), `import { ${factoryName} } from "./${name}";\nimport { ensurePrepared, type PreparedRecord } from ${quote(join(experiment, "recovery"))};\n\nexport function create(record: PreparedRecord) { const ensure = (document: Document) => ensurePrepared(record, document); return ${factory}; }\n`);
  }
  let icon = readFileSync(join(src, "Icon.astro"), "utf8").replace('import "./icon.css"', 'import ' + quote(join(src, "icon.css")));
  if (transport === "template") icon = icon.replace("</Tag>", '  <slot name="recovery" />\n</Tag>');
  writeFileSync(join(generated, "Icon.astro"), icon);
  const read = transport === "attribute"
    ? 'return JSON.parse(host.getAttribute(attribute)!);'
    : 'const data = JSON.parse(host.getAttribute(attribute)!); const template = host.querySelector<HTMLTemplateElement>("template[data-css-recovery]")!; const basis = JSON.parse(template.getAttribute("data-basis")!); return { data, css: template.content.querySelector("style")!.textContent!, ...(basis ? { basis } : {}) };';
  writeFileSync(join(generated, "read.ts"), `export function readPrepared(host: HTMLElement, attribute: string) { ${read} }\n`);
  const discovery = readFileSync(join(src, "shared/register-css.ts"), "utf8")
    .replace('from "../element"', 'from ' + quote(join(src, "element")))
    .replace('registerCSSRecipes<T>', 'registerCSSRecipes')
    .replace('(data: T)', '(data: PreparedRecord)')
    .replace('JSON.parse(host.getAttribute(attribute)!)', 'readPrepared(host, attribute)');
  writeFileSync(join(generated, "register.ts"), 'import type { PreparedRecord } from ' + quote(join(experiment, "recovery")) + ';\nimport { readPrepared } from "./read";\n' + discovery);
  for (const [kind, factory] of [["cycle", "simple"], ["combined", "combined"], ["opacity", "opacity"], ["paint", "paint"]]) {
    const runtime = factory === "simple" ? join(experiment, "runtime-simple") : "./runtime-" + factory;
    writeFileSync(join(generated, `register-${kind}.ts`), `import { create } from ${quote(runtime)};\nimport { registerCSSRecipes } from "./register";\nregisterCSSRecipes("data-grave-${kind}-recipe", create);\n`);
    writeFileSync(join(generated, `Registration-${kind}.astro`), `<script>import "./register-${kind}";</script>\n`);
  }
  for (const [wrapper, param, type, wire, kind] of [
    ["CssIcon", "cycle", "TransformCycle", "cycle", '"tracks" in cycle ? "combined" : "cycle"'],
    ["CssOpacityIcon", "parts", "OpacityPart[]", "{ id: tag.slice(6), parts }", '"opacity"'],
    ["CssPaintIcon", "paint", "PaintRecipe", "encodePaint(paint)", '"paint"'],
  ]) {
    const imports = wrapper === "CssIcon" ? `import type { TransformCycle } from ${quote(join(src, "shared/finite-transform-cycle"))};`
      : wrapper === "CssOpacityIcon" ? `import type { OpacityPart } from ${quote(join(src, "shared/opacity-parts"))};`
        : `import type { PaintRecipe } from ${quote(join(src, "shared/paint-recipe"))};\nimport { encodePaint } from ${quote(join(src, "shared/paint-data"))};`;
    const registrationSelection = wrapper === "CssIcon" ? 'const Registration = kind === "combined" ? Combined : Simple;'
      : `const Registration = ${wrapper === "CssOpacityIcon" ? "Opacity" : "Paint"};`;
    const selected = wrapper === "CssIcon" ? 'import Simple from "./Registration-cycle.astro";\nimport Combined from "./Registration-combined.astro";'
      : `import ${wrapper === "CssOpacityIcon" ? "Opacity" : "Paint"} from "./Registration-${wrapper === "CssOpacityIcon" ? "opacity" : "paint"}.astro";`;
    const record = transport === "attribute" ? "record" : "record.data";
    const recovery = transport === "template" ? '<template slot="recovery" data-css-recovery data-basis={serializeRecipe(record.basis ?? null)}><style is:inline set:html={record.css} /></template>' : "";
    const source = `---\nimport Icon from "./Icon.astro";\nimport type { IconProps } from ${quote(join(src, "Icon.astro"))};\n${imports}\n${selected}\nimport { prepareRecipe } from ${quote(join(experiment, "prepared"))};\nimport { serializeRecipe } from ${quote(join(src, "shared/recipe-data"))};\ninterface Props extends IconProps { ${param}: ${type}; tag: \`grave-\${string}\`; svgStyle?: string; }\nconst { ${param}, tag, ...props } = Astro.props;\nconst kind = ${kind};\nconst record = prepareRecipe(kind, ${wire}, Astro.locals);\nconst id = Array.isArray(record.data) ? record.data[0] : record.data.id;\nconst locals = Astro.locals as { cssClientSheets?: Set<string> };\nconst seen = locals.cssClientSheets ??= new Set<string>();\nconst include = !seen.has(id); seen.add(id);\n${registrationSelection}\n---\n{include && <style is:inline data-grave-cycle-style={id} set:html={record.css} />}\n<Icon {...props} tag={tag} {...{ ["data-css-" + (kind === "combined" ? "cycle" : kind)]: id, ["data-grave-" + kind + "-recipe"]: serializeRecipe(${record}) }}><slot />${recovery}</Icon>\n<Registration />\n`;
    writeFileSync(join(generated, wrapper + ".astro"), source);
  }
  return generated;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const variant of ["attribute", "template"]) console.log("Prepared", variant, prepareProof(variant));
}

import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "../../scripts/measure-page-loading.mjs";
import { prepareProof } from "./prepare.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export async function buildProof(project, transport, output) {
  const generated = prepareProof(transport);
  const metadata = join(dirname(output), transport + "-modules.json");
  const config = join(dirname(output), transport + ".config.mjs");
  const replacements = ["CssIcon", "CssOpacityIcon", "CssPaintIcon"].map(name => [join(root, "packages/animated-icons/src", name + ".astro"), join(generated, name + ".astro")]);
  for (const [source, kind] of [["cycle", "cycle"], ["combined-cycle", "combined"], ["opacity", "opacity"], ["paint", "paint"]]) {
    replacements.push([join(root, "packages/animated-icons/src/shared/register-css-" + source + ".ts"), join(generated, "register-" + kind + ".ts")]);
  }
  writeFileSync(config, `import { captureClientModules } from ${JSON.stringify(pathToFileURL(join(root, "scripts/measure-page-loading.mjs")).href)};
import { resolve, dirname } from "node:path";
const replacements = new Map(${JSON.stringify(replacements)});
const override = { name: "css-client-proof", enforce: "pre", resolveId(id, importer) {
  if (!importer || importer.startsWith(${JSON.stringify(generated + "/")})) return;
  const path = id.startsWith(".") ? resolve(dirname(importer.split("?")[0]), id) : id;
  return replacements.get(path) ?? replacements.get(path + ".ts");
} };
export default { root: ${JSON.stringify(project)}, outDir: ${JSON.stringify(output)}, cacheDir: ${JSON.stringify(join(dirname(output), transport + "-cache"))}, vite: { plugins: [override, captureClientModules(${JSON.stringify(metadata)})] } };`);
  await build(project, config);
  return metadata;
}

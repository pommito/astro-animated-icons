import { readFileSync, writeFileSync } from "node:fs";
const inventory = JSON.parse(readFileSync(".artifacts/animation-inventory.json", "utf8"));
const scope = inventory.icons.filter(icon => icon.classification.capability === "runtime-path-paint");
const paths = [...new Set(scope.flatMap(icon => icon.sources))].sort();
const snapshot = {
  revision: "ab10cd2db4a54380934bdd49b0605a1a39ae9424",
  scope: scope.map(icon => ({ name: icon.name, slug: icon.slug, family: icon.classification.family,
    contract: icon.classification.contract, sourceHash: icon.classification.sourceHash, runtimeSources: icon.runtimeSources })),
  sources: Object.fromEntries(paths.map(path => [path, readFileSync(path, "utf8")])),
};
writeFileSync("docs/history/2026-10-30-path-paint-source-before.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Saved ${scope.length} contracts and ${paths.length} source files before extraction.`);

import { writeFileSync } from "node:fs";
import { arch, platform, release, cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { measureRoute } from "./measure-resources.mjs";
import { migration } from "./check-css-migration.mjs";

export function measureMigration(mode) {
  const cache = new Map();
  return Object.fromEntries(Object.keys(migration.cases).map(name => [name,
    measureRoute(`css-migration/${mode}/${name}/index.html`, { cache, includePage: true }),
  ]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = Object.fromEntries(["baseline", "managed"].map(mode => [mode, measureMigration(mode)]));
  const savings = Object.fromEntries(Object.keys(migration.cases).map(name => [name, Object.fromEntries(["total", "page"].map(field => [field, { raw: modes.baseline[name][field].raw - modes.managed[name][field].raw, gzip: modes.baseline[name][field].gzip - modes.managed[name][field].gzip }]))]));
  const result = { environment: { node: process.version, platform: platform(), release: release(), arch: arch(), cpu: cpus()[0]?.model }, compression: "Node zlib defaults per resource. Reachable static/dynamic JS chunks and external CSS URLs count once per route, cold cache. total sums JS and CSS with each inline style compressed independently as a normalized estimate. page compresses actual HTML once, including all inline styles/scripts, plus each external JS/CSS resource once. No headers, latency, Brotli, warm cache, frame pacing, or preparation timing.", modes, savings };
  const json = JSON.stringify(result, null, 2) + "\n";
  if (process.env.MIGRATION_RESULT) writeFileSync(process.env.MIGRATION_RESULT, json);
  console.log(json);
}

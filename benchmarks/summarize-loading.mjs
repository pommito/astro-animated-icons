import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2] ?? ".artifacts/page-loading/baseline.json";
const report = JSON.parse(readFileSync(file, "utf8"));
const names = ["unused", "one", "cog", "paint-eye-off", "key-square", "four", "ten", "repeated", "all", "repeated-all", "loader", "all-loader", "path-paint-repeated"];
function category(module) {
  if (/\/element\.ts$/.test(module.id)) return "lifecycle";
  if (/\/register-css\.ts$/.test(module.id)) return "discovery";
  if (/\/recipe-css\.ts$/.test(module.id)) return "stylesheet-recovery";
  if (/\/(?:cycle-css|opacity-css|paint-css|combined-transform-css)\.ts$/.test(module.id)) return "stylesheet-compiler";
  if (/\/combined-transform-cycle\.ts$/.test(module.id)) return "combined-sampling";
  if (/node_modules\/(?:motion|motion-dom|motion-utils|framer-motion)\//.test(module.id)) return "motion";
  return module.role;
}
const modes = Object.fromEntries(Object.entries(report.modes).map(([mode, data]) => [mode, Object.fromEntries(names.map(name => {
  const route = data.routes[name];
  const modules = route.chunks.flatMap(url => data.resources[url].modules);
  const roles = {};
  for (const module of modules) {
    const role = category(module);
    roles[role] ??= { renderedLength: 0, modules: [] };
    roles[role].renderedLength += module.renderedLength;
    roles[role].modules.push(module.id);
  }
  return [name, { javascript: route.javascript, page: route.page, graph: route.graph, roles }];
}))]));
writeFileSync(".artifacts/page-loading/attribution.json", JSON.stringify({ environment: report.environment, source: report.source,
  assumption: "Module renderedLength is before final minification. It cannot allocate final raw/gzip bytes additively.", modes }, null, 2) + "\n");
console.table(Object.entries(modes.minimal).map(([name, route]) => ({ name, raw: route.javascript.raw, gzip: route.javascript.gzip,
  lifecycle: route.roles.lifecycle?.renderedLength ?? 0, discovery: route.roles.discovery?.renderedLength ?? 0,
  compiler: route.roles["stylesheet-compiler"]?.renderedLength ?? 0, recovery: route.roles["stylesheet-recovery"]?.renderedLength ?? 0,
  sampling: route.roles["combined-sampling"]?.renderedLength ?? 0, adapter: route.roles["css-adapter"]?.renderedLength ?? 0,
  motion: route.roles.motion?.renderedLength ?? 0 })));
console.log("Saved .artifacts/page-loading/attribution.json");

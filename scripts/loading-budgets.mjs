import assert from "node:assert/strict";
import budgets from "../benchmarks/javascript-budgets.json" with { type: "json" };
import manifest from "../benchmarks/loading-cases.json" with { type: "json" };

const cssIcons = new Set(manifest.cssIcons);
const motion = /(?:^|\/)node_modules\/(?:motion|motion-dom|motion-utils|framer-motion)\//;

export function checkModeBudgets(mode, data, { proposed = false } = {}) {
  const ceilings = budgets.modes[mode];
  assert.ok(ceilings, "Unknown consumer: " + mode);
  assert.deepEqual(Object.keys(data.routes).sort(), Object.keys(ceilings).sort(), mode + ": frozen route coverage");
  for (const [name, route] of Object.entries(data.routes)) {
    assert.deepEqual(route.graph?.eventual.javascript, route.javascript, name + ": eventual JavaScript must include every deferred dependency");
    const modules = route.chunks.flatMap(url => {
      assert.ok(data.resources[url]?.modules, name + ": missing module evidence for " + url);
      return data.resources[url].modules;
    });
    if (manifest.cases[name].every(slug => cssIcons.has(slug))) {
      assert.ok(!modules.some(module => motion.test(module.id)), name + ": CSS-only graph reaches Motion");
    }
    for (const metric of ["javascript", "page"]) {
      for (const encoding of ["raw", "gzip"]) {
        const actual = route[metric]?.[encoding];
        assert.ok(Number.isFinite(actual) && actual >= 0 && actual <= ceilings[name][metric][encoding],
          `${name}: ${metric} ${encoding} budget ${ceilings[name][metric][encoding]}, received ${actual}`);
      }
    }
    assert.ok(Number.isInteger(route.javascriptFiles) && route.javascriptFiles >= 0 && route.javascriptFiles <= ceilings[name].javascriptFiles, name + ": JavaScript file budget");
  }
  const warmCeilings = budgets.warm[mode];
  assert.deepEqual(data.warm.map(row => row.from + " -> " + row.to).sort(), Object.keys(warmCeilings).sort(), mode + ": frozen warm coverage");
  for (const row of data.warm) {
    const name = row.from + " -> " + row.to;
    const ceiling = warmCeilings[name];
    const files = row.javascriptFiles;
    assert.ok(Number.isInteger(files) && files >= 0 && files <= ceiling.javascriptFiles, name + ": warm JavaScript file budget");
    for (const encoding of ["raw", "gzip"]) {
      const bytes = row.page?.[encoding];
      assert.ok(Number.isInteger(bytes) && bytes >= 0 && bytes <= ceiling.page[encoding], name + ": warm page " + encoding + " budget");
    }
  }
  if (proposed) {
    for (const target of Object.values(budgets.targets)) {
      for (const encoding of ["raw", "gzip"]) {
        assert.ok(data.routes[target.route].javascript[encoding] <= target.ceilings[mode][encoding],
          `${target.route}: proposed javascript ${encoding} budget ${target.ceilings[mode][encoding]}`);
      }
    }
  }
}

export function checkLoadingBudgets(report, options) {
  assert.deepEqual(report.cases, manifest.cases, "Frozen loading compositions");
  assert.deepEqual(Object.keys(report.modes).sort(), ["full", "minimal"], "Both consumers required");
  for (const [mode, data] of Object.entries(report.modes)) checkModeBudgets(mode, data, options);
}

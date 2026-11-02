import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compare } from "../recipe-delivery-runtime/stats.mjs";
import { resourceSizes } from "../../scripts/measure-resources.mjs";
import { decodeAttribute } from "../../scripts/html.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const names = ["one", "cog", "key-square", "paint-eye-off", "four", "ten", "repeated", "all", "repeated-all", "path-paint-repeated"];
const experiment = join(root, "experiments/css-client");
const files = [...readdirSync(experiment).filter(name => /\.(?:mjs|ts)$/.test(name)).map(name => "experiments/css-client/" + name),
  "scripts/measure-page-loading.mjs", "scripts/prepared-css.test.mjs", "tests/fixtures/astro/src/pages/page-loading/templates.astro", "pnpm-lock.yaml"];
const hashes = Object.fromEntries(files.map(file => [file, createHash("sha256").update(readFileSync(join(root, file))).digest("hex")]));
const baseline = JSON.parse(readFileSync(join(root, "docs/history/2026-11-02-selective-transforms-loading.json")));
const original = JSON.parse(readFileSync(join(root, "docs/history/2026-11-02-low-javascript-loading.json")));
for (const transport of ["attribute", "template"]) {
  const directory = join(root, ".artifacts/css-client", transport);
  const read = name => JSON.parse(readFileSync(join(directory, "runtime", name)));
  let verify = readFileSync(join(root, "experiments/recipe-delivery-runtime/verify.mjs"), "utf8")
    .replace('"../../scripts/page-loading-cases.mjs"', JSON.stringify(pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href))
    .replace('const root=fileURLToPath(new URL("../../",import.meta.url));', "const root=" + JSON.stringify(root) + ";")
    .replace('"/.artifacts/recipe-delivery-runtime/"', JSON.stringify("/.artifacts/css-client/" + transport + "/runtime/"))
    .replace(/const names=\[[^\n]+\];/, "const names=" + JSON.stringify(names) + ";")
    .replace('variant==="proof"&&name==="path-paint-repeated"?1423:0', "0")
    .replace("300 server batch pairs, 150 streaming pairs and 100 browser pairs", "600 server batch pairs, 300 streaming pairs and 200 browser pairs");
  await import("data:text/javascript;base64," + Buffer.from(verify).toString("base64"));
  const servers = [read("server-run-1.json"), read("server-run-2.json")];
  const browser = read("browser-run-1.json");
  const report = { transport, reference: "9a5a81f", sourceHashes: hashes, environment: baseline.environment, browserEnvironment: read("browser-environment.json"),
    protocol: { server: "Two independent production Node processes; five warmup pairs and thirty measured pairs per scenario; separate streaming runs with three warmup pairs and fifteen measured pairs", browser: "Three warmup pairs and twenty measured pairs in fresh visible frames, warm assets, at most twenty matched hosts", statistics: "5000 deterministic paired bootstrap resamples, medians, p95 and 95% intervals; no outliers discarded", excluded: "Build, container creation, HTTP adapter/network, frame pacing and visual acceptance" }, server: {}, browser: {}, loading: {} };
  for (const name of names) {
    const samples = servers.flatMap(run => run.scenarios[name].samples);
    const streams = servers.flatMap(run => run.scenarios[name].streams);
    report.server[name] = { batch: servers[0].scenarios[name].batch, controls: servers[0].scenarios[name].controls,
      wall: compare(samples, "wallMs"), cpu: compare(samples, "cpuMs"), firstSvg: compare(streams, "firstSvgMs"), streamTotal: compare(streams, "totalMs"),
      campaigns: servers.map(run => ({ wall: compare(run.scenarios[name].samples, "wallMs"), firstSvg: compare(run.scenarios[name].streams, "firstSvgMs") })) };
    report.browser[name] = Object.fromEntries(["readyMs", "defineMs", "initialLayoutMs", "startMs"].map(key => [key, compare(browser.scenarios[name].samples, key)]));
  }
  const loading = JSON.parse(readFileSync(join(directory, "loading.json")));
  loading.source = { ...loading.source, measurementSHA256: hashes["scripts/measure-page-loading.mjs"], proofSources: hashes };
  for (const mode of ["full", "minimal"]) {
    report.loading[mode] = { routes: {}, warm: loading.modes[mode].warm.map(row => {
      const before = baseline.modes[mode].warm.find(value => value.from === row.from && value.to === row.to);
      return { from: row.from, to: row.to, pageDelta: { raw: row.page.raw - before.page.raw, gzip: row.page.gzip - before.page.gzip }, javascriptFilesDelta: row.javascriptFiles - before.javascriptFiles };
    }) };
    for (const [name, route] of Object.entries(loading.modes[mode].routes)) {
      const html = readFileSync(join(directory, mode, "dist/page-loading", name, "index.html"), "utf8");
      const attributeRecords = transport === "attribute" ? [...html.matchAll(/data-grave-(?:cycle|combined|opacity|paint)-recipe="([^"]*)"/g)].map(match => JSON.parse(decodeAttribute(match[1]))) : [];
      const recoveryCSS = transport === "attribute"
        ? attributeRecords.map(record => record.css)
        : [...html.matchAll(/<template\b[^>]*data-css-recovery[^>]*><style\b[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
      const scalarData = transport === "attribute" ? attributeRecords.filter(record => record.basis).map(record => JSON.stringify(record.basis).replaceAll('"', "&quot;"))
        : [...html.matchAll(/data-basis="([^"]*)"/g)].filter(match => match[1] !== "null").map(match => match[1]);
      route.transportData = { recoveryCopies: recoveryCSS.length, recoveryCSS: resourceSizes(recoveryCSS), scalarData: resourceSizes(scalarData), note: "Diagnostic subsets of HTML. Scalar data measures escaped JSON values, excluding attribute/property names. Separate compression of copies/attributes is not a transfer estimate. Whole-page HTML already includes all recovery CSS and JSON." };
      const delta = previous => Object.fromEntries(["javascript", "html", "css", "recipeData", "total", "page"].map(metric => [metric, { raw: route[metric].raw - previous[metric].raw, gzip: route[metric].gzip - previous[metric].gzip }]));
      report.loading[mode].routes[name] = { against108: delta(original.modes[mode].routes[name]), against109: delta(baseline.modes[mode].routes[name]), javascriptFiles: route.javascriptFiles };
    }
  }
  writeFileSync(join(directory, "loading.json"), JSON.stringify(loading, null, 2) + "\n");
  writeFileSync(join(directory, "summary.json"), JSON.stringify(report, null, 2) + "\n");
  console.table(names.map(name => ({ transport, name, serverDeltaMs: report.server[name].wall.medianDifference, readyDeltaMs: report.browser[name].readyMs.medianDifference, firstLaunchDeltaMs: report.browser[name].startMs.medianDifference })));
}

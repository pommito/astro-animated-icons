import { fileURLToPath } from "node:url";
import { createCSSRouteVerifier, verifyChunkUnion } from "./css-route-contract.mjs";
import { capabilitySlugs, capabilityCases, selectedSlugs } from "./measure-css-capabilities.mjs";

export function verifyCssCapabilities(output, log = console.log) {
  const verifier = createCSSRouteVerifier(output, 10000);
  const routes = new Map();
  for (const name of capabilityCases) {
    const icons = name === "repeated" ? Array(20).fill(capabilitySlugs[0]) : selectedSlugs(name);
    const selected = [...icons, ...(name.endsWith("mixed") ? ["loader-circle"] : [])];
    routes.set(name, verifier.verify(`css-capabilities/managed/${name}/index.html`, `css-capabilities/baseline/${name}/index.html`, selected));
  }
  const loader = verifier.read("loader-circle-single/index.html");
  for (const name of ["family", "folders", "opacity", "group", "mixed", "folders-mixed", "opacity-mixed", "repeated"]) {
    const individual = selectedSlugs(name).map(slug => routes.get(slug));
    if (name.endsWith("mixed")) individual.push(loader);
    verifyChunkUnion(name, routes.get(name), individual);
  }
  log(`Verified ${capabilityCases.length} capability routes: drawings, selected generated styles, registrations, deduplication, and chunk unions.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssCapabilities(new URL("../tests/fixtures/astro/dist/", import.meta.url));

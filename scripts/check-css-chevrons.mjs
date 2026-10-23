import { fileURLToPath } from "node:url";
import { createCSSRouteVerifier, verifyChunkUnion } from "./css-route-contract.mjs";
import { chevronSlugs, chevronCases } from "./measure-css-chevrons.mjs";

export function verifyCssChevrons(output, log = console.log) {
  const verifier = createCSSRouteVerifier(output, 12000);
  const routes = new Map();
  for (const name of chevronCases) {
    const icons = name === "repeated" ? Array(20).fill(chevronSlugs[0])
      : ["family", "mixed"].includes(name) ? chevronSlugs : [name];
    const selected = [...icons, ...(name === "mixed" ? ["loader-circle"] : [])];
    routes.set(name, verifier.verify(`css-chevrons/managed/${name}/index.html`, `css-chevrons/baseline/${name}/index.html`, selected));
  }
  const loader = verifier.read("loader-circle-single/index.html");
  for (const name of ["family", "mixed", "repeated"]) {
    const individual = (name === "repeated" ? [chevronSlugs[0]] : chevronSlugs).map(slug => routes.get(slug));
    if (name === "mixed") individual.push(loader);
    verifyChunkUnion(name, routes.get(name), individual);
  }
  log(`Verified ${chevronCases.length} chevron routes: drawings, selected generated styles, registrations, deduplication, and chunk unions.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssChevrons(new URL("../tests/fixtures/astro/dist/", import.meta.url));

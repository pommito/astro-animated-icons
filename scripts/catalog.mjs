import { readFileSync } from "node:fs";

export function readCatalog(source = readFileSync(new URL("../packages/animated-icons/src/astro.ts", import.meta.url), "utf8")) {
  return [...source.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*["']\.\/icons\/([^/]+)\/[^"']+\.astro["']/g)]
    .map(([, name, slug]) => ({ name, slug, tag: `grave-${slug}` }));
}

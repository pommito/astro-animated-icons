import { readFileSync } from "node:fs";

export function readCatalog() {
  const source = readFileSync(new URL("../packages/animated-icons/src/astro.ts", import.meta.url), "utf8");
  return [...source.matchAll(/export \{ default as (\w+) \} from "\.\/icons\/([^/]+)\//g)]
    .map(([, name, slug]) => ({ name, slug, tag: `grave-${slug}` }));
}

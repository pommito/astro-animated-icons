import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const fixtureRequire = createRequire(new URL("../tests/fixtures/astro/package.json", import.meta.url));
const astroRequire = createRequire(fixtureRequire.resolve("astro/package.json"));
const parserPackage = astroRequire.resolve("ultrahtml/package.json");
const parserExports = JSON.parse(readFileSync(parserPackage, "utf8")).exports["."].import;
const { parse } = await import(pathToFileURL(resolve(dirname(parserPackage), parserExports)).href);
export const elements = node => [node, ...(node.children ?? []).flatMap(elements)];

export const htmlElements = html => elements(parse(html));
export const decodeAttribute = value => value.replace(/&(#x[\da-f]+|#\d+|quot|apos|amp|lt|gt);/gi, (_, entity) =>
  entity[0] === "#" ? String.fromCodePoint(entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)))
    : ({ quot: '"', apos: "'", amp: "&", lt: "<", gt: ">" })[entity.toLowerCase()]);

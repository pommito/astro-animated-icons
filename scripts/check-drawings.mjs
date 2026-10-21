import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { readCatalog } from "./catalog.mjs";

const root = new URL("../", import.meta.url);
const fixtureRequire = createRequire(new URL("../tests/fixtures/astro/package.json", import.meta.url));
const astroRequire = createRequire(fixtureRequire.resolve("astro/package.json"));
const parserPackage = astroRequire.resolve("ultrahtml/package.json");
const parserExports = JSON.parse(readFileSync(parserPackage, "utf8")).exports["."].import;
const { parse } = await import(pathToFileURL(resolve(dirname(parserPackage), parserExports)).href);
const shapeNames = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "ellipse"]);

function elements(node) {
  return [node, ...(node.children ?? []).flatMap(elements)];
}

export function checkDrawing(html, icon, drawing) {
  const nodes = elements(parse(html));
  const primary = nodes.find(node => node.attributes?.id === "primary");
  assert.ok(primary, `${icon.slug}: primary control`);
  assert.equal(primary.name, "a", `${icon.slug}: native link`);
  assert.equal(primary.attributes.href, "#destination", `${icon.slug}: native destination`);
  const wrapper = elements(primary).find(node => node.name === icon.tag);
  assert.ok(wrapper, `${icon.slug}: rendered tag`);
  assert.equal(wrapper.attributes["data-grave-icon"], "true");
  assert.equal(wrapper.attributes.tabindex, undefined);
  const svg = wrapper.children.find(node => node.name === "svg");
  assert.ok(svg, `${icon.slug}: initial SVG`);
  assert.equal(svg.attributes["aria-hidden"], "true");
  assert.equal(svg.attributes.viewBox, "0 0 24 24");
  assert.equal(svg.attributes["stroke-width"], "2");
  const shapes = elements(svg).filter(node => shapeNames.has(node.name));
  assert.equal(shapes.length, drawing.length, `${icon.slug}: complete shape count`);
  for (const [index, shape] of drawing.entries()) {
    assert.equal(shapes[index].name, shape.tag, `${icon.slug}: shape ${index}`);
    for (const [attribute, value] of Object.entries(shape.attrs)) {
      assert.equal(shapes[index].attributes[attribute], value, `${icon.slug}: shape ${index} ${attribute}`);
    }
  }
  const standalone = nodes.find(node => node.attributes?.id === "standalone");
  assert.equal(standalone?.name, icon.tag, `${icon.slug}: standalone tag`);
  const labeled = standalone.children.find(node => node.name === "svg");
  assert.ok(labeled?.attributes["aria-label"] && labeled.attributes.role === "img", `${icon.slug}: labeled standalone icon`);
  for (const node of [standalone, labeled]) {
    assert.notEqual(node.attributes["aria-hidden"], "true", `${icon.slug}: labeled standalone icon must remain accessible`);
  }
  assert.ok(nodes.some(node => node.attributes?.id === "destination"), `${icon.slug}: destination exists`);
}

async function drawings() {
  const result = new Map();
  function add(slug, drawing) {
    const previous = result.get(slug);
    if (previous) {
      assert.equal(previous.length, drawing.length, `${slug}: baseline shape count`);
      drawing.forEach((shape, index) => {
        assert.equal(previous[index].tag, shape.tag, `${slug}: baseline shape type`);
        for (const [attribute, value] of Object.entries(shape.attrs)) {
          if (attribute in previous[index].attrs) assert.equal(previous[index].attrs[attribute], value, `${slug}: conflicting ${attribute} baseline`);
          previous[index].attrs[attribute] = value;
        }
      });
    } else result.set(slug, drawing);
  }
  for (const file of readdirSync(new URL("tests/helpers/", root)).filter(name => name.endsWith(".ts"))) {
    const source = readFileSync(new URL(`tests/helpers/${file}`, root), "utf8");
    if (!source.startsWith("export const ")) continue;
    const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
    const data = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
    for (const icons of Object.values(data).filter(Array.isArray)) for (const icon of icons) {
      let drawing = icon.drawing ?? icon.geometry?.map(shape => ({ tag: shape.tag, attrs: shape.attributes }));
      if (icon.paths) {
        drawing = icon.paths.map(d => ({ tag: "path", attrs: { d } }));
        if (icon.frame) drawing.unshift({ tag: icon.frame === "circle" ? "circle" : "rect", attrs: icon.frame === "circle"
          ? { cx: "12", cy: "12", r: "10" } : { x: "3", y: "3", width: "18", height: "18", rx: "2" } });
      }
      if (icon.circles) drawing = icon.circles.map(([cx, cy]) => ({ tag: "circle", attrs: { cx: String(cx), cy: String(cy), r: "1" } }));
      assert.ok(drawing, `${file}: expected drawing for ${icon.slug}`);
      add(icon.slug, drawing);
    }
  }
  for (const [slug, drawing] of Object.entries(JSON.parse(readFileSync(new URL("tests/helpers/standalone-drawings.json", root), "utf8")))) {
    assert.ok(!result.has(slug), `Duplicate drawing ${slug}`);
    result.set(slug, drawing);
  }
  return result;
}

export async function checkDrawings(slugs = []) {
  const expected = await drawings();
  const catalog = readCatalog();
  assert.deepEqual([...expected.keys()].sort(), catalog.map(icon => icon.slug).sort(), "Drawing baselines agree with public exports");
  for (const slug of slugs) assert.ok(expected.has(slug), `Unknown icon ${slug}`);
  const selected = slugs.length ? catalog.filter(icon => slugs.includes(icon.slug)) : catalog;
  for (const icon of selected) {
    const route = icon.slug === "arrow-left" ? "" : `${icon.slug}/`;
    checkDrawing(readFileSync(new URL(`tests/fixtures/astro/dist/${route}index.html`, root), "utf8"), icon, expected.get(icon.slug));
  }
  console.log(`Verified ${selected.length} production drawings and native controls; ${catalog.length} public exports have recorded drawing baselines.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await checkDrawings(process.argv.slice(2));

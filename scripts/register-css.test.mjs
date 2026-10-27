import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { evaluateTypeScriptData } from "./typescript-data.mjs";

const source = readFileSync(new URL("../packages/animated-icons/src/shared/register-css.ts", import.meta.url), "utf8")
  .replace(/^import .*;\n/, "const createIconElement = recipe => ({ recipe });\n");
const { registerCSSRecipes } = await evaluateTypeScriptData(source);
const attribute = "data-grave-cycle-recipe";
const host = (tag, data = { id: tag.slice(6) }) => ({
  localName: tag,
  hasAttribute: name => name === "data-grave-icon" || name === attribute,
  getAttribute: name => name === attribute ? JSON.stringify(data) : null,
});
function root(hosts = [], templates = []) {
  return { querySelectorAll: selector => selector === "template" ? templates.map(content => ({ content })) : hosts };
}
function environment(document, run) {
  const previous = { document: globalThis.document, customElements: globalThis.customElements };
  const definitions = new Map();
  const events = new Map();
  globalThis.document = { ...document, addEventListener: (event, listener) => events.set(event, listener) };
  globalThis.customElements = {
    get: tag => definitions.get(tag),
    define(tag, element) { assert.ok(!definitions.has(tag)); definitions.set(tag, element); },
  };
  try { run(definitions, events); }
  finally { Object.assign(globalThis, previous); }
}

test("registration scans nested inert templates and defines repeated tags once", () => {
  environment(root([host("grave-bell")], [root([host("grave-bell")], [root([host("grave-chevron-right")])])]), definitions => {
    let factories = 0;
    registerCSSRecipes(attribute, data => { factories++; return data; });
    assert.deepEqual([...definitions.keys()], ["grave-bell", "grave-chevron-right"]);
    assert.equal(factories, 2);
    assert.equal(definitions.get("grave-bell").recipe.id, "bell");
  });
});

test("a detached-source clone has its own data and page navigation discovers later recipes", () => {
  const hosts = [host("grave-bell"), host("div")];
  environment(root(hosts), (definitions, events) => {
    registerCSSRecipes(attribute, data => data);
    assert.deepEqual([...definitions.keys()], ["grave-bell"]);
    hosts.push(host("grave-chevron-right"));
    events.get("astro:page-load")();
    assert.deepEqual([...definitions.keys()], ["grave-bell", "grave-chevron-right"]);
  });
});

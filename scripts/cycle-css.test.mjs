import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { ensureOpacityCSS, opacityParts, generatedOpacityCSS } from "./css-opacity.mjs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";

const source = new URL("../packages/animated-icons/src/", import.meta.url);
const load = path => evaluateTypeScriptData(readFileSync(new URL(path, source), "utf8"));
const [{ cycleCSS, ensureCycleCSS }, { bellCycle }, { chevronRightCycle }, { folderCycle }] = await Promise.all([
  load("shared/cycle-css.ts"), load("icons/bell/cycle.ts"), load("icons/chevron-right/cycle.ts"), load("icons/folder/cycle.ts"),
]);

test("return timing can differ from entry while existing cycles keep their defaults", () => {
  const css = cycleCSS(folderCycle);
  assert.ok(css.includes('[data-css-cycle="folder"] [data-motion="0"]{animation-duration:0.4s;'));
  assert.ok(css.includes('[data-cycle-state="return"] [data-motion="0"]{animation-name:grave-cycle-folder-return;animation-duration:0.2s;animation-timing-function:cubic-bezier(0,0,.58,1);'));
  for (const cycle of [bellCycle, chevronRightCycle]) {
    assert.ok(cycleCSS(cycle).includes("-return;animation-duration:" + cycle.duration + "s;"));
  }
});

function documentWithSheets(sheets = []) {
  const attach = sheet => {
    sheet.remove = () => sheets.splice(sheets.indexOf(sheet), 1);
    return sheet;
  };
  sheets.forEach(attach);
  return {
    sheets,
    querySelectorAll(selector) { return sheets.filter(sheet => selector === 'style[data-grave-cycle-style="' + sheet.id + '"]'); },
    createElement(tag) {
      assert.equal(tag, "style");
      return { setAttribute(name, value) { assert.equal(name, "data-grave-cycle-style"); this.id = value; } };
    },
    head: { append(sheet) { sheets.push(attach(sheet)); } },
  };
}

test("missing active CSS is recovered once per recipe from the shared cycle", () => {
  const document = documentWithSheets();
  ensureCycleCSS(bellCycle, document);
  ensureCycleCSS(bellCycle, document);
  ensureCycleCSS(chevronRightCycle, document);
  assert.deepEqual(document.sheets.map(sheet => [sheet.id, sheet.textContent]), [
    ["bell", cycleCSS(bellCycle)], ["chevron-right", cycleCSS(chevronRightCycle)],
  ]);
});

test("an active server sheet is reused without DOM writes", () => {
  const document = documentWithSheets([{ id: "bell", textContent: cycleCSS(bellCycle) }]);
  document.createElement = () => { throw new Error("The active server sheet must be reused"); };
  ensureCycleCSS(bellCycle, document);
  assert.equal(document.sheets.length, 1);
});

test("CSS recovery is scoped to the owning document and replaces removed sheets", () => {
  const first = documentWithSheets();
  const second = documentWithSheets();
  ensureCycleCSS(bellCycle, first);
  ensureCycleCSS(bellCycle, second);
  assert.equal(first.sheets.length, 1);
  assert.equal(second.sheets.length, 1);
  second.sheets.pop();
  ensureCycleCSS(bellCycle, second);
  assert.equal(second.sheets[0].textContent, cycleCSS(bellCycle));
});

test("a late server sheet is reconciled with an existing recovered sheet", () => {
  const document = documentWithSheets([
    { id: "bell", textContent: cycleCSS(bellCycle) },
    { id: "bell", textContent: cycleCSS(bellCycle) },
    { id: "chevron-right", textContent: cycleCSS(chevronRightCycle) },
  ]);
  const retained = document.sheets[0];
  ensureCycleCSS(bellCycle, document);
  assert.equal(document.sheets.length, 2);
  assert.equal(document.sheets[0], retained);
  assert.equal(document.sheets[1].id, "chevron-right");
});


test("opacity sheets recover per document and reconcile late server sheets", () => {
  for (const [id, parts] of opacityParts) {
    const document = documentWithSheets();
    ensureOpacityCSS(id, parts, document);
    ensureOpacityCSS(id, parts, document);
    assert.equal(document.sheets.length, 1);
    assert.equal(document.sheets[0].textContent, generatedOpacityCSS.get(id));
    document.head.append({ id, textContent: generatedOpacityCSS.get(id) });
    ensureOpacityCSS(id, parts, document);
    assert.equal(document.sheets.length, 1);
    document.sheets.pop();
    ensureOpacityCSS(id, parts, document);
    assert.equal(document.sheets[0].textContent, generatedOpacityCSS.get(id));
    const other = documentWithSheets();
    ensureOpacityCSS(id, parts, other);
    assert.equal(other.sheets.length, 1);
  }
});

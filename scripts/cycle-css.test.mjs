import assert from "node:assert/strict";
import { test } from "node:test";
import { ensureOpacityCSS, opacityParts, generatedOpacityCSS } from "./css-opacity.mjs";
import { cycleCSS, ensureCycleCSS, cycles, combinedFrames, combinedPose } from "./css-cycles.mjs";
import captured from "../docs/history/2026-10-29-combined-motion-before.json" with { type: "json" };
const bellCycle = cycles.get("bell");
const chevronRightCycle = cycles.get("chevron-right");
const folderCycle = cycles.get("folder");

test("KeySquare compiles ordered scale and rotation channels with its original timing", () => {
  const cycle = cycles.get("key-square");
  assert.ok(cycle, "KeySquare has one shared cycle definition");
  assert.deepEqual(cycle.tracks, [
    { property: "scale", values: [1, 1.05, 1, 1], times: [0, 1 / 3, 2 / 3, 1], rest: 1 },
    { property: "rotate", values: [0, 15, -15, 0], times: [0, 1 / 3, 2 / 3, 1], rest: 0 },
  ]);
  assert.equal(cycle.duration, 0.6);
  assert.equal(cycle.returnDuration, 0.6);
  assert.equal(cycle.ease, "easeOut");
  assert.equal(cycle.returnEase, "easeOut");
  assert.equal(cycle.origin, "50% 50%");
  assert.equal(cycle.finish, "hold");
  assert.equal(cycle.replay, "current");
  const css = cycleCSS(cycle);
  assert.ok(css.includes('0%{transform:var(--grave-cycle-from,scale(1) rotate(0deg));}'));
  assert.ok(css.includes('animation-duration:0.6s;animation-timing-function:linear;'));
  assert.equal([...css.matchAll(/%\{transform:/g)].length, 242);
});

test("Wallet keeps nonuniform entry offsets and its independent 300 ms return", () => {
  const cycle = cycles.get("wallet");
  assert.ok(cycle, "Wallet has one shared cycle definition");
  assert.deepEqual(cycle.tracks, [
    { property: "translateY", values: [0, -3, 0], times: [0, 0.45, 1], rest: 0 },
    { property: "rotate", values: [0, -4, 0], times: [0, 0.45, 1], rest: 0 },
  ]);
  assert.equal(cycle.duration, 0.55);
  assert.equal(cycle.returnDuration, 0.3);
  assert.equal(cycle.ease, "easeInOut");
  assert.equal(cycle.returnEase, "easeOut");
  assert.equal(cycle.origin, "12px 12px");
  const css = cycleCSS(cycle);
  assert.equal([...css.matchAll(/%\{transform:/g)].length, 172);
  assert.ok(css.includes('-return;animation-duration:0.3s;animation-timing-function:linear;'));
});

test("KeyCircle keeps unequal channel lengths and independent offsets", () => {
  const cycle = cycles.get("key-circle");
  assert.ok(cycle, "KeyCircle has one shared cycle definition");
  assert.deepEqual(cycle.tracks, [
    { property: "translateY", values: [0, -3, 0, -2, 0], times: [0, 0.25, 0.5, 0.75, 1], rest: 0 },
    { property: "rotate", values: [0, 3, -3, 0], times: [0, 1 / 3, 2 / 3, 1], rest: 0 },
  ]);
  assert.equal(cycle.duration, 0.9);
  assert.equal(cycle.returnDuration, 0.9);
  assert.equal(cycle.ease, "easeOut");
  assert.equal(cycle.returnEase, "easeOut");
  assert.equal([...cycleCSS(cycle).matchAll(/%\{transform:/g)].length, 362);
});

test("combined scalar sampling preserves independently captured Motion entry matrices", () => {
  for (const pose of captured.poses.filter(pose => pose.scenario === "entry" && pose.size === 14)) {
    const cycle = cycles.get(pose.slug);
    const values = combinedPose(combinedFrames(cycle, false), cycle.duration * 1000, pose.time);
    const channels = Object.fromEntries(cycle.tracks.map((track, index) => [track.property, values[index]]));
    const scale = channels.scale ?? 1;
    const angle = channels.rotate * Math.PI / 180;
    const matrix = [scale * Math.cos(angle), scale * Math.sin(angle), -scale * Math.sin(angle), scale * Math.cos(angle), 0, channels.translateY ?? 0];
    const difference = Math.max(...matrix.map((value, index) => Math.abs(value - pose.matrix[index])));
    assert.ok(difference <= 0.005, pose.slug + " at " + pose.time + " ms: " + difference);
  }
});

test("UserRoundCog preserves the positive half-turn and 300 ms current-pose entry and return", () => {
  const cycle = cycles.get("user-round-cog");
  assert.ok(cycle, "UserRoundCog uses the shared cycle compiler");
  assert.equal(cycle.target, "[data-cog]");
  assert.equal(cycle.property, "rotate");
  assert.deepEqual(cycle.values, [0, 180]);
  assert.deepEqual(cycle.times, [0, 1]);
  assert.equal(cycle.duration, 0.3);
  assert.equal(cycle.returnDuration ?? cycle.duration, 0.3);
  assert.equal(cycle.ease, "easeOut");
  assert.equal(cycle.returnEase ?? cycle.ease, "easeOut");
  assert.equal(cycle.finish, "hold");
  assert.equal(cycle.replay, "current");
  const css = cycleCSS(cycle);
  assert.ok(css.includes("0%{transform:var(--grave-cycle-from,rotate(0deg));}100%{transform:rotate(180deg);}"));
  assert.ok(css.includes("-return{from{transform:var(--grave-cycle-from);}to{transform:rotate(0deg);}}"));
  assert.ok(css.includes('[data-css-cycle="user-round-cog"] [data-cog]{animation-duration:0.3s;animation-timing-function:cubic-bezier(0,0,.58,1);'));
});

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

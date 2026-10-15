import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);

function inspectRoute(route) {
  const html = readFileSync(new URL(route, output), "utf8");
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const entries = scripts.flatMap(([, attributes]) => [...attributes.matchAll(/\bsrc="([^"]+)"/g)].map((match) => match[1]));
  const inline = scripts.filter(([, attributes]) => !/\bsrc=/.test(attributes)).map(([, , source]) => source);
  const chunks = new Map();

  function collectImports(source, path) {
    for (const [, specifier] of source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g)) {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        collectChunk(new URL(specifier, new URL(path, "https://fixture.invalid")).pathname);
      }
    }
  }

  function collectChunk(path) {
    if (chunks.has(path)) return;
    const source = readFileSync(new URL(path.slice(1), output), "utf8");
    chunks.set(path, source);
    collectImports(source, path);
  }

  entries.forEach(collectChunk);
  inline.forEach((source) => collectImports(source, `/${route}`));

  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(([, source]) => source);
  for (const [, attributes] of html.matchAll(/<link\b([^>]*)>/g)) {
    const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
    if (href && /\brel="stylesheet"/.test(attributes)) {
      styles.push(readFileSync(new URL(href.slice(1), output), "utf8"));
    }
  }
  const css = styles.join("\n").trim();
  const bytes = [...chunks.values()].reduce((sum, source) => sum + Buffer.byteLength(source), 0);
  const gzip = [...chunks.values()].reduce((sum, source) => sum + gzipSync(source).byteLength, 0);
  console.log(`${route}: ${entries.length} external entries, ${chunks.size} JS chunks, ${bytes} bytes, ${gzip} bytes gzip; ${inline.length} inline scripts, ${inline.reduce((sum, source) => sum + Buffer.byteLength(source), 0)} bytes; ${Buffer.byteLength(css)} bytes CSS`);
  for (const [path, source] of chunks) {
    console.log(`  ${path}: ${Buffer.byteLength(source)} bytes, ${gzipSync(source).byteLength} bytes gzip`);
  }
  return { entries, chunks, inline, css, source: [...chunks.values(), ...inline].join("\n") };
}

const plain = inspectRoute("plain/index.html");
assert.equal(plain.chunks.size, 0);
assert.equal(plain.inline.length, 0);
assert.equal(plain.css, "");

const single = inspectRoute("single/index.html");
assert.equal(single.entries.length, 1);
assert.equal(single.inline.length, 0);
assert.ok(!single.source.includes("grave-map-pin"), "ArrowLeft alone must not load MapPin behavior");
assert.ok(!single.source.includes("grave-copy"), "ArrowLeft alone must not load Copy behavior");

const selective = inspectRoute("selective/index.html");
assert.deepEqual([...selective.chunks.keys()], [...single.chunks.keys()]);
assert.equal(selective.css, single.css);
assert.ok(!selective.source.includes("grave-bundle-probe"), "An unused icon must not register its element");

const probe = inspectRoute("probe/index.html");
assert.equal(probe.css, single.css, "Icons must share base styles without adding unused icon selectors");
assert.ok(!probe.source.includes("grave-arrow-left"), "The probe must not load ArrowLeft behavior");
assert.ok(!probe.css.includes("grave-arrow-left"), "The probe must not load ArrowLeft-specific CSS");
assert.ok(!probe.source.includes("grave-map-pin"), "The probe must not load MapPin behavior");
assert.ok(!probe.source.includes("grave-copy"), "The probe must not load Copy behavior");

const mapPin = inspectRoute("map-pin-single/index.html");
assert.equal(mapPin.entries.length, 1);
assert.equal(mapPin.inline.length, 0);
assert.equal(mapPin.css, single.css, "MapPin must reuse the same base CSS");
assert.ok(mapPin.source.includes("grave-map-pin"));
assert.ok(!mapPin.source.includes("grave-arrow-left"), "MapPin alone must not load ArrowLeft behavior");
assert.ok(!mapPin.source.includes("grave-bundle-probe"));
assert.ok(!mapPin.source.includes("grave-copy"), "MapPin alone must not load Copy behavior");

const both = inspectRoute("both/index.html");
assert.equal(both.css, single.css, "Multiple real icons must share the same base CSS");
assert.ok(both.source.includes("grave-map-pin"));
assert.ok(both.source.includes("grave-arrow-left"));
assert.ok(!both.source.includes("grave-copy"));

const copy = inspectRoute("copy-single/index.html");
assert.equal(copy.entries.length, 1);
assert.equal(copy.inline.length, 0);
assert.equal(copy.css, single.css, "Copy must reuse the same base CSS");
assert.ok(copy.source.includes("grave-copy"));
assert.ok(!copy.source.includes("grave-arrow-left"), "Copy alone must not load ArrowLeft behavior");
assert.ok(!copy.source.includes("grave-map-pin"), "Copy alone must not load MapPin behavior");
assert.ok(!copy.source.includes("grave-bundle-probe"));

const arrowCopy = inspectRoute("arrow-copy/index.html");
assert.equal(arrowCopy.entries.length, 2);
assert.equal(arrowCopy.inline.length, 0);
assert.equal(arrowCopy.css, single.css, "ArrowLeft and Copy must share the same base CSS");
assert.ok(arrowCopy.source.includes("grave-arrow-left"));
assert.ok(arrowCopy.source.includes("grave-copy"));
assert.ok(!arrowCopy.source.includes("grave-map-pin"));
const sharedChunks = [...single.chunks.keys()].filter((path) => copy.chunks.has(path));
assert.ok(sharedChunks.length > 0, "Copy and ArrowLeft must reuse their shared runtime");
assert.deepEqual(new Set(arrowCopy.chunks.keys()), new Set([...single.chunks.keys(), ...copy.chunks.keys()]));

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy]) {
  assert.ok(!icon.source.includes("grave-check"), "Unused Check behavior must not load");
}

const check = inspectRoute("check-single/index.html");
assert.equal(check.entries.length, 1);
assert.equal(check.inline.length, 0);
assert.equal(check.css, single.css, "Check must reuse the same base CSS");
assert.ok(check.source.includes("grave-check"));
assert.ok(!/grave-(arrow-left|map-pin|copy|bundle-probe)/.test(check.source), "Check alone must exclude every unused icon");

const copyCheck = inspectRoute("copy-check/index.html");
assert.equal(copyCheck.entries.length, 2);
assert.equal(copyCheck.inline.length, 0);
assert.equal(copyCheck.css, single.css, "Copy and Check must share the same base CSS");
assert.ok(copyCheck.source.includes("grave-check"));
assert.ok(copyCheck.source.includes("grave-copy"));
assert.ok(!/grave-(arrow-left|map-pin|bundle-probe)/.test(copyCheck.source));
assert.ok([...check.chunks.keys()].some((path) => copy.chunks.has(path)), "Check and Copy must reuse their shared runtime");
assert.deepEqual(new Set(copyCheck.chunks.keys()), new Set([...copy.chunks.keys(), ...check.chunks.keys()]));

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck]) {
  assert.ok(!icon.source.includes("grave-at-sign"), "Unused AtSign behavior must not load");
}

const atSign = inspectRoute("at-sign-single/index.html");
assert.equal(atSign.entries.length, 1);
assert.equal(atSign.inline.length, 0);
assert.equal(atSign.css, single.css, "AtSign must reuse the same base CSS");
assert.ok(atSign.source.includes("grave-at-sign"));
assert.ok(!/grave-(arrow-left|arrow-right|map-pin|copy|check|bundle-probe)/.test(atSign.source), "AtSign alone must exclude every unused icon");

const arrowAtSign = inspectRoute("arrow-at-sign/index.html");
assert.equal(arrowAtSign.entries.length, 2);
assert.equal(arrowAtSign.inline.length, 0);
assert.equal(arrowAtSign.css, single.css, "ArrowLeft and AtSign must share the same base CSS");
assert.ok(arrowAtSign.source.includes("grave-at-sign"));
assert.ok(arrowAtSign.source.includes("grave-arrow-left"));
assert.ok(!/grave-(map-pin|copy|check|arrow-right|bundle-probe)/.test(arrowAtSign.source));
assert.ok([...atSign.chunks.keys()].some((path) => single.chunks.has(path)), "AtSign and ArrowLeft must reuse their shared runtime");
assert.deepEqual(new Set(arrowAtSign.chunks.keys()), new Set([...single.chunks.keys(), ...atSign.chunks.keys()]));

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign]) {
  assert.ok(!icon.source.includes("grave-arrow-right"), "Unused ArrowRight behavior must not load");
}

const arrowRight = inspectRoute("arrow-right-single/index.html");
assert.equal(arrowRight.entries.length, 1);
assert.equal(arrowRight.inline.length, 0);
assert.equal(arrowRight.css, single.css, "ArrowRight must reuse the same base CSS");
assert.ok(arrowRight.source.includes("grave-arrow-right"));
assert.ok(!/grave-(arrow-left|arrow-up|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowRight.source));

const arrowLeftRight = inspectRoute("arrow-left-right/index.html");
assert.equal(arrowLeftRight.entries.length, 2);
assert.equal(arrowLeftRight.inline.length, 0);
assert.equal(arrowLeftRight.css, single.css, "Both arrows must share the same base CSS");
assert.ok(arrowLeftRight.source.includes("grave-arrow-left"));
assert.ok(arrowLeftRight.source.includes("grave-arrow-right"));
assert.ok(!/grave-(map-pin|arrow-up|copy|check|at-sign|bundle-probe)/.test(arrowLeftRight.source));
assert.ok([...arrowRight.chunks.keys()].some((path) => single.chunks.has(path)), "Both arrows must reuse their shared runtime");
assert.deepEqual(new Set(arrowLeftRight.chunks.keys()), new Set([...single.chunks.keys(), ...arrowRight.chunks.keys()]));

for (const icon of [single, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight]) {
  assert.ok(!/grave-(map-pin|arrow-left|arrow-right|copy|check|at-sign)/.test(icon.css), "No icon-specific CSS may leak through the barrel");
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source), "The browser bundle must not include React");
}
const arrowUp = inspectRoute("arrow-up-single/index.html");
assert.equal(arrowUp.entries.length, 1);
assert.equal(arrowUp.inline.length, 0);
assert.equal(arrowUp.css, single.css, "ArrowUp must reuse the same base CSS");
assert.ok(arrowUp.source.includes("grave-arrow-up"));
assert.ok(!/grave-(arrow-left|arrow-right|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowUp.source));
const arrows = inspectRoute("arrows/index.html");
assert.equal(arrows.entries.length, 2);
assert.equal(arrows.inline.length, 0);
assert.equal(arrows.css, single.css);
assert.ok(arrows.source.includes("grave-arrow-left"));
assert.ok(arrows.source.includes("grave-arrow-up"));
assert.ok(!/grave-(map-pin|arrow-right|copy|check|at-sign|bundle-probe)/.test(arrows.source));
assert.deepEqual(new Set(arrows.chunks.keys()), new Set([...single.chunks.keys(), ...arrowUp.chunks.keys()]));
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight]) {
  assert.ok(!icon.source.includes("grave-arrow-up"), "Unused ArrowUp behavior must not load");
}
for (const icon of [arrowUp, arrows]) {
  assert.ok(!/grave-(map-pin|arrow-left|arrow-up|arrow-right|copy|check|at-sign)/.test(icon.css));
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source));
}
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowUp, arrows, arrowRight, arrowLeftRight]) {
  assert.ok(!icon.source.includes("grave-arrow-down"), "Unused ArrowDown behavior must not load");
}
const arrowDown = inspectRoute("arrow-down-single/index.html");
assert.equal(arrowDown.entries.length, 1);
assert.equal(arrowDown.inline.length, 0);
assert.equal(arrowDown.css, single.css);
assert.ok(arrowDown.source.includes("grave-arrow-down"));
assert.ok(!/grave-(arrow-left|map-pin|copy|check|at-sign|arrow-up|arrow-right|bundle-probe)/.test(arrowDown.source));
assert.ok(!/grave-arrow-down/.test(arrowDown.css));
assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(arrowDown.source));
const arrowDownLeft = inspectRoute("arrow-down-left/index.html");
assert.equal(arrowDownLeft.entries.length, 2);
assert.equal(arrowDownLeft.inline.length, 0);
assert.equal(arrowDownLeft.css, single.css);
assert.deepEqual(new Set(arrowDownLeft.chunks.keys()), new Set([...single.chunks.keys(), ...arrowDown.chunks.keys()]));
assert.ok(!/grave-(map-pin|copy|check|at-sign|arrow-up|arrow-right|bundle-probe)/.test(arrowDownLeft.source));
for (const icon of [arrowUp, arrows]) {
  assert.ok(!icon.source.includes("grave-arrow-right"), "Unused ArrowRight behavior must not load");
}
const arrowUpRight = inspectRoute("arrow-up-right-single/index.html");
assert.equal(arrowUpRight.entries.length, 1);
assert.equal(arrowUpRight.inline.length, 0);
assert.equal(arrowUpRight.css, single.css, "ArrowUpRight must reuse the same base CSS");
assert.ok(arrowUpRight.source.includes("grave-arrow-up-right"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up["']|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowUpRight.source));
const arrowLeftUpRight = inspectRoute("arrow-left-up-right/index.html");
assert.equal(arrowLeftUpRight.entries.length, 2);
assert.equal(arrowLeftUpRight.inline.length, 0);
assert.equal(arrowLeftUpRight.css, single.css);
assert.deepEqual(new Set(arrowLeftUpRight.chunks.keys()), new Set([...single.chunks.keys(), ...arrowUpRight.chunks.keys()]));
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight, arrowUp, arrows]) {
  assert.ok(!icon.source.includes("grave-arrow-up-right"), "Unused ArrowUpRight behavior must not load");
}
for (const icon of [arrowUpRight, arrowLeftUpRight]) {
  assert.ok(!/grave-(arrow|map-pin|copy|check|at-sign)/.test(icon.css));
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source));
}

const arrowUpLeft = inspectRoute("arrow-up-left-single/index.html");
assert.equal(arrowUpLeft.entries.length, 1);
assert.equal(arrowUpLeft.inline.length, 0);
assert.equal(arrowUpLeft.css, single.css, "ArrowUpLeft must reuse the shared CSS");
assert.ok(arrowUpLeft.source.includes("grave-arrow-up-left"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up["']|arrow-up-right|arrow-down|archive|bot|attach-file|map-pin|copy|check|at-sign|audio-lines|bundle-probe)/.test(arrowUpLeft.source), "ArrowUpLeft alone must exclude other registrations");
const arrowLeftUpLeft = inspectRoute("arrow-left-up-left/index.html");
assert.equal(arrowLeftUpLeft.entries.length, 2);
assert.equal(arrowLeftUpLeft.inline.length, 0);
assert.equal(arrowLeftUpLeft.css, single.css);
assert.ok(arrowLeftUpLeft.source.includes("grave-arrow-left"));
assert.ok(arrowLeftUpLeft.source.includes("grave-arrow-up-left"));
assert.deepEqual(new Set(arrowLeftUpLeft.chunks.keys()), new Set([...single.chunks.keys(), ...arrowUpLeft.chunks.keys()]));
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight, arrowUp, arrows, arrowDown, arrowDownLeft, arrowUpRight, arrowLeftUpRight]) {
  assert.ok(!icon.source.includes("grave-arrow-up-left"), "Unused ArrowUpLeft registration must not load");
}
for (const icon of [arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!/grave-arrow-up-left/.test(icon.css), "ArrowUpLeft must not add icon-specific CSS");
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source));
}
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowUp, arrows, arrowRight, arrowLeftRight, arrowDown, arrowDownLeft, arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!icon.source.includes("grave-archive"), "Unused Archive behavior must not load");
}
const archive = inspectRoute("archive-single/index.html");
assert.equal(archive.entries.length, 1);
assert.equal(archive.inline.length, 0);
assert.equal(archive.css, single.css, "Archive must reuse shared CSS");
assert.ok(archive.source.includes("grave-archive"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up|arrow-down|map-pin|copy|check|at-sign|bundle-probe)/.test(archive.source));
assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(archive.source));
assert.ok(!/grave-archive/.test(archive.css));
const arrowArchive = inspectRoute("arrow-archive/index.html");
assert.equal(arrowArchive.entries.length, 2);
assert.equal(arrowArchive.inline.length, 0);
assert.equal(arrowArchive.css, single.css);
assert.ok(arrowArchive.source.includes("grave-arrow-left"));
assert.ok(arrowArchive.source.includes("grave-archive"));
assert.ok(!/grave-(arrow-right|arrow-up|arrow-down|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowArchive.source));
assert.deepEqual(new Set(arrowArchive.chunks.keys()), new Set([...single.chunks.keys(), ...archive.chunks.keys()]));

for (const icon of [archive, arrowArchive, arrowDown, arrowDownLeft, arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!icon.source.includes("grave-arrow-up-right"), "Unused ArrowUpRight behavior must not load");
}
for (const icon of [arrowUpRight, arrowLeftUpRight]) {
  assert.ok(!/grave-(archive|arrow-down)/.test(icon.source));
}
for (const icon of [archive, arrowArchive]) {
  assert.ok(!icon.source.includes("grave-arrow-up-left"), "Unused ArrowUpLeft registration must not load");
}

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight, arrowUp, arrows, arrowDown, arrowDownLeft, archive, arrowArchive, arrowUpRight, arrowLeftUpRight, arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!icon.source.includes("grave-bot"), "Unused Bot behavior must not load");
  assert.ok(!icon.css.includes("grave-bot"), "Unused Bot CSS must not load");
}
const bot = inspectRoute("bot-single/index.html");
assert.equal(bot.entries.length, 1);
assert.equal(bot.inline.length, 0);
assert.equal(bot.css, single.css, "Bot must reuse the same base CSS");
assert.ok(bot.source.includes("grave-bot"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up|arrow-up-right|arrow-down|archive|map-pin|copy|check|at-sign|bundle-probe)/.test(bot.source));
assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(bot.source));
const arrowBot = inspectRoute("arrow-bot/index.html");
assert.equal(arrowBot.entries.length, 2);
assert.equal(arrowBot.inline.length, 0);
assert.equal(arrowBot.css, single.css);
assert.ok(arrowBot.source.includes("grave-bot"));
assert.ok(arrowBot.source.includes("grave-arrow-left"));
assert.ok(!/grave-(arrow-right|arrow-up|arrow-up-right|arrow-down|archive|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowBot.source));
assert.deepEqual(new Set(arrowBot.chunks.keys()), new Set([...single.chunks.keys(), ...bot.chunks.keys()]));
for (const icon of [bot, arrowBot]) {
  assert.ok(!icon.source.includes("grave-arrow-up-left"), "Unused ArrowUpLeft registration must not load");
}
const attachFile = inspectRoute("attach-file-single/index.html");
assert.equal(attachFile.entries.length, 1);
assert.equal(attachFile.inline.length, 0);
assert.equal(attachFile.css, single.css, "AttachFile must reuse the same base CSS");
assert.ok(attachFile.source.includes("grave-attach-file"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up|arrow-up-right|arrow-down|archive|bot|map-pin|copy|check|at-sign|bundle-probe)/.test(attachFile.source));
assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(attachFile.source));
const arrowAttachFile = inspectRoute("arrow-attach-file/index.html");
assert.equal(arrowAttachFile.entries.length, 2);
assert.equal(arrowAttachFile.inline.length, 0);
assert.equal(arrowAttachFile.css, single.css);
assert.ok(arrowAttachFile.source.includes("grave-attach-file"));
assert.ok(arrowAttachFile.source.includes("grave-arrow-left"));
assert.ok(!/grave-(arrow-right|arrow-up|arrow-up-right|arrow-down|archive|bot|map-pin|copy|check|at-sign|bundle-probe)/.test(arrowAttachFile.source));
assert.deepEqual(new Set(arrowAttachFile.chunks.keys()), new Set([...single.chunks.keys(), ...attachFile.chunks.keys()]));
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight, arrowUp, arrows, arrowDown, arrowDownLeft, archive, arrowArchive, arrowUpRight, arrowLeftUpRight, bot, arrowBot, arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!icon.source.includes("grave-attach-file"), "Unused AttachFile behavior must not load");
}
assert.ok(!attachFile.css.includes("grave-attach-file"), "AttachFile must not add icon-specific CSS");
for (const icon of [attachFile, arrowAttachFile]) {
  assert.ok(!icon.source.includes("grave-arrow-up-left"), "Unused ArrowUpLeft registration must not load");
}



const audioLines = inspectRoute("audio-lines-single/index.html");
assert.equal(audioLines.entries.length, 1);
assert.equal(audioLines.inline.length, 0);
assert.equal(audioLines.css, single.css);
assert.ok(audioLines.source.includes("grave-audio-lines"));
assert.ok(!/grave-(arrow-left|arrow-right|arrow-up|arrow-up-right|arrow-down|archive|map-pin|copy|check|at-sign|bot|attach-file|bundle-probe)/.test(audioLines.source));
const arrowAudioLines = inspectRoute("arrow-audio-lines/index.html");
assert.equal(arrowAudioLines.entries.length, 2);
assert.equal(arrowAudioLines.inline.length, 0);
assert.equal(arrowAudioLines.css, single.css);
assert.ok(arrowAudioLines.source.includes("grave-audio-lines"));
assert.ok(arrowAudioLines.source.includes("grave-arrow-left"));
assert.ok(!/grave-(arrow-right|arrow-up|arrow-up-right|arrow-down|archive|map-pin|copy|check|at-sign|bot|attach-file|bundle-probe)/.test(arrowAudioLines.source));
assert.deepEqual(new Set(arrowAudioLines.chunks.keys()), new Set([...single.chunks.keys(), ...audioLines.chunks.keys()]));
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign, arrowRight, arrowLeftRight, arrowUp, arrows, arrowDown, arrowDownLeft, archive, arrowArchive, arrowUpRight, arrowLeftUpRight, bot, arrowBot, attachFile, arrowAttachFile, arrowUpLeft, arrowLeftUpLeft]) {
  assert.ok(!icon.source.includes("grave-audio-lines"), "Unused AudioLines behavior must not load");
}
for (const icon of [audioLines, arrowAudioLines]) {
  assert.ok(!/grave-(audio-lines|arrow-left)/.test(icon.css));
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source));
}
for (const icon of [audioLines, arrowAudioLines]) {
  assert.ok(!icon.source.includes("grave-arrow-up-left"), "Unused ArrowUpLeft registration must not load");
}
inspectRoute("index.html");
console.log("Selective loading verified: shared CSS only, unused icon behavior excluded.");

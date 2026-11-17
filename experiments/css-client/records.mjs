import assert from "node:assert/strict";
import { verifyRegistrations, clientRecipes } from "../../scripts/registration-contract.mjs";
import { decodeAttribute } from "../../scripts/html.mjs";
import { generatedCSS } from "../../scripts/css-cycles.mjs";
import { encodePaint, generatedPaintCSS } from "../../scripts/css-paint.mjs";
import { generatedOpacityCSS } from "../../scripts/css-opacity.mjs";

const css = new Map([...generatedCSS, ...generatedOpacityCSS, ...generatedPaintCSS]);
const escapeAttribute = value => JSON.stringify(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function verifyPreparedRecords(transport, actual, html, icons, context) {
  let records = 0;
  const preparedIds = [];
  const normalized = html.replace(/data-grave-(?:cycle|combined|opacity|paint)-recipe="([^"]*)"/g, (attribute, encoded) => {
    const record = JSON.parse(decodeAttribute(encoded));
    const data = transport === "attribute" ? record.data : record;
    const id = Array.isArray(data) ? data[0] : data.id;
    assert.ok(clientRecipes.has(id), context + ": known prepared recipe");
    if (transport === "attribute") assert.equal(record.css, css.get(id), context + ": exact recovery CSS for " + id);
    records++;
    preparedIds.push(id);
    return attribute.slice(0, attribute.indexOf('="') + 2) + escapeAttribute(attribute.startsWith("data-grave-paint-") ? encodePaint(data) : data) + '"';
  });
  assert.equal(records, icons.filter(id => clientRecipes.has(id)).length, context + ": every CSS host has its complete record");
  if (transport === "template") {
    const templates = [...html.matchAll(/<template\b[^>]*data-css-recovery[^>]*>([\s\S]*?)<\/template>/g)];
    assert.equal(templates.length, records, context + ": every CSS host has an inert recovery template");
    templates.forEach((template, index) => assert.equal(template[1].match(/<style\b[^>]*>([\s\S]*?)<\/style>/)?.[1], css.get(preparedIds[index]), context + ": exact inert recovery CSS"));
  }
  for (const id of new Set(preparedIds)) assert.equal([...html.matchAll(/<style\b([^>]*)>/g)].filter(([, attributes]) => attributes.includes('data-grave-cycle-style="' + id + '"')).length, 1, context + ": one active server sheet");
  verifyRegistrations(actual, normalized, icons, context);
}

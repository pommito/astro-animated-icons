import type { PaintRecipe, PaintChannel } from "./paint-recipe";

const properties = { opacity: "opacity", strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset" };
export const cssProperty = (property: PaintChannel["property"]) => properties[property];
export const trackName = (id: string, returning: boolean, index: number) => `grave-paint-${id}-${returning ? "return" : "entry"}-${index}`;

export function paintCSS(plan: PaintRecipe) {
  return [false, true].map(returning => {
    const channels = returning ? plan.returning : plan.entry;
    const frames = channels.map((channel, index) => {
      if (!properties[channel.property]) throw Error("Unsupported paint property");
      if (channel.values.length !== channel.offsets.length) throw Error("Mismatched paint offsets");
      const value = (v: PaintChannel["values"][number], frame: number) => frame === 0 ? `var(--grave-paint-from-${index})` : channel.property === "opacity" ? v
        : (v as number[]).map(coefficient => `calc(var(--grave-paint-length) * ${coefficient})`).join(" ");
      return `@keyframes ${trackName(plan.id, returning, index)}{` + channel.values.map((v, frame) =>
        `${channel.offsets[frame] * 100}%{${properties[channel.property]}:${value(v, frame)};animation-timing-function:${channel.intervalEase[frame]};}`).join("") + "}";
    }).join("");
    const targets = [...new Set(channels.map(channel => channel.target))];
    const rules = targets.map(target => {
      const selected = channels.map((channel, index) => ({ ...channel, index })).filter(channel => channel.target === target);
      return `[data-css-paint="${plan.id}"][data-paint-state="${returning ? "return" : "entry"}"] g>:nth-child(${target}){` +
        `animation-name:${selected.map(channel => trackName(plan.id, returning, channel.index)).join(",")};` +
        `animation-duration:${selected.map(channel => channel.duration + "ms").join(",")};` +
        `animation-delay:${selected.map(channel => channel.delay + "ms").join(",")};` +
        "animation-timing-function:linear;animation-fill-mode:both;}";
    }).join("");
    return frames + "@media(prefers-reduced-motion:no-preference){" + rules + "}";
  }).join("");
}

export function measurePaintTargets(plan: PaintRecipe, drawing: SVGGElement, returning = false) {
  const indices = [...new Set((returning ? plan.returning : plan.entry).filter(channel => channel.property !== "opacity").map(channel => channel.target))];
  return new Map(indices.map(index => {
    const target = drawing.children[index - 1];
    if (typeof (target as SVGGeometryElement)?.getTotalLength !== "function") throw Error("Paint target is not SVG geometry");
    const length = (target as SVGGeometryElement).getTotalLength();
    if (!Number.isFinite(length) || length < 0) throw Error("Paint target has no finite non-negative measured length");
    return [index, length];
  }));
}

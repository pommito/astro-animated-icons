const properties = { opacity: "opacity", strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset" };
export const cssProperty = property => properties[property];
export const trackName = (id, returning, index) => `proof-paint-${id}-${returning ? "return" : "entry"}-${index}`;

export function validateProofScope(plans, scoped, exceptions) {
  for (const slug of scoped) {
    if (Boolean(plans[slug]) === Boolean(exceptions[slug])) throw Error("Missing or duplicate proof outcome: " + slug);
  }
  for (const slug of [...Object.keys(plans), ...Object.keys(exceptions)]) {
    if (!scoped.includes(slug)) throw Error("Unexpected proof outcome: " + slug);
  }
  return scoped.length;
}

export function paintCSS(plan) {
  return [false, true].map(returning => {
    const channels = returning ? plan.returning : plan.entry;
    const frames = channels.map((channel, index) => {
      if (!properties[channel.property]) throw Error("Unsupported paint property");
      if (channel.values.length !== channel.offsets.length) throw Error("Mismatched paint offsets");
      const value = (v, frame) => frame === 0 ? `var(--pp-from-${index})` : channel.property === "opacity" ? v
        : v.map(coefficient => `calc(var(--pp-length) * ${coefficient})`).join(" ");
      return `@keyframes ${trackName(plan.id, returning, index)}{` + channel.values.map((v, frame) =>
        `${channel.offsets[frame] * 100}%{${properties[channel.property]}:${value(v, frame)};animation-timing-function:${channel.intervalEase[frame]};}`).join("") + "}";
    }).join("");
    const targets = [...new Set(channels.map(channel => channel.target))];
    const rules = targets.map(target => {
      const selected = channels.map((channel, index) => ({ ...channel, index })).filter(channel => channel.target === target);
      return `[data-pp-id="${plan.id}"][data-pp-state="${returning ? "return" : "entry"}"] g>:nth-child(${target}){` +
        `animation-name:${selected.map(channel => trackName(plan.id, returning, channel.index)).join(",")};` +
        `animation-duration:${selected.map(channel => channel.duration + "ms").join(",")};` +
        `animation-delay:${selected.map(channel => channel.delay + "ms").join(",")};` +
        "animation-timing-function:linear;animation-fill-mode:both;}";
    }).join("");
    return frames + "@media(prefers-reduced-motion:no-preference){" + rules + "}";
  }).join("");
}

export function measureTargets(plan, drawing) {
  const indices = [...new Set([...plan.entry, ...plan.returning].filter(channel => channel.property !== "opacity").map(channel => channel.target))];
  return new Map(indices.map(index => {
    const target = drawing.children[index - 1];
    if (typeof target?.getTotalLength !== "function") throw Error("Paint target is not SVG geometry");
    const length = target.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) throw Error("Paint target has no positive measured length");
    return [index, length];
  }));
}

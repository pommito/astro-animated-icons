import { cycleCSS } from "../../packages/animated-icons/src/shared/transform-cycle-css";
import { opacityCSS } from "../../packages/animated-icons/src/shared/opacity-css";
import { paintCSS } from "../../packages/animated-icons/src/shared/paint-css";
import { decodePaint } from "../../packages/animated-icons/src/shared/paint-data";
import { combinedFrames } from "../../packages/animated-icons/src/shared/combined-transform-cycle";

export function prepareRecipe(kind: string, data: any, locals: any) {
  const cache: Map<string, any> = locals.cssClientPrepared ??= new Map();
  const id = kind === "paint" ? data[0] : data.id;
  const key = kind + ":" + id;
  if (cache.has(key)) return cache.get(key);
  const css = kind === "paint" ? paintCSS(decodePaint(data)) : kind === "opacity" ? opacityCSS(id, data.parts) : cycleCSS(data);
  const basis = kind === "combined" ? [false, true].map(returning => {
    const base = combinedFrames(data, returning);
    const unit = combinedFrames(data, returning, data.tracks.map((track: any) => track.rest + 1));
    return { base, weights: unit.map((frame, index) => frame.map((value, channel) => value - base[index][channel])) };
  }) : undefined;
  const record = { data: kind === "paint" ? decodePaint(data) : data, css, ...(basis ? { basis } : {}) };
  cache.set(key, record);
  return record;
}

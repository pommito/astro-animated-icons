import type { PaintRecipe, PaintChannel } from "./paint-recipe";

type WireChannel = [number, number, number, number, number | string, (number | null)[], (number[] | null)?, (number | string)[]?];
export type PaintWire = [string, number, number, WireChannel[], WireChannel[]];
const properties = ["opacity", "strokeDasharray", "strokeDashoffset"];
const easings = ["ease-out", "ease-in-out", "linear", "cubic-bezier(0.25, 0.1, 0.35, 1)"];
const replays = ["restart", "active", "until-clear", "dash-incomplete", "current"];
const encodeEase = (ease: string) => easings.includes(ease) ? easings.indexOf(ease) : ease;
const decodeEase = (ease: number | string) => typeof ease === "number" ? easings[ease] : ease;

export function encodePaint(plan: PaintRecipe): PaintWire {
  const channels = (phase: PaintChannel[]): WireChannel[] => phase.map(channel => {
    if (channel.property === "strokeDasharray" && channel.values.some(value => value !== null && (!Array.isArray(value) || value.length !== 2 || value[1] !== 1))) throw Error("Paint encoding requires a unit measured gap");
    const values = channel.values.map(value => Array.isArray(value) ? value[0] : value);
    const offsets = channel.offsets.every((offset,index) => offset === index / (values.length - 1)) ? null : channel.offsets;
    const intervals = channel.intervalEase.every(ease => ease === "linear") ? null : channel.intervalEase.map(encodeEase);
    const tuple: WireChannel = [channel.target,properties.indexOf(channel.property),channel.duration,channel.delay,encodeEase(channel.ease),values];
    if (offsets || intervals) tuple.push(offsets);
    if (intervals) tuple.push(intervals);
    return tuple;
  });
  return [plan.id,Number(plan.finish === "restore"),replays.indexOf(plan.replay),channels(plan.entry),channels(plan.returning)];
}

export function decodePaint(data: PaintWire): PaintRecipe {
  const [id,finish,replay,entry,returning] = data;
  const channels = (phase: WireChannel[]): PaintChannel[] => phase.map(([target,property,duration,delay,ease,values,offsets,intervals]) => ({
    target,property:properties[property] as PaintChannel["property"],duration,delay,ease:decodeEase(ease),
    values:values.map(value => value === null || property === 0 ? value : property === 1 ? [value,1] : [value]),
    offsets:offsets ?? values.map((_value,index) => index / (values.length - 1)),
    intervalEase:intervals ? intervals.map(decodeEase) : values.map(() => "linear"),
  }));
  return { id,finish:finish ? "restore" : "hold",replay:replays[replay] as PaintRecipe["replay"],entry:channels(entry),returning:channels(returning) };
}

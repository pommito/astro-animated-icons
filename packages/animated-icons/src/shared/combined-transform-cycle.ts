import type { FiniteTransformCycle } from "./finite-transform-cycle";

export interface CombinedTransformCycle extends Omit<FiniteTransformCycle, "property" | "values" | "times"> {
  target: "svg";
  tracks: {
    property: "translateY" | "scale" | "rotate";
    values: number[];
    times: number[];
    rest: number;
  }[];
  finish: "hold";
  replay: "current";
  origin: string;
}

export function combinedDuration(cycle: CombinedTransformCycle, returning: boolean) {
  return (returning ? cycle.returnDuration ?? cycle.duration : cycle.duration) * 1000;
}

function sampledEase(progress: number, ease: CombinedTransformCycle["ease"]) {
  if (progress === 0 || progress === 1) return progress;
  const bezier = (t: number, a: number, b: number) => (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  let low = 0, high = 1, parameter: number, difference: number, iteration = 0;
  // Preserve Motion's finite subdivision precision at the original 5 ms samples.
  do {
    parameter = low + (high - low) / 2;
    difference = bezier(parameter, ease === "easeInOut" ? 0.42 : 0, 0.58) - progress;
    if (difference > 0) high = parameter; else low = parameter;
  } while (Math.abs(difference) > 0.0000001 && ++iteration < 12);
  return bezier(parameter, 0, 1);
}

export function combinedFrames(cycle: CombinedTransformCycle, returning: boolean, from = cycle.tracks.map(track => track.rest)) {
  const duration = combinedDuration(cycle, returning);
  const intervals = Math.ceil(duration / 5);
  return Array.from({ length: intervals + 1 }, (_, frame) => cycle.tracks.map((track, channel) => {
    const values = returning ? [from[channel], track.rest] : [from[channel], ...track.values.slice(1)];
    const times = returning ? [0, 1] : track.times;
    const time = frame * duration / intervals;
    let index = 0;
    while (index < values.length - 2 && time >= times[index + 1] * duration) index++;
    const progress = (time - times[index] * duration) / ((times[index + 1] - times[index]) * duration);
    const weight = sampledEase(Math.max(0, Math.min(1, progress)), returning ? cycle.returnEase ?? cycle.ease : cycle.ease);
    return values[index] + (values[index + 1] - values[index]) * weight;
  }));
}

export function combinedPose(frames: number[][], duration: number, time: number) {
  const position = Math.max(0, Math.min(frames.length - 1, time / duration * (frames.length - 1)));
  const index = Math.min(frames.length - 2, Math.floor(position));
  return frames[index].map((value, channel) => value + (frames[index + 1][channel] - value) * (position - index));
}

export function combinedTransform(cycle: CombinedTransformCycle, values: (number | string)[]) {
  return cycle.tracks.map((track, index) => track.property + "(" + values[index] +
    (typeof values[index] === "string" ? "" : track.property === "scale" ? "" : track.property === "rotate" ? "deg" : "px") + ")").join(" ");
}

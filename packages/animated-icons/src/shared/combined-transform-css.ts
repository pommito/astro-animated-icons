import { combinedFrames, combinedTransform, type CombinedTransformCycle } from "./combined-transform-cycle";

export function combinedKeyframes(cycle: CombinedTransformCycle, returning: boolean) {
  const base = combinedFrames(cycle, returning);
  const unit = combinedFrames(cycle, returning, cycle.tracks.map(track => track.rest + 1));
  const number = (value: number) => Number(value.toFixed(6));
  const rest = combinedTransform(cycle, cycle.tracks.map(track => track.rest));
  return base.map((frame, index) => {
    const values = frame.map((value, channel) => {
      const coefficient = number(unit[index][channel] - value);
      const track = cycle.tracks[channel];
      const suffix = track.property === "scale" ? "" : track.property === "rotate" ? "deg" : "px";
      if (coefficient === 0) return number(value) + suffix;
      const variable = "var(--grave-cycle-" + channel + ",0" + suffix + ")";
      if (coefficient === 1 && value === 0) return variable;
      return "calc(" + variable + " * " + coefficient + (value === 0 ? "" : " + " + number(value) + suffix) + ")";
    });
    const transform = index === 0 ? "var(--grave-cycle-from," + rest + ")" : combinedTransform(cycle, values);
    return number(index / (base.length - 1) * 100) + "%{transform:" + transform + ";}";
  }).join("");
}

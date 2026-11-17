import { combinedDuration, combinedFrames, combinedPose, type CombinedTransformCycle } from "./combined-transform-cycle";
import { ensureCombinedCycleCSS } from "./combined-cycle-css";
import { createTransformRecipe } from "./css-transform";

export function createCSSCombinedCycleRecipe(cycle: CombinedTransformCycle) {
  const poses = new WeakMap<SVGElement, { values: number[] }>();
  return createTransformRecipe(cycle, document => ensureCombinedCycleCSS(cycle, document), {
    capture(host, target, returning) {
      const pose = { values: poses.get(target)?.values ?? cycle.tracks.map(track => track.rest) };
      const frames = combinedFrames(cycle, returning, pose.values);
      poses.set(target, pose);
      cycle.tracks.forEach((channel, index) => host.style.setProperty("--grave-cycle-" + index,
        (pose.values[index] - channel.rest) + (channel.property === "scale" ? "" : channel.property === "rotate" ? "deg" : "px")));
      return {
        finish() { if (poses.get(target) === pose) pose.values = frames.at(-1)!; },
        stop(time) { if (poses.get(target) === pose) pose.values = combinedPose(frames, combinedDuration(cycle, returning), time); },
      };
    },
    clear(host, target) {
      poses.delete(target);
      cycle.tracks.forEach((_, index) => host.style.removeProperty("--grave-cycle-" + index));
    },
  });
}

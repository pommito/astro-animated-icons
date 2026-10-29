import type { CombinedTransformCycle } from "../../../../../packages/animated-icons/src/shared/combined-transform-cycle";
import { createSvgKeyframesRecipe } from "../../../../../packages/animated-icons/src/shared/svg-keyframes";

export function previousCombinedRecipe(cycle: CombinedTransformCycle) {
  const property = (value: CombinedTransformCycle["tracks"][number]["property"]) => value === "translateY" ? "y" : value;
  return createSvgKeyframesRecipe(
    Object.fromEntries(cycle.tracks.map(track => [property(track.property), track.values])),
    { duration: cycle.duration, ease: cycle.ease },
    cycle.origin,
    { duration: cycle.returnDuration ?? cycle.duration, ease: cycle.returnEase ?? cycle.ease },
    {},
    Object.fromEntries(cycle.tracks.map(track => [property(track.property), { times: track.times }])),
  );
}

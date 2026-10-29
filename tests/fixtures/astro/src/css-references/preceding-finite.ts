import type { FiniteTransformCycle } from "../../../../../packages/animated-icons/src/shared/finite-transform-cycle";
import { createGroupTransformRecipe } from "../../../../../packages/animated-icons/src/shared/group-transform";
import { createSvgPartsRecipe } from "../../../../../packages/animated-icons/src/shared/svg-parts";

export function precedingFiniteRecipe(cycle: FiniteTransformCycle) {
  if (cycle.target !== "svg") return createGroupTransformRecipe(
    cycle.property === "rotate" ? { rotate: cycle.values.at(-1)! } : { x: [null, ...cycle.values.slice(1)] },
    { duration: cycle.duration, ease: cycle.ease, times: cycle.times },
  );
  return createSvgPartsRecipe([{
    selector: "svg", origin: cycle.origin,
    variants: {
      normal: { rotate: 0, transition: { duration: cycle.returnDuration ?? cycle.duration, ease: cycle.returnEase ?? cycle.ease } },
      animate: { rotate: cycle.values, transition: { duration: cycle.duration, ease: cycle.ease, times: cycle.times } },
    },
  }]);
}

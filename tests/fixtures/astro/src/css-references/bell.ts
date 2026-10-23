import { createSvgKeyframesRecipe } from "../../../../../packages/animated-icons/src/shared/svg-keyframes";
import { bellCycle } from "../../../../../packages/animated-icons/src/icons/bell/cycle";

export const bellRecipe = {
  ...createSvgKeyframesRecipe(
    { [bellCycle.property]: bellCycle.values },
    { duration: bellCycle.duration, ease: bellCycle.ease, times: bellCycle.times },
    bellCycle.origin,
  ),
  finish: bellCycle.finish,
};

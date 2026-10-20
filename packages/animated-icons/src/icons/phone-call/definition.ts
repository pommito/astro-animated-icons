import type { IconRecipe } from "../../element";
import { createSignalRecipe } from "../../shared/signal";
import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

const pulse = createSvgKeyframesRecipe(
  { rotate: [10, 20, -10, 10, 0], scale: [1, 1.1, 1.2, 1.1, 1] },
  { duration: 0.9, ease: "easeInOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  { scale: { type: "spring", stiffness: 550, damping: 30 } },
);
const waves = createSignalRecipe([{ child: 1, delay: 0.2 }, { child: 2, delay: 0.1 }]);

export const phoneCallRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    pulse.animate(drawing, returning, track);
    waves.animate(drawing, returning, track);
  },
  clear(drawing) {
    pulse.clear(drawing);
    waves.clear(drawing);
  },
};

import type { IconRecipe } from "../../element";
import { createSteamRecipe } from "../../shared/steam";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

const smoke = createSteamRecipe([0, 0]);
const slash = createSvgPartsRecipe([{
  selector: "[data-slash]",
  variants: {
    normal: { pathLength: 1 },
    animate: { pathLength: [0, 1], transition: { duration: 0.4, ease: "linear" } },
  },
}]);

export const cigaretteOffRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    smoke.animate(drawing, returning, track);
    slash.animate(drawing, returning, track);
  },
  clear(drawing) {
    smoke.clear(drawing);
    slash.clear(drawing);
  },
};

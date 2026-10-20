import type { IconRecipe } from "../../element";
import { createWindRecipe } from "../../shared/wind";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const wind = createWindRecipe([0.2, 0.4]);

export const windArrowDownRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    wind.animate(drawing, returning, track);
    for (const path of [...drawing.children].slice(2) as SVGPathElement[]) {
      animateSvgTransform(path, returning, track, { y: [-10, 0], opacity: [0, 1] }, returning
        ? { duration: 0.3, ease: "easeInOut" }
        : { duration: 0.5, delay: 0.35, ease: "easeInOut", preservePose: "until-clear" });
    }
  },
  clear(drawing) {
    wind.clear(drawing);
    for (const path of [...drawing.children].slice(2) as SVGPathElement[]) clearSvgTransform(path);
  },
} satisfies IconRecipe;

import type { IconRecipe } from "../../element";
import { animateClockHands, clockHandsRecipe } from "../../shared/clock-hands";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const historyRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateClockHands(drawing, returning, track, -1);
    animateSvgTransform(drawing.querySelector<SVGGElement>("[data-arc]")!, returning, track,
      { rotate: -50 }, { type: "spring", stiffness: 250, damping: 25 });
  },
  clear(drawing) {
    clockHandsRecipe.clear(drawing);
    clearSvgTransform(drawing.querySelector<SVGGElement>("[data-arc]")!);
  },
} satisfies IconRecipe;

import type { IconRecipe } from "../../element";
import { clearSvgTransform } from "../../shared/svg-transform";
import { animatePen } from "../../shared/pen";

export const wifiPenRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePen(drawing.querySelector<SVGElement>('[data-motion="0"]')!, returning, track);
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;

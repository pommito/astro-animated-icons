import type { IconRecipe } from "../../element";
import { animateBlink, clearBlink } from "../../shared/blink";

export const folderDotRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateBlink(drawing.querySelector<SVGElement>('[data-motion="0"]')!, returning, track);
  },
  clear(drawing) {
    clearBlink(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;

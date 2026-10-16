import type { IconRecipe } from "../../element";
import { animateBlink, clearBlink } from "../../shared/blink";

export const monitorRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    animateBlink(drawing.querySelector("rect")!, returning, track);
  },
  clear(drawing) {
    clearBlink(drawing.querySelector("rect")!);
  },
} satisfies IconRecipe;

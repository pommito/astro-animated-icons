import type { IconRecipe } from "../../element";
import { createPathRevealRecipe } from "../../shared/path-reveal";

export const dropletRecipe = {
  ...createPathRevealRecipe([
    { duration: 0.6, delay: 0.2, ease: "easeOut", opacityDuration: 0.6, pathOffset: 1, preservePose: "until-clear" },
  ]),
  finish: "restore",
} satisfies IconRecipe;

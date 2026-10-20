import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { animatePathMorph, clearPathMorph } from "../../shared/path-morph";

const fire = [
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "M4.5 16.5c-1.5 1.26-3 5.5-3 5.5s4.74-1 6-2.5c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "M4.5 16.5c-1.5 1.26-2.2 4.8-2.2 4.8s3.94-0.3 5.2-1.8c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "M4.5 16.5c-1.5 1.26-2.8 5.2-2.8 5.2s4.54-0.7 5.8-2.2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
];

export const rocketRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.ownerSVGElement!, returning, track, {
      x: [0, 0, -3, 2, -2, 1, -1, 0], y: [0, -3, 0, -2, -3, -1, -2, 0],
    }, returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : {
      duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    });
    animatePathMorph(drawing.querySelector("path")!, returning ? fire[0] : fire, track, returning
      ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] }
      : { duration: 2, ease: [0.4, 0, 0.2, 1], repeat: Infinity, times: [0, 0.2, 0.5, 0.8, 1] });
  },
  clear(drawing) {
    clearSvgTransform(drawing.ownerSVGElement!);
    clearPathMorph(drawing.querySelector("path")!, fire[0]);
  },
};

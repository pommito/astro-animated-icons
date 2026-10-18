import { animate, svgEffect } from "motion";
import type { IconRecipe } from "../../element";

const endpoints = [
  { normal: { x2: 14 }, animate: { x2: 10 } },
  { normal: { x1: 10 }, animate: { x1: 5 } },
  { normal: { x2: 12 }, animate: { x2: 18 } },
  { normal: { x1: 8 }, animate: { x1: 13 } },
  { normal: { x2: 12 }, animate: { x2: 4 } },
  { normal: { x1: 16 }, animate: { x1: 8 } },
  { normal: { x1: 14, x2: 14 }, animate: { x1: 9, x2: 9 } },
  { normal: { x1: 8, x2: 8 }, animate: { x1: 14, x2: 14 } },
  { normal: { x1: 16, x2: 16 }, animate: { x1: 8, x2: 8 } },
];

export const slidersHorizontalRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("line").forEach((line, index) => {
      track((onComplete) => {
        const animation = animate(line, returning ? endpoints[index].normal : endpoints[index].animate, {
          type: "spring", stiffness: 100, damping: 12, mass: 0.4, onComplete,
        });
        // Attribute cancellation must keep the current pose instead of rewinding it.
        return { stop: () => animation.stop(), cancel: () => animation.stop() };
      });
    });
  },
  clear(drawing) {
    drawing.querySelectorAll("line").forEach((line, index) => {
      svgEffect.state(line)?.release();
      for (const [attribute, value] of Object.entries(endpoints[index].normal)) {
        line.setAttribute(attribute, String(value));
      }
    });
  },
} satisfies IconRecipe;

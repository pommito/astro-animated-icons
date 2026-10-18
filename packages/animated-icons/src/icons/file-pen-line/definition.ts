import type { IconRecipe } from "../../element";
import { animate } from "motion/mini";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const restingLine = "M8 18h1";

export const filePenLineRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const pen = drawing.querySelector<SVGPathElement>('[data-motion="0"]')!;
    animateSvgTransform(pen, returning, track,
      { rotate: [-0.3, 0.2, -0.4], x: [0, -0.5, 1, 0], y: [0, 1, -0.5, 0] },
      returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 0.5, repeat: 1, ease: "easeInOut" },
    );
    track((onComplete) => animate(drawing.querySelector<SVGPathElement>('[data-motion="1"]')!,
      { d: `path("${returning ? restingLine : "M8 18h5"}")` },
      { duration: 0.5, ease: "easeOut", onComplete },
    ));
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGPathElement>('[data-motion="0"]')!);
    drawing.querySelector<SVGPathElement>('[data-motion="1"]')!.style.removeProperty("d");
  },
} satisfies IconRecipe;

import type { IconRecipe } from "../../element";
import { animate } from "motion/mini";
import { clearSvgTransform } from "../../shared/svg-transform";
import { animatePen } from "../../shared/pen";

const restingLine = "M8 18h1";

export const filePenLineRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const pen = drawing.querySelector<SVGPathElement>('[data-motion="0"]')!;
    animatePen(pen, returning, track);
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

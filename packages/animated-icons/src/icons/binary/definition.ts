import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const binaryRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll<SVGElement>("[data-motion]").forEach((glyph, index) => {
      const incoming = index % 2 === 1;
      const hidden = returning ? incoming : !incoming;
      animateSvgTransform(glyph, false, track, {
        rotateX: [glyph.style.transform ? null : incoming ? 90 : 0, hidden ? incoming ? 90 : -90 : 0],
        opacity: [glyph.style.opacity ? null : incoming ? 0 : 1, hidden ? 0 : 1],
      }, { duration: 0.12, ease: "easeOut", delay: Math.floor(index / 2) * 0.06 + (hidden ? 0 : 0.12) });
    });
  },
  clear(drawing) { drawing.querySelectorAll<SVGElement>("[data-motion]").forEach(clearSvgTransform); },
} satisfies IconRecipe;

import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createPhoneSymbolRecipe(
  scale: number,
  symbol: Parameters<typeof animateSvgTransform>[3],
): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const handset = drawing.children[1] as SVGElement;
      const group = drawing.children[0] as SVGElement;
      animateSvgTransform(handset, returning, track, { scale: [handset.style.transform ? null : 1, scale, 1] },
        returning ? { type: "spring", stiffness: 550, damping: 30 } : { duration: 0.9, ease: "easeInOut" });
      const targets = Object.fromEntries(Object.entries(symbol).map(([property, values]) => [property,
        group.style.transform && Array.isArray(values) ? [null, ...values.slice(1)] : values,
      ]));
      animateSvgTransform(group, returning, track, targets,
        returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.8, ease: "easeInOut" },
        returning ? { scale: { type: "spring", stiffness: 550, damping: 30 } } : {});
    },
    clear(drawing) {
      [...drawing.children].forEach(shape => clearSvgTransform(shape as SVGElement));
    },
  };
}

import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const sprayCanRecipe = createSvgPartsRecipe(Array.from({ length: 6 }, (_, index) => ({
  selector: `[data-dot='${index}']`,
  variants: {
    normal: { opacity: 1, transition: { duration: 0.2 } },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        delay: index * 0.07, duration: 1.05 + index * 0.06,
        repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 1],
      },
    },
  },
})));

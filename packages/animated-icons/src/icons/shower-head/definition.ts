import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const showerHeadRecipe = createSvgPartsRecipe(Array.from({ length: 7 }, (_, index) => ({
  selector: `[data-drop='${index}']`,
  variants: {
    normal: { opacity: 1 },
    animate: {
      opacity: [1, 0.2, 1],
      transition: { delay: index * 0.2, duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
})));

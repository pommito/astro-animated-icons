import { createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const dots: SvgPart[] = [0, 1, 2, 3].map(index => ({
  selector: `[data-part='${index + 1}']`,
  variants: {
    normal: { scale: 1, transition: { duration: 0.2 } },
    animate: { scale: [0, 1], transition: { type: "spring", stiffness: 300, damping: 10, delay: 0.45 + index * 0.08 } },
  },
}));

export const paletteRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { strokeDashoffset: 0 },
      animate: { strokeDashoffset: [70, 0], transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } },
    },
  },
  ...dots,
]);

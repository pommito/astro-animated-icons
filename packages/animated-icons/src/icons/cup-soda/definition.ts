import { createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const bubbles: SvgPart[] = [0, 0.35, 0.7, 1.05, 0.55].map((delay, index) => ({
  selector: `[data-part='${4 + index}']`,
  variants: {
    normal: { opacity: 0, y: 0, scale: 1 },
    animate: {
      opacity: [0, 0.9, 0.4, 0], y: [0, -3, -10, -14], scale: [1, 1, 0.85, 0.6],
      transition: {
        duration: 1.5, ease: [0.42, 0, 1, 1], delay, repeat: Infinity,
        times: [0, 0.08, 0.7, 1],
      },
    },
  },
}));

export const cupSodaRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='2']",
    variants: {
      normal: { y: 0, transition: { duration: 0.25, ease: "easeOut" } },
      animate: { y: [0, -1, 0], transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-part='3']",
    variants: {
      normal: { y: 0, scaleY: 1, transition: { duration: 0.25, ease: "easeOut" } },
      animate: {
        y: [0, -0.85, 0.15, 0], scaleY: [1, 1.06, 0.99, 1],
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.35, 0.65, 1] },
      },
    },
  },
  ...bubbles,
]);

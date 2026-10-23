import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const alarmSmokeRecipe = createSvgPartsRecipe([
  {
    selector: "[data-smoke]",
    variants: {
      normal: { y: 0, opacity: 1 },
      animate: {
        y: [6, 0], opacity: [0, 1, 0],
        transition: { duration: 1.4, ease: "easeOut", repeat: Infinity },
      },
    },
  },
  {
    selector: "[data-alarm]",
    variants: {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.2, repeat: Infinity },
      },
    },
  },
]);

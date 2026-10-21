import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const calendarDaysRecipe = createSvgPartsRecipe(Array.from({ length: 6 }, (_, index) => ({
  selector: `[data-part='${index}']`,
  variants: {
    normal: { opacity: 1, transition: { duration: 0.2 } },
    animate: { opacity: [1, 0.3, 1], transition: { delay: index * 0.1, duration: 0.4, times: [0, 0.5, 1] } },
  },
})));

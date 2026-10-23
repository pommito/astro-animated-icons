import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const boxesRecipe = createSvgPartsRecipe([
  { selector: "[data-part='0']", variants: { normal: { translateX: 0, y: 0 }, animate: { translateX: -1.5, y: 1.5 } } },
  { selector: "[data-part='1']", variants: { normal: { translateX: 0, y: 0 }, animate: { translateX: 1.5, y: 1.5 } } },
  { selector: "[data-part='2']", variants: { normal: { translateX: 0, y: 0 }, animate: { translateX: 0, y: -1.5 } } },
]);

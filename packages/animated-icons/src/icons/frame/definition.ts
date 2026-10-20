import { createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const parts: SvgPart[] = [{ y: -4 }, { y: 4 }, { translateX: -4 }, { translateX: 4 }].map((pose, index) => ({
  selector: `[data-part='${index}']`,
  transition: { type: "spring", stiffness: 160, damping: 17, mass: 1 },
  variants: { normal: { translateX: 0, rotate: 0, y: 0 }, animate: pose },
}));

export const frameRecipe = createSvgPartsRecipe(parts);

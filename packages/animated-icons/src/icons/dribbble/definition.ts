import { activityVariants } from "../../shared/activity";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const dribbbleRecipe = createSvgPartsRecipe([{ selector: "circle, path", variants: activityVariants }]);

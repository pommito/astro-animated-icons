import { activityVariants } from "../../shared/activity";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const instagramRecipe = createSvgPartsRecipe([{ selector: "rect, path, line", variants: activityVariants }]);

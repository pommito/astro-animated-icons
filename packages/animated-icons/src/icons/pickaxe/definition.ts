import { createSvgPartsRecipe } from "../../shared/svg-parts";
import { toolSwingVariants } from "../../shared/tool-swing";

export const pickaxeRecipe = createSvgPartsRecipe([{
  selector: "svg", origin: "0% 100%", transformBox: "fill-box", variants: toolSwingVariants,
}]);

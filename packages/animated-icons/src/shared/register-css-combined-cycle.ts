import type { CombinedTransformCycle } from "./combined-transform-cycle";
import { createCSSCombinedCycleRecipe } from "./css-combined-cycle";
import { registerCSSRecipes } from "./register-css";

registerCSSRecipes<CombinedTransformCycle>("data-grave-combined-recipe", createCSSCombinedCycleRecipe);

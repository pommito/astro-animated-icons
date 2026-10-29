import type { TransformCycle } from "./finite-transform-cycle";
import { createCSSCycleRecipe } from "./css-cycle";
import { registerCSSRecipes } from "./register-css";

registerCSSRecipes<TransformCycle>("data-grave-cycle-recipe", createCSSCycleRecipe);

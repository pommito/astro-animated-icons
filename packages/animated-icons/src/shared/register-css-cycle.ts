import type { FiniteTransformCycle } from "./finite-transform-cycle";
import { createCSSCycleRecipe } from "./css-cycle";
import { registerCSSRecipes } from "./register-css";

registerCSSRecipes<FiniteTransformCycle>("data-grave-cycle-recipe", createCSSCycleRecipe);

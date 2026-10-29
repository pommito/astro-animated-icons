import type { OpacityPart } from "./opacity-parts";
import { createCSSOpacityRecipe } from "./css-opacity";
import { registerCSSRecipes } from "./register-css";

registerCSSRecipes<{ id: string; parts: OpacityPart[] }>("data-grave-opacity-recipe", data => createCSSOpacityRecipe(data.id, data.parts));

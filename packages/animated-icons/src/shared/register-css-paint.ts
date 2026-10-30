import { createCSSPaintRecipe } from "./css-paint";
import { decodePaint, type PaintWire } from "./paint-data";
import { registerCSSRecipes } from "./register-css";

registerCSSRecipes<PaintWire>("data-grave-paint-recipe", data => createCSSPaintRecipe(decodePaint(data)));

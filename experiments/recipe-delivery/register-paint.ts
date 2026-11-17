import { createCSSPaintRecipe } from "../../packages/animated-icons/src/shared/css-paint";
import { decodePaint, type PaintWire } from "../../packages/animated-icons/src/shared/paint-data";
import { registerDeliveryProof } from "./register";
registerDeliveryProof<PaintWire>("data-grave-paint-recipe", data => createCSSPaintRecipe(decodePaint(data)));

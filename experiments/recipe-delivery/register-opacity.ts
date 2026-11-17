import { createCSSOpacityRecipe } from "../../packages/animated-icons/src/shared/css-opacity";
import type { OpacityPart } from "../../packages/animated-icons/src/shared/opacity-parts";
import { registerDeliveryProof } from "./register";
registerDeliveryProof<{ id: string; parts: OpacityPart[] }>("data-grave-opacity-recipe", data => createCSSOpacityRecipe(data.id, data.parts));

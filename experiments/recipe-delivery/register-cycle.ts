import { createCSSCycleRecipe } from "../../packages/animated-icons/src/shared/css-cycle";
import type { TransformCycle } from "../../packages/animated-icons/src/shared/finite-transform-cycle";
import { registerDeliveryProof } from "./register";
registerDeliveryProof<TransformCycle>("data-grave-cycle-recipe", createCSSCycleRecipe);

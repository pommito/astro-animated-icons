import { createPhoneSymbolRecipe } from "../../shared/phone-symbol";

export const phoneIncomingRecipe = createPhoneSymbolRecipe(1.1, {
  scale: [1, 1.2, 1], translateX: [0, -1, 0], y: [0, 1, 0],
});

import { createSignalRecipe } from "../../shared/signal";

export const smartphoneNfcRecipe = createSignalRecipe([
  { child: 2, delay: 0 }, { child: 3, delay: 0.1 }, { child: 4, delay: 0.2 },
]);

import { createSignalRecipe } from "../../shared/signal";

export const radioTowerRecipe = createSignalRecipe([{ child: 1, delay: 0.1 }, { child: 2, delay: 0 }, { child: 4, delay: 0 }, { child: 5, delay: 0.1 }]);

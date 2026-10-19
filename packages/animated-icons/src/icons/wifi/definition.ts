import { createSignalRecipe } from "../../shared/signal";

export const wifiRecipe = createSignalRecipe([{ child: 2, delay: 0.1 }, { child: 3, delay: 0.2 }, { child: 4, delay: 0.3 }], 0.2, true);

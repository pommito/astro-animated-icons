import { createMapPinSymbolRecipe } from "../../shared/map-pin-symbol";

export const mapPinPlusRecipe = createMapPinSymbolRecipe([
  { child: 2, delay: 0.6, duration: 0.2 },
  { child: 3, delay: 0.3, duration: 0.2 },
]);

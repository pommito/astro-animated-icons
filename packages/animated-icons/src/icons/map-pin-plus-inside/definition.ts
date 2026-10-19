import { createMapPinSymbolRecipe } from "../../shared/map-pin-symbol";

export const mapPinPlusInsideRecipe = createMapPinSymbolRecipe([
  { child: 1, delay: 0.6, duration: 0.2 },
  { child: 2, delay: 0.3, duration: 0.2 },
]);

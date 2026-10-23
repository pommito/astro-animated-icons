import { createIconElement, type IconHandle } from "../../element";
import { trendingUpDownRecipe } from "./definition";

export type TrendingUpDownIconHandle = IconHandle;

const TrendingUpDownElement = createIconElement(trendingUpDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-trending-up-down": InstanceType<typeof TrendingUpDownElement>;
  }
}

if (!customElements.get("grave-trending-up-down")) {
  customElements.define("grave-trending-up-down", TrendingUpDownElement);
}

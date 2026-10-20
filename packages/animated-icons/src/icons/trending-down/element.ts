import { createIconElement, type IconHandle } from "../../element";
import { trendingDownRecipe } from "./definition";

export type TrendingDownIconHandle = IconHandle;

const TrendingDownElement = createIconElement(trendingDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-trending-down": InstanceType<typeof TrendingDownElement>;
  }
}

if (!customElements.get("grave-trending-down")) {
  customElements.define("grave-trending-down", TrendingDownElement);
}

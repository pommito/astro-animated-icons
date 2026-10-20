import { createIconElement, type IconHandle } from "../../element";
import { trendingUpRecipe } from "./definition";

export type TrendingUpIconHandle = IconHandle;

const TrendingUpElement = createIconElement(trendingUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-trending-up": InstanceType<typeof TrendingUpElement>;
  }
}

if (!customElements.get("grave-trending-up")) {
  customElements.define("grave-trending-up", TrendingUpElement);
}

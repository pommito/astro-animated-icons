import { createIconElement, type IconHandle } from "../../element";
import { chartBarIncreasingRecipe } from "./definition";

export type ChartBarIncreasingIconHandle = IconHandle;

const ChartBarIncreasingElement = createIconElement(chartBarIncreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-bar-increasing": InstanceType<typeof ChartBarIncreasingElement>;
  }
}

if (!customElements.get("grave-chart-bar-increasing")) {
  customElements.define("grave-chart-bar-increasing", ChartBarIncreasingElement);
}

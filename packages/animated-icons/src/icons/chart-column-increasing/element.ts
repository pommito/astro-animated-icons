import { createIconElement, type IconHandle } from "../../element";
import { chartColumnIncreasingRecipe } from "./definition";

export type ChartColumnIncreasingIconHandle = IconHandle;

const ChartColumnIncreasingElement = createIconElement(chartColumnIncreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-column-increasing": InstanceType<typeof ChartColumnIncreasingElement>;
  }
}

if (!customElements.get("grave-chart-column-increasing")) {
  customElements.define("grave-chart-column-increasing", ChartColumnIncreasingElement);
}

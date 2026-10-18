import { createIconElement, type IconHandle } from "../../element";
import { chartColumnDecreasingRecipe } from "./definition";

export type ChartColumnDecreasingIconHandle = IconHandle;

const ChartColumnDecreasingElement = createIconElement(chartColumnDecreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-column-decreasing": InstanceType<typeof ChartColumnDecreasingElement>;
  }
}

if (!customElements.get("grave-chart-column-decreasing")) {
  customElements.define("grave-chart-column-decreasing", ChartColumnDecreasingElement);
}

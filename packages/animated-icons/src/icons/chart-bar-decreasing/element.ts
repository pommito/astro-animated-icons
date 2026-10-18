import { createIconElement, type IconHandle } from "../../element";
import { chartBarDecreasingRecipe } from "./definition";

export type ChartBarDecreasingIconHandle = IconHandle;

const ChartBarDecreasingElement = createIconElement(chartBarDecreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-bar-decreasing": InstanceType<typeof ChartBarDecreasingElement>;
  }
}

if (!customElements.get("grave-chart-bar-decreasing")) {
  customElements.define("grave-chart-bar-decreasing", ChartBarDecreasingElement);
}

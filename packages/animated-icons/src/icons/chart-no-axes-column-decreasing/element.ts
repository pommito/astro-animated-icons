import { createIconElement, type IconHandle } from "../../element";
import { chartNoAxesColumnDecreasingRecipe } from "./definition";

export type ChartNoAxesColumnDecreasingIconHandle = IconHandle;

const ChartNoAxesColumnDecreasingElement = createIconElement(chartNoAxesColumnDecreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-no-axes-column-decreasing": InstanceType<typeof ChartNoAxesColumnDecreasingElement>;
  }
}

if (!customElements.get("grave-chart-no-axes-column-decreasing")) {
  customElements.define("grave-chart-no-axes-column-decreasing", ChartNoAxesColumnDecreasingElement);
}

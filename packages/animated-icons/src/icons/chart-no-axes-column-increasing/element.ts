import { createIconElement, type IconHandle } from "../../element";
import { chartNoAxesColumnIncreasingRecipe } from "./definition";

export type ChartNoAxesColumnIncreasingIconHandle = IconHandle;

const ChartNoAxesColumnIncreasingElement = createIconElement(chartNoAxesColumnIncreasingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-no-axes-column-increasing": InstanceType<typeof ChartNoAxesColumnIncreasingElement>;
  }
}

if (!customElements.get("grave-chart-no-axes-column-increasing")) {
  customElements.define("grave-chart-no-axes-column-increasing", ChartNoAxesColumnIncreasingElement);
}

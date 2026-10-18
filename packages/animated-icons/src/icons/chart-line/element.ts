import { createIconElement, type IconHandle } from "../../element";
import { chartLineRecipe } from "./definition";

export type ChartLineIconHandle = IconHandle;

const ChartLineElement = createIconElement(chartLineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-line": InstanceType<typeof ChartLineElement>;
  }
}

if (!customElements.get("grave-chart-line")) {
  customElements.define("grave-chart-line", ChartLineElement);
}

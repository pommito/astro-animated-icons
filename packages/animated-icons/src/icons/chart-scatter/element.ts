import { createIconElement, type IconHandle } from "../../element";
import { chartScatterRecipe } from "./definition";

export type ChartScatterIconHandle = IconHandle;

const ChartScatterElement = createIconElement(chartScatterRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-scatter": InstanceType<typeof ChartScatterElement>;
  }
}

if (!customElements.get("grave-chart-scatter")) {
  customElements.define("grave-chart-scatter", ChartScatterElement);
}

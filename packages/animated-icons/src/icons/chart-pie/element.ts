import { createIconElement, type IconHandle } from "../../element";
import { chartPieRecipe } from "./definition";

export type ChartPieIconHandle = IconHandle;

const ChartPieElement = createIconElement(chartPieRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-pie": InstanceType<typeof ChartPieElement>;
  }
}

if (!customElements.get("grave-chart-pie")) {
  customElements.define("grave-chart-pie", ChartPieElement);
}

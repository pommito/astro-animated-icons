import { createIconElement, type IconHandle } from "../../element";
import { chartSplineRecipe } from "./definition";

export type ChartSplineIconHandle = IconHandle;

const ChartSplineElement = createIconElement(chartSplineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chart-spline": InstanceType<typeof ChartSplineElement>;
  }
}

if (!customElements.get("grave-chart-spline")) {
  customElements.define("grave-chart-spline", ChartSplineElement);
}

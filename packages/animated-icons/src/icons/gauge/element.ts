import { createIconElement, type IconHandle } from "../../element";
import { gaugeRecipe } from "./definition";

export type GaugeIconHandle = IconHandle;
const GaugeElement = createIconElement(gaugeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gauge": InstanceType<typeof GaugeElement>;
  }
}

if (!customElements.get("grave-gauge")) {
  customElements.define("grave-gauge", GaugeElement);
}

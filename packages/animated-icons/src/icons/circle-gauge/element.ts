import { createIconElement, type IconHandle } from "../../element";
import { circleGaugeRecipe } from "./definition";

export type CircleGaugeIconHandle = IconHandle;
const CircleGaugeElement = createIconElement(circleGaugeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-gauge": InstanceType<typeof CircleGaugeElement>;
  }
}

if (!customElements.get("grave-circle-gauge")) {
  customElements.define("grave-circle-gauge", CircleGaugeElement);
}

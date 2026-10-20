import { createIconElement, type IconHandle } from "../../element";
import { circleCheckRecipe } from "./definition";

export type CircleCheckIconHandle = IconHandle;

const CircleCheckElement = createIconElement(circleCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-check": InstanceType<typeof CircleCheckElement>;
  }
}

if (!customElements.get("grave-circle-check")) {
  customElements.define("grave-circle-check", CircleCheckElement);
}

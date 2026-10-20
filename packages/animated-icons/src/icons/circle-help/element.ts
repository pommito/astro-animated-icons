import { createIconElement, type IconHandle } from "../../element";
import { circleHelpRecipe } from "./definition";

export type CircleHelpIconHandle = IconHandle;

const CircleHelpElement = createIconElement(circleHelpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-help": InstanceType<typeof CircleHelpElement>;
  }
}

if (!customElements.get("grave-circle-help")) {
  customElements.define("grave-circle-help", CircleHelpElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { fanRecipe } from "./definition";

export type FanIconHandle = IconHandle;

const FanElement = createIconElement(fanRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-fan": InstanceType<typeof FanElement>;
  }
}

if (!customElements.get("grave-fan")) {
  customElements.define("grave-fan", FanElement);
}

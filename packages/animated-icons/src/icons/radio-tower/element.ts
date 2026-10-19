import { createIconElement } from "../../element";
import { radioTowerRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RadioTowerIconHandle = IconHandle;

const RadioTowerElement = createIconElement(radioTowerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-radio-tower": InstanceType<typeof RadioTowerElement>;
  }
}

if (!customElements.get("grave-radio-tower")) {
  customElements.define("grave-radio-tower", RadioTowerElement);
}

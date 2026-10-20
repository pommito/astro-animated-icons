import { createIconElement, type IconHandle } from "../../element";
import { angryRecipe } from "./definition";

export type AngryIconHandle = IconHandle;
const AngryElement = createIconElement(angryRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-angry": InstanceType<typeof AngryElement>;
  }
}

if (!customElements.get("grave-angry")) {
  customElements.define("grave-angry", AngryElement);
}

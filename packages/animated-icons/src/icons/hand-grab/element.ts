import { createIconElement, type IconHandle } from "../../element";
import { handGrabRecipe } from "./definition";

export type HandGrabIconHandle = IconHandle;
const HandGrabElement = createIconElement(handGrabRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-grab": InstanceType<typeof HandGrabElement>;
  }
}

if (!customElements.get("grave-hand-grab")) {
  customElements.define("grave-hand-grab", HandGrabElement);
}

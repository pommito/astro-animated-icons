import { createIconElement, type IconHandle } from "../../element";
import { smileRecipe } from "./definition";

export type SmileIconHandle = IconHandle;
const SmileElement = createIconElement(smileRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-smile": InstanceType<typeof SmileElement>;
  }
}

if (!customElements.get("grave-smile")) {
  customElements.define("grave-smile", SmileElement);
}

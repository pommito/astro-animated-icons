import { createIconElement, type IconHandle } from "../../element";
import { handHeartRecipe } from "./definition";

export type HandHeartIconHandle = IconHandle;
const HandHeartElement = createIconElement(handHeartRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-heart": InstanceType<typeof HandHeartElement>;
  }
}

if (!customElements.get("grave-hand-heart")) {
  customElements.define("grave-hand-heart", HandHeartElement);
}

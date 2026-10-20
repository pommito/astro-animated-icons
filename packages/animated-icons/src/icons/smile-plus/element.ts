import { createIconElement, type IconHandle } from "../../element";
import { smilePlusRecipe } from "./definition";

export type SmilePlusIconHandle = IconHandle;
const SmilePlusElement = createIconElement(smilePlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-smile-plus": InstanceType<typeof SmilePlusElement>;
  }
}

if (!customElements.get("grave-smile-plus")) {
  customElements.define("grave-smile-plus", SmilePlusElement);
}

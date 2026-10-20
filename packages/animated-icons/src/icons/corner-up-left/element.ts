import { createIconElement, type IconHandle } from "../../element";
import { cornerUpLeftRecipe } from "./definition";

export type CornerUpLeftIconHandle = IconHandle;

const CornerUpLeftElement = createIconElement(cornerUpLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-up-left": InstanceType<typeof CornerUpLeftElement>;
  }
}

if (!customElements.get("grave-corner-up-left")) {
  customElements.define("grave-corner-up-left", CornerUpLeftElement);
}

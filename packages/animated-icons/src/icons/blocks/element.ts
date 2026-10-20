import { createIconElement, type IconHandle } from "../../element";
import { blocksRecipe } from "./definition";

export type BlocksIconHandle = IconHandle;

const BlocksElement = createIconElement(blocksRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-blocks": InstanceType<typeof BlocksElement>;
  }
}

if (!customElements.get("grave-blocks")) {
  customElements.define("grave-blocks", BlocksElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { shredderRecipe } from "./definition";

export type ShredderIconHandle = IconHandle;
const ShredderElement = createIconElement(shredderRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-shredder": InstanceType<typeof ShredderElement>;
  }
}

if (!customElements.get("grave-shredder")) {
  customElements.define("grave-shredder", ShredderElement);
}

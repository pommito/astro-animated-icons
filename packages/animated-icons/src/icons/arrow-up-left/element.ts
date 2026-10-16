import { createIconElement } from "../../element";
import { arrowUpLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowUpLeftIconHandle = IconHandle;

const ArrowUpLeftElement = createIconElement(arrowUpLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up-left": InstanceType<typeof ArrowUpLeftElement>;
  }
}

if (!customElements.get("grave-arrow-up-left")) {
  customElements.define("grave-arrow-up-left", ArrowUpLeftElement);
}

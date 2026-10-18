import { createIconElement } from "../../element";
import { plusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type PlusIconHandle = IconHandle;

const PlusElement = createIconElement(plusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-plus": InstanceType<typeof PlusElement>;
  }
}

if (!customElements.get("grave-plus")) {
  customElements.define("grave-plus", PlusElement);
}

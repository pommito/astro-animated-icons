import { createIconElement } from "../../element";
import { contrastRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ContrastIconHandle = IconHandle;

const ContrastElement = createIconElement(contrastRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-contrast": InstanceType<typeof ContrastElement>;
  }
}

if (!customElements.get("grave-contrast")) {
  customElements.define("grave-contrast", ContrastElement);
}

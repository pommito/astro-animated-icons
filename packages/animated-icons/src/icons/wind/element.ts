import { createIconElement } from "../../element";
import { windRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WindIconHandle = IconHandle;

const WindElement = createIconElement(windRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wind": InstanceType<typeof WindElement>;
  }
}

if (!customElements.get("grave-wind")) {
  customElements.define("grave-wind", WindElement);
}

import { createIconElement } from "../../element";
import { eyeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type EyeIconHandle = IconHandle;

const EyeElement = createIconElement(eyeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-eye": InstanceType<typeof EyeElement>;
  }
}

if (!customElements.get("grave-eye")) {
  customElements.define("grave-eye", EyeElement);
}

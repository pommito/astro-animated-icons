import { createIconElement } from "../../element";
import { eyeOffRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type EyeOffIconHandle = IconHandle;

const EyeOffElement = createIconElement(eyeOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-eye-off": InstanceType<typeof EyeOffElement>;
  }
}

if (!customElements.get("grave-eye-off")) {
  customElements.define("grave-eye-off", EyeOffElement);
}

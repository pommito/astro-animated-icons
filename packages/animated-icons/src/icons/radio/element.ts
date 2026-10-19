import { createIconElement } from "../../element";
import { radioRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RadioIconHandle = IconHandle;

const RadioElement = createIconElement(radioRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-radio": InstanceType<typeof RadioElement>;
  }
}

if (!customElements.get("grave-radio")) {
  customElements.define("grave-radio", RadioElement);
}

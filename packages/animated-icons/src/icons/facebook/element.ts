import { createIconElement } from "../../element";
import { facebookRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FacebookIconHandle = IconHandle;

const FacebookElement = createIconElement(facebookRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-facebook": InstanceType<typeof FacebookElement>;
  }
}

if (!customElements.get("grave-facebook")) {
  customElements.define("grave-facebook", FacebookElement);
}

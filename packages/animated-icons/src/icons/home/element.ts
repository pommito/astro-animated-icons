import { createIconElement } from "../../element";
import { homeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type HomeIconHandle = IconHandle;

const HomeElement = createIconElement(homeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-home": InstanceType<typeof HomeElement>;
  }
}

if (!customElements.get("grave-home")) {
  customElements.define("grave-home", HomeElement);
}

import { createIconElement } from "../../element";
import { sunRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SunIconHandle = IconHandle;

const SunElement = createIconElement(sunRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sun": InstanceType<typeof SunElement>;
  }
}

if (!customElements.get("grave-sun")) {
  customElements.define("grave-sun", SunElement);
}

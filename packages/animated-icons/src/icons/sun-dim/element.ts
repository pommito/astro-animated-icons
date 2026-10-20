import { createIconElement } from "../../element";
import { sunDimRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SunDimIconHandle = IconHandle;

const SunDimElement = createIconElement(sunDimRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sun-dim": InstanceType<typeof SunDimElement>;
  }
}

if (!customElements.get("grave-sun-dim")) {
  customElements.define("grave-sun-dim", SunDimElement);
}

import { createIconElement } from "../../element";
import { flameRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FlameIconHandle = IconHandle;

const FlameElement = createIconElement(flameRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-flame": InstanceType<typeof FlameElement>;
  }
}

if (!customElements.get("grave-flame")) {
  customElements.define("grave-flame", FlameElement);
}

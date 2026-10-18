import { createIconElement } from "../../element";
import { slidersHorizontalRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SlidersHorizontalIconHandle = IconHandle;

const SlidersHorizontalElement = createIconElement(slidersHorizontalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sliders-horizontal": InstanceType<typeof SlidersHorizontalElement>;
  }
}

if (!customElements.get("grave-sliders-horizontal")) {
  customElements.define("grave-sliders-horizontal", SlidersHorizontalElement);
}

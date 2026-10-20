import { createIconElement, type IconHandle } from "../../element";
import { shrinkRecipe } from "./definition";

export type ShrinkIconHandle = IconHandle;

const ShrinkElement = createIconElement(shrinkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-shrink": InstanceType<typeof ShrinkElement>;
  }
}

if (!customElements.get("grave-shrink")) {
  customElements.define("grave-shrink", ShrinkElement);
}

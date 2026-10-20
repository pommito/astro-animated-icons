import { createIconElement, type IconHandle } from "../../element";
import { circleDashedRecipe } from "./definition";

export type CircleDashedIconHandle = IconHandle;

const CircleDashedElement = createIconElement(circleDashedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-dashed": InstanceType<typeof CircleDashedElement>;
  }
}

if (!customElements.get("grave-circle-dashed")) {
  customElements.define("grave-circle-dashed", CircleDashedElement);
}

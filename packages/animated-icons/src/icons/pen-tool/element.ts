import { createIconElement, type IconHandle } from "../../element";
import { penToolRecipe } from "./definition";

export type PenToolIconHandle = IconHandle;
const PenToolElement = createIconElement(penToolRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-pen-tool": InstanceType<typeof PenToolElement>;
  }
}

if (!customElements.get("grave-pen-tool")) {
  customElements.define("grave-pen-tool", PenToolElement);
}

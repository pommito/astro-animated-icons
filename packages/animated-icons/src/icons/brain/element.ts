import { createIconElement, type IconHandle } from "../../element";
import { brainRecipe } from "./definition";

export type BrainIconHandle = IconHandle;
const BrainElement = createIconElement(brainRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-brain": InstanceType<typeof BrainElement>;
  }
}

if (!customElements.get("grave-brain")) {
  customElements.define("grave-brain", BrainElement);
}

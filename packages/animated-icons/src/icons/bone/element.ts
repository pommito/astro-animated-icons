import { createIconElement, type IconHandle } from "../../element";
import { boneRecipe } from "./definition";

export type BoneIconHandle = IconHandle;
const BoneElement = createIconElement(boneRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bone": InstanceType<typeof BoneElement>;
  }
}

if (!customElements.get("grave-bone")) {
  customElements.define("grave-bone", BoneElement);
}

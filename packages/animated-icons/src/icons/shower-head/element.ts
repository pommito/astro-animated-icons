import { createIconElement, type IconHandle } from "../../element";
import { showerHeadRecipe } from "./definition";

export type ShowerHeadIconHandle = IconHandle;

const ShowerHeadElement = createIconElement(showerHeadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-shower-head": InstanceType<typeof ShowerHeadElement>;
  }
}

if (!customElements.get("grave-shower-head")) {
  customElements.define("grave-shower-head", ShowerHeadElement);
}

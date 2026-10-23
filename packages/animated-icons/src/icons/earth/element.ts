import { createIconElement, type IconHandle } from "../../element";
import { earthRecipe } from "./definition";

export type EarthIconHandle = IconHandle;
const EarthElement = createIconElement(earthRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-earth": InstanceType<typeof EarthElement>;
  }
}

if (!customElements.get("grave-earth")) {
  customElements.define("grave-earth", EarthElement);
}

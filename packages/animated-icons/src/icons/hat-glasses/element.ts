import { createIconElement, type IconHandle } from "../../element";
import { hatGlassesRecipe } from "./definition";

export type HatGlassesIconHandle = IconHandle;
const HatGlassesElement = createIconElement(hatGlassesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hat-glasses": InstanceType<typeof HatGlassesElement>;
  }
}

if (!customElements.get("grave-hat-glasses")) {
  customElements.define("grave-hat-glasses", HatGlassesElement);
}

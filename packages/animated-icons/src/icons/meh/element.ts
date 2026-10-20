import { createIconElement, type IconHandle } from "../../element";
import { mehRecipe } from "./definition";

export type MehIconHandle = IconHandle;
const MehElement = createIconElement(mehRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-meh": InstanceType<typeof MehElement>;
  }
}

if (!customElements.get("grave-meh")) {
  customElements.define("grave-meh", MehElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { axeRecipe } from "./definition";

export type AxeIconHandle = IconHandle;
const AxeElement = createIconElement(axeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-axe": InstanceType<typeof AxeElement>;
  }
}

if (!customElements.get("grave-axe")) {
  customElements.define("grave-axe", AxeElement);
}

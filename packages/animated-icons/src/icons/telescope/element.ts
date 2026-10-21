import { createIconElement, type IconHandle } from "../../element";
import { telescopeRecipe } from "./definition";

export type TelescopeIconHandle = IconHandle;
const TelescopeElement = createIconElement(telescopeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-telescope": InstanceType<typeof TelescopeElement>;
  }
}

if (!customElements.get("grave-telescope")) {
  customElements.define("grave-telescope", TelescopeElement);
}

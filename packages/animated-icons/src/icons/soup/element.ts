import { createIconElement, type IconHandle } from "../../element";
import { soupRecipe } from "./definition";

export type SoupIconHandle = IconHandle;
const SoupElement = createIconElement(soupRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-soup": InstanceType<typeof SoupElement>;
  }
}

if (!customElements.get("grave-soup")) {
  customElements.define("grave-soup", SoupElement);
}

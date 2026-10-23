import { createIconElement, type IconHandle } from "../../element";
import { cigaretteRecipe } from "./definition";

export type CigaretteIconHandle = IconHandle;
const CigaretteElement = createIconElement(cigaretteRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cigarette": InstanceType<typeof CigaretteElement>;
  }
}

if (!customElements.get("grave-cigarette")) {
  customElements.define("grave-cigarette", CigaretteElement);
}

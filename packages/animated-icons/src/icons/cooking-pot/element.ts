import { createIconElement, type IconHandle } from "../../element";
import { cookingPotRecipe } from "./definition";

export type CookingPotIconHandle = IconHandle;
const CookingPotElement = createIconElement(cookingPotRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cooking-pot": InstanceType<typeof CookingPotElement>;
  }
}

if (!customElements.get("grave-cooking-pot")) {
  customElements.define("grave-cooking-pot", CookingPotElement);
}

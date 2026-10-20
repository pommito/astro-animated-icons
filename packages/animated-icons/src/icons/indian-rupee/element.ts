import { createIconElement, type IconHandle } from "../../element";
import { indianRupeeRecipe } from "./definition";

export type IndianRupeeIconHandle = IconHandle;

const IndianRupeeElement = createIconElement(indianRupeeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-indian-rupee": InstanceType<typeof IndianRupeeElement>;
  }
}

if (!customElements.get("grave-indian-rupee")) {
  customElements.define("grave-indian-rupee", IndianRupeeElement);
}

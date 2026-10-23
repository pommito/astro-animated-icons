import { createIconElement, type IconHandle } from "../../element";
import { pickaxeRecipe } from "./definition";

export type PickaxeIconHandle = IconHandle;
const PickaxeElement = createIconElement(pickaxeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-pickaxe": InstanceType<typeof PickaxeElement>;
  }
}

if (!customElements.get("grave-pickaxe")) {
  customElements.define("grave-pickaxe", PickaxeElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { banRecipe } from "./definition";

export type BanIconHandle = IconHandle;

const BanElement = createIconElement(banRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ban": InstanceType<typeof BanElement>;
  }
}

if (!customElements.get("grave-ban")) {
  customElements.define("grave-ban", BanElement);
}

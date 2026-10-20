import { createIconElement, type IconHandle } from "../../element";
import { laughRecipe } from "./definition";

export type LaughIconHandle = IconHandle;
const LaughElement = createIconElement(laughRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-laugh": InstanceType<typeof LaughElement>;
  }
}

if (!customElements.get("grave-laugh")) {
  customElements.define("grave-laugh", LaughElement);
}

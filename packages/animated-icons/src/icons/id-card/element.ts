import { createIconElement, type IconHandle } from "../../element";
import { idCardRecipe } from "./definition";

export type IdCardIconHandle = IconHandle;

const IdCardElement = createIconElement(idCardRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-id-card": InstanceType<typeof IdCardElement>;
  }
}

if (!customElements.get("grave-id-card")) {
  customElements.define("grave-id-card", IdCardElement);
}

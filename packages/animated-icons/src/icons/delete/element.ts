import { createIconElement, type IconHandle } from "../../element";
import { deleteRecipe } from "./definition";

export type DeleteIconHandle = IconHandle;

const DeleteElement = createIconElement(deleteRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-delete": InstanceType<typeof DeleteElement>;
  }
}

if (!customElements.get("grave-delete")) {
  customElements.define("grave-delete", DeleteElement);
}

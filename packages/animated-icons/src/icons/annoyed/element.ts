import { createIconElement, type IconHandle } from "../../element";
import { annoyedRecipe } from "./definition";

export type AnnoyedIconHandle = IconHandle;
const AnnoyedElement = createIconElement(annoyedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-annoyed": InstanceType<typeof AnnoyedElement>;
  }
}

if (!customElements.get("grave-annoyed")) {
  customElements.define("grave-annoyed", AnnoyedElement);
}

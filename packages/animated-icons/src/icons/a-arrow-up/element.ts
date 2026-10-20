import { createIconElement, type IconHandle } from "../../element";
import { aArrowUpRecipe } from "./definition";

export type AArrowUpIconHandle = IconHandle;

const AArrowUpElement = createIconElement(aArrowUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-a-arrow-up": InstanceType<typeof AArrowUpElement>;
  }
}

if (!customElements.get("grave-a-arrow-up")) {
  customElements.define("grave-a-arrow-up", AArrowUpElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { swissFrancRecipe } from "./definition";

export type SwissFrancIconHandle = IconHandle;

const SwissFrancElement = createIconElement(swissFrancRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-swiss-franc": InstanceType<typeof SwissFrancElement>;
  }
}

if (!customElements.get("grave-swiss-franc")) {
  customElements.define("grave-swiss-franc", SwissFrancElement);
}

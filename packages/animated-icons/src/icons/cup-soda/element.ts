import { createIconElement, type IconHandle } from "../../element";
import { cupSodaRecipe } from "./definition";

export type CupSodaIconHandle = IconHandle;
const CupSodaElement = createIconElement(cupSodaRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cup-soda": InstanceType<typeof CupSodaElement>;
  }
}

if (!customElements.get("grave-cup-soda")) {
  customElements.define("grave-cup-soda", CupSodaElement);
}

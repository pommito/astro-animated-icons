import { createIconElement, type IconHandle } from "../../element";
import { gavelRecipe } from "./definition";

export type GavelIconHandle = IconHandle;
const GavelElement = createIconElement(gavelRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gavel": InstanceType<typeof GavelElement>;
  }
}

if (!customElements.get("grave-gavel")) {
  customElements.define("grave-gavel", GavelElement);
}

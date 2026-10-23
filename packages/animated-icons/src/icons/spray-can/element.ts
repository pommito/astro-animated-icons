import { createIconElement, type IconHandle } from "../../element";
import { sprayCanRecipe } from "./definition";

export type SprayCanIconHandle = IconHandle;
const SprayCanElement = createIconElement(sprayCanRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-spray-can": InstanceType<typeof SprayCanElement>;
  }
}

if (!customElements.get("grave-spray-can")) {
  customElements.define("grave-spray-can", SprayCanElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { castRecipe } from "./definition";

export type CastIconHandle = IconHandle;

const CastElement = createIconElement(castRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cast": InstanceType<typeof CastElement>;
  }
}

if (!customElements.get("grave-cast")) {
  customElements.define("grave-cast", CastElement);
}

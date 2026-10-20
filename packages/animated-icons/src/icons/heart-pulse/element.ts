import { createIconElement, type IconHandle } from "../../element";
import { heartPulseRecipe } from "./definition";

export type HeartPulseIconHandle = IconHandle;
const HeartPulseElement = createIconElement(heartPulseRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-heart-pulse": InstanceType<typeof HeartPulseElement>;
  }
}

if (!customElements.get("grave-heart-pulse")) {
  customElements.define("grave-heart-pulse", HeartPulseElement);
}

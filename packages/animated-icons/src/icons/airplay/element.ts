import { createIconElement, type IconHandle } from "../../element";
import { airplayRecipe } from "./definition";

export type AirplayIconHandle = IconHandle;

const AirplayElement = createIconElement(airplayRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-airplay": InstanceType<typeof AirplayElement>;
  }
}

if (!customElements.get("grave-airplay")) {
  customElements.define("grave-airplay", AirplayElement);
}

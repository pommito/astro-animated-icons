import { createIconElement, type IconHandle } from "../../element";
import { cloudRainRecipe } from "./definition";

export type CloudRainIconHandle = IconHandle;

const CloudRainElement = createIconElement(cloudRainRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-rain": InstanceType<typeof CloudRainElement>;
  }
}

if (!customElements.get("grave-cloud-rain")) {
  customElements.define("grave-cloud-rain", CloudRainElement);
}

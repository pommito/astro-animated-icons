import { createIconElement, type IconHandle } from "../../element";
import { cloudRainWindRecipe } from "./definition";

export type CloudRainWindIconHandle = IconHandle;

const CloudRainWindElement = createIconElement(cloudRainWindRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-rain-wind": InstanceType<typeof CloudRainWindElement>;
  }
}

if (!customElements.get("grave-cloud-rain-wind")) {
  customElements.define("grave-cloud-rain-wind", CloudRainWindElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { volumeRecipe } from "./definition";

export type VolumeIconHandle = IconHandle;

const VolumeElement = createIconElement(volumeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-volume": InstanceType<typeof VolumeElement>;
  }
}

if (!customElements.get("grave-volume")) {
  customElements.define("grave-volume", VolumeElement);
}

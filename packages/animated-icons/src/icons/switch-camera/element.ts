import { createIconElement, type IconHandle } from "../../element";
import { switchCameraRecipe } from "./definition";

export type SwitchCameraIconHandle = IconHandle;

const SwitchCameraElement = createIconElement(switchCameraRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-switch-camera": InstanceType<typeof SwitchCameraElement>;
  }
}

if (!customElements.get("grave-switch-camera")) {
  customElements.define("grave-switch-camera", SwitchCameraElement);
}

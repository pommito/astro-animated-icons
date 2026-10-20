import { createIconElement, type IconHandle } from "../../element";
import { micOffRecipe } from "./definition";

export type MicOffIconHandle = IconHandle;

const MicOffElement = createIconElement(micOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-mic-off": InstanceType<typeof MicOffElement>;
  }
}

if (!customElements.get("grave-mic-off")) {
  customElements.define("grave-mic-off", MicOffElement);
}

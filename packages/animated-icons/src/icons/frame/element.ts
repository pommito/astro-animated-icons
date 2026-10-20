import { createIconElement, type IconHandle } from "../../element";
import { frameRecipe } from "./definition";

export type FrameIconHandle = IconHandle;
const FrameElement = createIconElement(frameRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-frame": InstanceType<typeof FrameElement>;
  }
}

if (!customElements.get("grave-frame")) {
  customElements.define("grave-frame", FrameElement);
}

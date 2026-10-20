import { createIconElement, type IconHandle } from "../../element";
import { heartHandshakeRecipe } from "./definition";

export type HeartHandshakeIconHandle = IconHandle;
const HeartHandshakeElement = createIconElement(heartHandshakeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-heart-handshake": InstanceType<typeof HeartHandshakeElement>;
  }
}

if (!customElements.get("grave-heart-handshake")) {
  customElements.define("grave-heart-handshake", HeartHandshakeElement);
}

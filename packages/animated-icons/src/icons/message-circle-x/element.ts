import { createIconElement } from "../../element";
import { messageCircleXRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageCircleXIconHandle = IconHandle;

const MessageCircleXElement = createIconElement(messageCircleXRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle-x": InstanceType<typeof MessageCircleXElement>;
  }
}

if (!customElements.get("grave-message-circle-x")) {
  customElements.define("grave-message-circle-x", MessageCircleXElement);
}

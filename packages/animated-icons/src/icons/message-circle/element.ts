import { createIconElement } from "../../element";
import { messageCircleRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageCircleIconHandle = IconHandle;

const MessageCircleElement = createIconElement(messageCircleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle": InstanceType<typeof MessageCircleElement>;
  }
}

if (!customElements.get("grave-message-circle")) {
  customElements.define("grave-message-circle", MessageCircleElement);
}

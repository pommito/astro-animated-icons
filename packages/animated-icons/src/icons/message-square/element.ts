import { createIconElement } from "../../element";
import { messageSquareRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageSquareIconHandle = IconHandle;

const MessageSquareElement = createIconElement(messageSquareRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square": InstanceType<typeof MessageSquareElement>;
  }
}

if (!customElements.get("grave-message-square")) {
  customElements.define("grave-message-square", MessageSquareElement);
}

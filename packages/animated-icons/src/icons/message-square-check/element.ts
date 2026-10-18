import { createIconElement } from "../../element";
import { messageSquareCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageSquareCheckIconHandle = IconHandle;

const MessageSquareCheckElement = createIconElement(messageSquareCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square-check": InstanceType<typeof MessageSquareCheckElement>;
  }
}

if (!customElements.get("grave-message-square-check")) {
  customElements.define("grave-message-square-check", MessageSquareCheckElement);
}

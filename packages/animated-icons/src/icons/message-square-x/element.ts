import { createIconElement } from "../../element";
import { messageSquareXRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageSquareXIconHandle = IconHandle;

const MessageSquareXElement = createIconElement(messageSquareXRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square-x": InstanceType<typeof MessageSquareXElement>;
  }
}

if (!customElements.get("grave-message-square-x")) {
  customElements.define("grave-message-square-x", MessageSquareXElement);
}

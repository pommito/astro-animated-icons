import { createIconElement } from "../../element";
import { messageSquareMoreRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageSquareMoreIconHandle = IconHandle;

const MessageSquareMoreElement = createIconElement(messageSquareMoreRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square-more": InstanceType<typeof MessageSquareMoreElement>;
  }
}

if (!customElements.get("grave-message-square-more")) {
  customElements.define("grave-message-square-more", MessageSquareMoreElement);
}

import { createIconElement } from "../../element";
import { messageCircleMoreRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageCircleMoreIconHandle = IconHandle;

const MessageCircleMoreElement = createIconElement(messageCircleMoreRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle-more": InstanceType<typeof MessageCircleMoreElement>;
  }
}

if (!customElements.get("grave-message-circle-more")) {
  customElements.define("grave-message-circle-more", MessageCircleMoreElement);
}

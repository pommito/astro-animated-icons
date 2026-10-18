import { createIconElement } from "../../element";
import { messageCircleCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageCircleCheckIconHandle = IconHandle;

const MessageCircleCheckElement = createIconElement(messageCircleCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle-check": InstanceType<typeof MessageCircleCheckElement>;
  }
}

if (!customElements.get("grave-message-circle-check")) {
  customElements.define("grave-message-circle-check", MessageCircleCheckElement);
}

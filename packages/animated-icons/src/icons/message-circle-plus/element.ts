import { createIconElement } from "../../element";
import { messageCirclePlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageCirclePlusIconHandle = IconHandle;

const MessageCirclePlusElement = createIconElement(messageCirclePlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle-plus": InstanceType<typeof MessageCirclePlusElement>;
  }
}

if (!customElements.get("grave-message-circle-plus")) {
  customElements.define("grave-message-circle-plus", MessageCirclePlusElement);
}

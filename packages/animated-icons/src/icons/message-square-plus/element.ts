import { createIconElement } from "../../element";
import { messageSquarePlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MessageSquarePlusIconHandle = IconHandle;

const MessageSquarePlusElement = createIconElement(messageSquarePlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square-plus": InstanceType<typeof MessageSquarePlusElement>;
  }
}

if (!customElements.get("grave-message-square-plus")) {
  customElements.define("grave-message-square-plus", MessageSquarePlusElement);
}

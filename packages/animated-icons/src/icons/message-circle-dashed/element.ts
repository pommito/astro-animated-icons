import { createIconElement, type IconHandle } from "../../element";
import { messageCircleDashedRecipe } from "./definition";

export type MessageCircleDashedIconHandle = IconHandle;

const MessageCircleDashedElement = createIconElement(messageCircleDashedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-circle-dashed": InstanceType<typeof MessageCircleDashedElement>;
  }
}

if (!customElements.get("grave-message-circle-dashed")) {
  customElements.define("grave-message-circle-dashed", MessageCircleDashedElement);
}

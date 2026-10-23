import { createIconElement, type IconHandle } from "../../element";
import { messageSquareDashedRecipe } from "./definition";

export type MessageSquareDashedIconHandle = IconHandle;

const MessageSquareDashedElement = createIconElement(messageSquareDashedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-message-square-dashed": InstanceType<typeof MessageSquareDashedElement>;
  }
}

if (!customElements.get("grave-message-square-dashed")) {
  customElements.define("grave-message-square-dashed", MessageSquareDashedElement);
}

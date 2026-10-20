import { createIconElement, type IconHandle } from "../../element";
import { botMessageSquareRecipe } from "./definition";

export type BotMessageSquareIconHandle = IconHandle;
const BotMessageSquareElement = createIconElement(botMessageSquareRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bot-message-square": InstanceType<typeof BotMessageSquareElement>;
  }
}

if (!customElements.get("grave-bot-message-square")) {
  customElements.define("grave-bot-message-square", BotMessageSquareElement);
}

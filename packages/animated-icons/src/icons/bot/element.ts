import { createIconElement } from "../../element";
import { botRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BotIconHandle = IconHandle;

const BotElement = createIconElement(botRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bot": InstanceType<typeof BotElement>;
  }
}

if (!customElements.get("grave-bot")) {
  customElements.define("grave-bot", BotElement);
}

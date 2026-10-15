import { createIconElement } from "../../element";
import { animateBot } from "./definition";
import type { IconHandle } from "../../element";

export type BotIconHandle = IconHandle;

const BotElement = createIconElement({
  animate: animateBot,
  clear(drawing) {
    for (const eye of drawing.querySelectorAll("line")) {
      eye.style.removeProperty("stroke-dasharray");
      eye.style.removeProperty("stroke-dashoffset");
    }
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-bot": InstanceType<typeof BotElement>;
  }
}

if (!customElements.get("grave-bot")) {
  customElements.define("grave-bot", BotElement);
}

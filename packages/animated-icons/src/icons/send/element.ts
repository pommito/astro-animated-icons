import { createIconElement, type IconHandle } from "../../element";
import { sendRecipe } from "./definition";

export type SendIconHandle = IconHandle;

const SendElement = createIconElement(sendRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-send": InstanceType<typeof SendElement>;
  }
}

if (!customElements.get("grave-send")) {
  customElements.define("grave-send", SendElement);
}

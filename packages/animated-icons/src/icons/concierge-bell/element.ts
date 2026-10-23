import { createIconElement, type IconHandle } from "../../element";
import { conciergeBellRecipe } from "./definition";

export type ConciergeBellIconHandle = IconHandle;

const ConciergeBellElement = createIconElement(conciergeBellRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-concierge-bell": InstanceType<typeof ConciergeBellElement>;
  }
}

if (!customElements.get("grave-concierge-bell")) {
  customElements.define("grave-concierge-bell", ConciergeBellElement);
}

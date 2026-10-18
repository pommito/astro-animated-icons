import { createIconElement } from "../../element";
import { clockRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ClockIconHandle = IconHandle;

const ClockElement = createIconElement(clockRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-clock": InstanceType<typeof ClockElement>;
  }
}

if (!customElements.get("grave-clock")) {
  customElements.define("grave-clock", ClockElement);
}

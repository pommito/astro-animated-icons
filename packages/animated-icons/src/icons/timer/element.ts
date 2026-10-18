import { createIconElement } from "../../element";
import { timerRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type TimerIconHandle = IconHandle;

const TimerElement = createIconElement(timerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-timer": InstanceType<typeof TimerElement>;
  }
}

if (!customElements.get("grave-timer")) {
  customElements.define("grave-timer", TimerElement);
}

import { createIconElement } from "../../element";
import { hourglassRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type HourglassIconHandle = IconHandle;

const HourglassElement = createIconElement(hourglassRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hourglass": InstanceType<typeof HourglassElement>;
  }
}

if (!customElements.get("grave-hourglass")) {
  customElements.define("grave-hourglass", HourglassElement);
}

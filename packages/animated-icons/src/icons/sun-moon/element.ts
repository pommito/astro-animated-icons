import { createIconElement } from "../../element";
import { sunMoonRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SunMoonIconHandle = IconHandle;

const SunMoonElement = createIconElement(sunMoonRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sun-moon": InstanceType<typeof SunMoonElement>;
  }
}

if (!customElements.get("grave-sun-moon")) {
  customElements.define("grave-sun-moon", SunMoonElement);
}

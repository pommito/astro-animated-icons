import { createIconElement } from "../../element";
import { sunMediumRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SunMediumIconHandle = IconHandle;

const SunMediumElement = createIconElement(sunMediumRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sun-medium": InstanceType<typeof SunMediumElement>;
  }
}

if (!customElements.get("grave-sun-medium")) {
  customElements.define("grave-sun-medium", SunMediumElement);
}

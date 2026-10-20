import { createIconElement } from "../../element";
import { sunsetRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SunsetIconHandle = IconHandle;

const SunsetElement = createIconElement(sunsetRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sunset": InstanceType<typeof SunsetElement>;
  }
}

if (!customElements.get("grave-sunset")) {
  customElements.define("grave-sunset", SunsetElement);
}

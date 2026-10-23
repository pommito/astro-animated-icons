import { createIconElement } from "../../element";
import { chromeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChromeIconHandle = IconHandle;

const ChromeElement = createIconElement(chromeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chrome": InstanceType<typeof ChromeElement>;
  }
}

if (!customElements.get("grave-chrome")) {
  customElements.define("grave-chrome", ChromeElement);
}

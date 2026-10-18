import { createIconElement } from "../../element";
import { linkRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LinkIconHandle = IconHandle;

const LinkElement = createIconElement(linkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-link": InstanceType<typeof LinkElement>;
  }
}

if (!customElements.get("grave-link")) {
  customElements.define("grave-link", LinkElement);
}

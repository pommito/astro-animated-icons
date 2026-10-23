import { createIconElement } from "../../element";
import { twitterRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type TwitterIconHandle = IconHandle;

const TwitterElement = createIconElement(twitterRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-twitter": InstanceType<typeof TwitterElement>;
  }
}

if (!customElements.get("grave-twitter")) {
  customElements.define("grave-twitter", TwitterElement);
}

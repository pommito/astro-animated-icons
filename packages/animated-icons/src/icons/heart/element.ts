import { createIconElement, type IconHandle } from "../../element";
import { heartRecipe } from "./definition";

export type HeartIconHandle = IconHandle;
const HeartElement = createIconElement(heartRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-heart": InstanceType<typeof HeartElement>;
  }
}

if (!customElements.get("grave-heart")) {
  customElements.define("grave-heart", HeartElement);
}

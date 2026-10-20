import { createIconElement, type IconHandle } from "../../element";
import { rocketRecipe } from "./definition";

export type RocketIconHandle = IconHandle;

const RocketElement = createIconElement(rocketRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-rocket": InstanceType<typeof RocketElement>;
  }
}

if (!customElements.get("grave-rocket")) {
  customElements.define("grave-rocket", RocketElement);
}

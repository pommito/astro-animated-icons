import { createIconElement, type IconHandle } from "../../element";
import { alignVerticalRecipe } from "./definition";

export type AlignVerticalIconHandle = IconHandle;

const AlignVerticalElement = createIconElement(alignVerticalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-align-vertical": InstanceType<typeof AlignVerticalElement>;
  }
}

if (!customElements.get("grave-align-vertical")) {
  customElements.define("grave-align-vertical", AlignVerticalElement);
}

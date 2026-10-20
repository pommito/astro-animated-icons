import { createIconElement, type IconHandle } from "../../element";
import { featherRecipe } from "./definition";

export type FeatherIconHandle = IconHandle;
const FeatherElement = createIconElement(featherRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-feather": InstanceType<typeof FeatherElement>;
  }
}

if (!customElements.get("grave-feather")) {
  customElements.define("grave-feather", FeatherElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { refreshCwOffRecipe } from "./definition";

export type RefreshCwOffIconHandle = IconHandle;

const RefreshCwOffElement = createIconElement(refreshCwOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-refresh-cw-off": InstanceType<typeof RefreshCwOffElement>;
  }
}

if (!customElements.get("grave-refresh-cw-off")) {
  customElements.define("grave-refresh-cw-off", RefreshCwOffElement);
}

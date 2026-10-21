import { createIconElement, type IconHandle } from "../../element";
import { refreshCcwDotRecipe } from "./definition";

export type RefreshCcwDotIconHandle = IconHandle;

const RefreshCcwDotElement = createIconElement(refreshCcwDotRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-refresh-ccw-dot": InstanceType<typeof RefreshCcwDotElement>;
  }
}

if (!customElements.get("grave-refresh-ccw-dot")) {
  customElements.define("grave-refresh-ccw-dot", RefreshCcwDotElement);
}

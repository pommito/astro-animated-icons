import { createIconElement } from "../../element";
import { refreshCcwRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RefreshCcwIconHandle = IconHandle;

const RefreshCcwElement = createIconElement(refreshCcwRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-refresh-ccw": InstanceType<typeof RefreshCcwElement>;
  }
}

if (!customElements.get("grave-refresh-ccw")) {
  customElements.define("grave-refresh-ccw", RefreshCcwElement);
}

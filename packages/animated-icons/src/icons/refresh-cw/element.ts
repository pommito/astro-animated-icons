import { createIconElement } from "../../element";
import { refreshCwRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RefreshCwIconHandle = IconHandle;

const RefreshCwElement = createIconElement(refreshCwRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-refresh-cw": InstanceType<typeof RefreshCwElement>;
  }
}

if (!customElements.get("grave-refresh-cw")) {
  customElements.define("grave-refresh-cw", RefreshCwElement);
}

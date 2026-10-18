import { createIconElement } from "../../element";
import { lockKeyholeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LockKeyholeIconHandle = IconHandle;

const LockKeyholeElement = createIconElement(lockKeyholeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-lock-keyhole": InstanceType<typeof LockKeyholeElement>;
  }
}

if (!customElements.get("grave-lock-keyhole")) {
  customElements.define("grave-lock-keyhole", LockKeyholeElement);
}

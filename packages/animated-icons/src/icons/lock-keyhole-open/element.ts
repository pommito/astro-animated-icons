import { createIconElement } from "../../element";
import { lockKeyholeOpenRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LockKeyholeOpenIconHandle = IconHandle;

const LockKeyholeOpenElement = createIconElement(lockKeyholeOpenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-lock-keyhole-open": InstanceType<typeof LockKeyholeOpenElement>;
  }
}

if (!customElements.get("grave-lock-keyhole-open")) {
  customElements.define("grave-lock-keyhole-open", LockKeyholeOpenElement);
}

import { createIconElement } from "../../element";
import { lockOpenRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LockOpenIconHandle = IconHandle;

const LockOpenElement = createIconElement(lockOpenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-lock-open": InstanceType<typeof LockOpenElement>;
  }
}

if (!customElements.get("grave-lock-open")) {
  customElements.define("grave-lock-open", LockOpenElement);
}

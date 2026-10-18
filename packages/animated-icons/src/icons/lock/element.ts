import { createIconElement } from "../../element";
import { lockRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LockIconHandle = IconHandle;

const LockElement = createIconElement(lockRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-lock": InstanceType<typeof LockElement>;
  }
}

if (!customElements.get("grave-lock")) {
  customElements.define("grave-lock", LockElement);
}

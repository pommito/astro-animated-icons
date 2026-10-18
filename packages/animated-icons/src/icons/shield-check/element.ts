import { createIconElement } from "../../element";
import { shieldCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ShieldCheckIconHandle = IconHandle;

const ShieldCheckElement = createIconElement(shieldCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-shield-check": InstanceType<typeof ShieldCheckElement>;
  }
}

if (!customElements.get("grave-shield-check")) {
  customElements.define("grave-shield-check", ShieldCheckElement);
}

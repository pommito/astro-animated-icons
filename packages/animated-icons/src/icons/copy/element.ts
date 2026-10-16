import { createIconElement } from "../../element";
import { copyRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CopyIconHandle = IconHandle;

const CopyElement = createIconElement(copyRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-copy": InstanceType<typeof CopyElement>;
  }
}

if (!customElements.get("grave-copy")) {
  customElements.define("grave-copy", CopyElement);
}

import { createIconElement } from "../../element";
import { attachFileRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AttachFileIconHandle = IconHandle;

const AttachFileElement = createIconElement(attachFileRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-attach-file": InstanceType<typeof AttachFileElement>;
  }
}

if (!customElements.get("grave-attach-file")) {
  customElements.define("grave-attach-file", AttachFileElement);
}

import { createIconElement } from "../../element";
import { scanFaceRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ScanFaceIconHandle = IconHandle;

const ScanFaceElement = createIconElement(scanFaceRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-scan-face": InstanceType<typeof ScanFaceElement>;
  }
}

if (!customElements.get("grave-scan-face")) {
  customElements.define("grave-scan-face", ScanFaceElement);
}

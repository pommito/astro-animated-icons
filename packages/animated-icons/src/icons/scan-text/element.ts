import { createIconElement, type IconHandle } from "../../element";
import { scanTextRecipe } from "./definition";

export type ScanTextIconHandle = IconHandle;
const ScanTextElement = createIconElement(scanTextRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-scan-text": InstanceType<typeof ScanTextElement>;
  }
}

if (!customElements.get("grave-scan-text")) {
  customElements.define("grave-scan-text", ScanTextElement);
}

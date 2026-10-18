import { createIconElement, type IconHandle } from "../../element";
import { fileCheck2Recipe } from "./definition";

export type FileCheck2IconHandle = IconHandle;

const FileCheck2Element = createIconElement(fileCheck2Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-check-2": InstanceType<typeof FileCheck2Element>;
  }
}

if (!customElements.get("grave-file-check-2")) {
  customElements.define("grave-file-check-2", FileCheck2Element);
}

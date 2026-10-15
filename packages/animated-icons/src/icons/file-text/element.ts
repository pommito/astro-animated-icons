import { createIconElement } from "../../element";
import { animateFileText, clearFileText } from "./definition";
import type { IconHandle } from "../../element";

export type FileTextIconHandle = IconHandle;

const FileTextElement = createIconElement({ animate: animateFileText, clear: clearFileText });

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-text": InstanceType<typeof FileTextElement>;
  }
}

if (!customElements.get("grave-file-text")) {
  customElements.define("grave-file-text", FileTextElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { filePenLineRecipe } from "./definition";

export type FilePenLineIconHandle = IconHandle;

const FilePenLineElement = createIconElement(filePenLineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-pen-line": InstanceType<typeof FilePenLineElement>;
  }
}

if (!customElements.get("grave-file-pen-line")) {
  customElements.define("grave-file-pen-line", FilePenLineElement);
}

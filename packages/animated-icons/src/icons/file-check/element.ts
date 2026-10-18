import { createIconElement, type IconHandle } from "../../element";
import { fileCheckRecipe } from "./definition";

export type FileCheckIconHandle = IconHandle;

const FileCheckElement = createIconElement(fileCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-check": InstanceType<typeof FileCheckElement>;
  }
}

if (!customElements.get("grave-file-check")) {
  customElements.define("grave-file-check", FileCheckElement);
}

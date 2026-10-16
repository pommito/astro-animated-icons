import { createIconElement } from "../../element";
import { folderCodeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderCodeIconHandle = IconHandle;

const FolderCodeElement = createIconElement(folderCodeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-code": InstanceType<typeof FolderCodeElement>;
  }
}

if (!customElements.get("grave-folder-code")) {
  customElements.define("grave-folder-code", FolderCodeElement);
}

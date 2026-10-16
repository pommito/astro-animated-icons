import { createIconElement } from "../../element";
import { folderXRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderXIconHandle = IconHandle;

const FolderXElement = createIconElement(folderXRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-x": InstanceType<typeof FolderXElement>;
  }
}

if (!customElements.get("grave-folder-x")) {
  customElements.define("grave-folder-x", FolderXElement);
}

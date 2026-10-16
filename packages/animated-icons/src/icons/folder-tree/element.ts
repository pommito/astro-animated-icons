import { createIconElement } from "../../element";
import { folderTreeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderTreeIconHandle = IconHandle;

const FolderTreeElement = createIconElement(folderTreeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-tree": InstanceType<typeof FolderTreeElement>;
  }
}

if (!customElements.get("grave-folder-tree")) {
  customElements.define("grave-folder-tree", FolderTreeElement);
}

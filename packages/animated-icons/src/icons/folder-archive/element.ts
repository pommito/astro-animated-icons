import { createIconElement } from "../../element";
import { folderArchiveRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderArchiveIconHandle = IconHandle;

const FolderArchiveElement = createIconElement(folderArchiveRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-archive": InstanceType<typeof FolderArchiveElement>;
  }
}

if (!customElements.get("grave-folder-archive")) {
  customElements.define("grave-folder-archive", FolderArchiveElement);
}

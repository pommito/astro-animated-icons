import { createIconElement } from "../../element";
import { folderLockRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderLockIconHandle = IconHandle;

const FolderLockElement = createIconElement(folderLockRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-lock": InstanceType<typeof FolderLockElement>;
  }
}

if (!customElements.get("grave-folder-lock")) {
  customElements.define("grave-folder-lock", FolderLockElement);
}

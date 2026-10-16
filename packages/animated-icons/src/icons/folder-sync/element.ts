import { createIconElement } from "../../element";
import { folderSyncRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderSyncIconHandle = IconHandle;

const FolderSyncElement = createIconElement(folderSyncRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-sync": InstanceType<typeof FolderSyncElement>;
  }
}

if (!customElements.get("grave-folder-sync")) {
  customElements.define("grave-folder-sync", FolderSyncElement);
}

import { createIconElement } from "../../element";
import { folderGit2Recipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderGit2IconHandle = IconHandle;

const FolderGit2Element = createIconElement(folderGit2Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-git-2": InstanceType<typeof FolderGit2Element>;
  }
}

if (!customElements.get("grave-folder-git-2")) {
  customElements.define("grave-folder-git-2", FolderGit2Element);
}

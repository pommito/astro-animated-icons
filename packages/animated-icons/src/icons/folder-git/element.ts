import { createIconElement } from "../../element";
import { folderGitRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderGitIconHandle = IconHandle;

const FolderGitElement = createIconElement(folderGitRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-git": InstanceType<typeof FolderGitElement>;
  }
}

if (!customElements.get("grave-folder-git")) {
  customElements.define("grave-folder-git", FolderGitElement);
}

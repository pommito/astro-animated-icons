import { createIconElement } from "../../element";
import { folderRootRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderRootIconHandle = IconHandle;

const FolderRootElement = createIconElement(folderRootRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-root": InstanceType<typeof FolderRootElement>;
  }
}

if (!customElements.get("grave-folder-root")) {
  customElements.define("grave-folder-root", FolderRootElement);
}

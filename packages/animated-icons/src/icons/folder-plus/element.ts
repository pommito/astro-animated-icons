import { createIconElement } from "../../element";
import { folderPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderPlusIconHandle = IconHandle;

const FolderPlusElement = createIconElement(folderPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-plus": InstanceType<typeof FolderPlusElement>;
  }
}

if (!customElements.get("grave-folder-plus")) {
  customElements.define("grave-folder-plus", FolderPlusElement);
}

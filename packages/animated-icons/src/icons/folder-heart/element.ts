import { createIconElement } from "../../element";
import { folderHeartRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderHeartIconHandle = IconHandle;

const FolderHeartElement = createIconElement(folderHeartRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-heart": InstanceType<typeof FolderHeartElement>;
  }
}

if (!customElements.get("grave-folder-heart")) {
  customElements.define("grave-folder-heart", FolderHeartElement);
}

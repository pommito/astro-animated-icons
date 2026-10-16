import { createIconElement } from "../../element";
import { folderInputRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderInputIconHandle = IconHandle;

const FolderInputElement = createIconElement(folderInputRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-input": InstanceType<typeof FolderInputElement>;
  }
}

if (!customElements.get("grave-folder-input")) {
  customElements.define("grave-folder-input", FolderInputElement);
}

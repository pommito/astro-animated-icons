import { createIconElement } from "../../element";
import { folderMinusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderMinusIconHandle = IconHandle;

const FolderMinusElement = createIconElement(folderMinusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-minus": InstanceType<typeof FolderMinusElement>;
  }
}

if (!customElements.get("grave-folder-minus")) {
  customElements.define("grave-folder-minus", FolderMinusElement);
}

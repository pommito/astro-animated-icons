import { createIconElement } from "../../element";
import { folderCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderCheckIconHandle = IconHandle;

const FolderCheckElement = createIconElement(folderCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-check": InstanceType<typeof FolderCheckElement>;
  }
}

if (!customElements.get("grave-folder-check")) {
  customElements.define("grave-folder-check", FolderCheckElement);
}

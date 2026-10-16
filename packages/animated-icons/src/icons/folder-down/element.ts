import { createIconElement } from "../../element";
import { folderDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderDownIconHandle = IconHandle;

const FolderDownElement = createIconElement(folderDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-down": InstanceType<typeof FolderDownElement>;
  }
}

if (!customElements.get("grave-folder-down")) {
  customElements.define("grave-folder-down", FolderDownElement);
}

import { createIconElement } from "../../element";
import { folderKeyRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderKeyIconHandle = IconHandle;

const FolderKeyElement = createIconElement(folderKeyRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-key": InstanceType<typeof FolderKeyElement>;
  }
}

if (!customElements.get("grave-folder-key")) {
  customElements.define("grave-folder-key", FolderKeyElement);
}

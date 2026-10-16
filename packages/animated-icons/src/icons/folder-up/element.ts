import { createIconElement } from "../../element";
import { folderUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderUpIconHandle = IconHandle;

const FolderUpElement = createIconElement(folderUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-up": InstanceType<typeof FolderUpElement>;
  }
}

if (!customElements.get("grave-folder-up")) {
  customElements.define("grave-folder-up", FolderUpElement);
}

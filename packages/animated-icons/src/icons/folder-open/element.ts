import { createIconElement } from "../../element";
import { folderOpenRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderOpenIconHandle = IconHandle;

const FolderOpenElement = createIconElement(folderOpenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-open": InstanceType<typeof FolderOpenElement>;
  }
}

if (!customElements.get("grave-folder-open")) {
  customElements.define("grave-folder-open", FolderOpenElement);
}

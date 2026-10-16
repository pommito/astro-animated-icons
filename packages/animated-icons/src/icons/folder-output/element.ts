import { createIconElement } from "../../element";
import { folderOutputRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderOutputIconHandle = IconHandle;

const FolderOutputElement = createIconElement(folderOutputRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-output": InstanceType<typeof FolderOutputElement>;
  }
}

if (!customElements.get("grave-folder-output")) {
  customElements.define("grave-folder-output", FolderOutputElement);
}

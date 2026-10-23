import { createIconElement } from "../../element";
import { folderRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderIconHandle = IconHandle;

const FolderElement = createIconElement(folderRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder": InstanceType<typeof FolderElement>;
  }
}

if (!customElements.get("grave-folder")) {
  customElements.define("grave-folder", FolderElement);
}

import { createIconElement } from "../../element";
import { folderDotRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderDotIconHandle = IconHandle;

const FolderDotElement = createIconElement(folderDotRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-dot": InstanceType<typeof FolderDotElement>;
  }
}

if (!customElements.get("grave-folder-dot")) {
  customElements.define("grave-folder-dot", FolderDotElement);
}

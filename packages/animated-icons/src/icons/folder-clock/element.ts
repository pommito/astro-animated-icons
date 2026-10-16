import { createIconElement } from "../../element";
import { folderClockRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderClockIconHandle = IconHandle;

const FolderClockElement = createIconElement(folderClockRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-clock": InstanceType<typeof FolderClockElement>;
  }
}

if (!customElements.get("grave-folder-clock")) {
  customElements.define("grave-folder-clock", FolderClockElement);
}

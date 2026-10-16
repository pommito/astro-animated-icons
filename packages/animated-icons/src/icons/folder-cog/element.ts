import { createIconElement } from "../../element";
import { folderCogRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderCogIconHandle = IconHandle;

const FolderCogElement = createIconElement(folderCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-cog": InstanceType<typeof FolderCogElement>;
  }
}

if (!customElements.get("grave-folder-cog")) {
  customElements.define("grave-folder-cog", FolderCogElement);
}

import { createIconElement } from "../../element";
import { folderKanbanRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FolderKanbanIconHandle = IconHandle;

const FolderKanbanElement = createIconElement(folderKanbanRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folder-kanban": InstanceType<typeof FolderKanbanElement>;
  }
}

if (!customElements.get("grave-folder-kanban")) {
  customElements.define("grave-folder-kanban", FolderKanbanElement);
}

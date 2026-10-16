import { createIconElement } from "../../element";
import { foldersRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FoldersIconHandle = IconHandle;

const FoldersElement = createIconElement(foldersRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-folders": InstanceType<typeof FoldersElement>;
  }
}

if (!customElements.get("grave-folders")) {
  customElements.define("grave-folders", FoldersElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { fileCogRecipe } from "./definition";

export type FileCogIconHandle = IconHandle;

const FileCogElement = createIconElement(fileCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-cog": InstanceType<typeof FileCogElement>;
  }
}

if (!customElements.get("grave-file-cog")) {
  customElements.define("grave-file-cog", FileCogElement);
}

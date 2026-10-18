import { createIconElement, type IconHandle } from "../../element";
import { fileStackRecipe } from "./definition";

export type FileStackIconHandle = IconHandle;

const FileStackElement = createIconElement(fileStackRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-stack": InstanceType<typeof FileStackElement>;
  }
}

if (!customElements.get("grave-file-stack")) {
  customElements.define("grave-file-stack", FileStackElement);
}

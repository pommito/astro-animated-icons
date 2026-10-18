import { createIconElement, type IconHandle } from "../../element";
import { uploadRecipe } from "./definition";

export type UploadIconHandle = IconHandle;

const UploadElement = createIconElement(uploadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-upload": InstanceType<typeof UploadElement>;
  }
}

if (!customElements.get("grave-upload")) {
  customElements.define("grave-upload", UploadElement);
}

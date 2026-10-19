import { createIconElement, type IconHandle } from "../../element";
import { cloudUploadRecipe } from "./definition";

export type CloudUploadIconHandle = IconHandle;

const CloudUploadElement = createIconElement(cloudUploadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-upload": InstanceType<typeof CloudUploadElement>;
  }
}

if (!customElements.get("grave-cloud-upload")) {
  customElements.define("grave-cloud-upload", CloudUploadElement);
}

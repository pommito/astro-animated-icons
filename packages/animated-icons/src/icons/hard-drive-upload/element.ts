import { createIconElement, type IconHandle } from "../../element";
import { hardDriveUploadRecipe } from "./definition";

export type HardDriveUploadIconHandle = IconHandle;
const HardDriveUploadElement = createIconElement(hardDriveUploadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hard-drive-upload": InstanceType<typeof HardDriveUploadElement>;
  }
}

if (!customElements.get("grave-hard-drive-upload")) {
  customElements.define("grave-hard-drive-upload", HardDriveUploadElement);
}

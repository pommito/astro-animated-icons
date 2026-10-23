import { createIconElement, type IconHandle } from "../../element";
import { hardDriveDownloadRecipe } from "./definition";

export type HardDriveDownloadIconHandle = IconHandle;
const HardDriveDownloadElement = createIconElement(hardDriveDownloadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hard-drive-download": InstanceType<typeof HardDriveDownloadElement>;
  }
}

if (!customElements.get("grave-hard-drive-download")) {
  customElements.define("grave-hard-drive-download", HardDriveDownloadElement);
}

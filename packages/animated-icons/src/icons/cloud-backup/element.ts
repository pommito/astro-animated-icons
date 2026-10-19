import { createIconElement, type IconHandle } from "../../element";
import { cloudBackupRecipe } from "./definition";

export type CloudBackupIconHandle = IconHandle;

const CloudBackupElement = createIconElement(cloudBackupRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-backup": InstanceType<typeof CloudBackupElement>;
  }
}

if (!customElements.get("grave-cloud-backup")) {
  customElements.define("grave-cloud-backup", CloudBackupElement);
}

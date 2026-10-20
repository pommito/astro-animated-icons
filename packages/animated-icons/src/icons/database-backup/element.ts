import { createIconElement, type IconHandle } from "../../element";
import { databaseBackupRecipe } from "./definition";

export type DatabaseBackupIconHandle = IconHandle;

const DatabaseBackupElement = createIconElement(databaseBackupRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-database-backup": InstanceType<typeof DatabaseBackupElement>;
  }
}

if (!customElements.get("grave-database-backup")) {
  customElements.define("grave-database-backup", DatabaseBackupElement);
}

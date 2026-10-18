import { createIconElement, type IconHandle } from "../../element";
import { cloudSyncRecipe } from "./definition";

export type CloudSyncIconHandle = IconHandle;

const CloudSyncElement = createIconElement(cloudSyncRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-sync": InstanceType<typeof CloudSyncElement>;
  }
}

if (!customElements.get("grave-cloud-sync")) {
  customElements.define("grave-cloud-sync", CloudSyncElement);
}

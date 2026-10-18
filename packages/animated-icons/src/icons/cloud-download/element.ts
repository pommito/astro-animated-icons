import { createIconElement, type IconHandle } from "../../element";
import { cloudDownloadRecipe } from "./definition";

export type CloudDownloadIconHandle = IconHandle;

const CloudDownloadElement = createIconElement(cloudDownloadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-download": InstanceType<typeof CloudDownloadElement>;
  }
}

if (!customElements.get("grave-cloud-download")) {
  customElements.define("grave-cloud-download", CloudDownloadElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { downloadRecipe } from "./definition";

export type DownloadIconHandle = IconHandle;

const DownloadElement = createIconElement(downloadRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-download": InstanceType<typeof DownloadElement>;
  }
}

if (!customElements.get("grave-download")) {
  customElements.define("grave-download", DownloadElement);
}

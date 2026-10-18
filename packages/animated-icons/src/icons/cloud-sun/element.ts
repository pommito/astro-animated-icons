import { createIconElement, type IconHandle } from "../../element";
import { cloudSunRecipe } from "./definition";

export type CloudSunIconHandle = IconHandle;

const CloudSunElement = createIconElement(cloudSunRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-sun": InstanceType<typeof CloudSunElement>;
  }
}

if (!customElements.get("grave-cloud-sun")) {
  customElements.define("grave-cloud-sun", CloudSunElement);
}

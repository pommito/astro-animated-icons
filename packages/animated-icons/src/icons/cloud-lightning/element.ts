import { createIconElement, type IconHandle } from "../../element";
import { cloudLightningRecipe } from "./definition";

export type CloudLightningIconHandle = IconHandle;

const CloudLightningElement = createIconElement(cloudLightningRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-lightning": InstanceType<typeof CloudLightningElement>;
  }
}

if (!customElements.get("grave-cloud-lightning")) {
  customElements.define("grave-cloud-lightning", CloudLightningElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { cloudSnowRecipe } from "./definition";

export type CloudSnowIconHandle = IconHandle;

const CloudSnowElement = createIconElement(cloudSnowRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-snow": InstanceType<typeof CloudSnowElement>;
  }
}

if (!customElements.get("grave-cloud-snow")) {
  customElements.define("grave-cloud-snow", CloudSnowElement);
}

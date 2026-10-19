import { createIconElement, type IconHandle } from "../../element";
import { cloudCogRecipe } from "./definition";

export type CloudCogIconHandle = IconHandle;

const CloudCogElement = createIconElement(cloudCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cloud-cog": InstanceType<typeof CloudCogElement>;
  }
}

if (!customElements.get("grave-cloud-cog")) {
  customElements.define("grave-cloud-cog", CloudCogElement);
}

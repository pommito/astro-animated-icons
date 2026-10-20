import { createIconElement, type IconHandle } from "../../element";
import { layersRecipe } from "./definition";

export type LayersIconHandle = IconHandle;

const LayersElement = createIconElement(layersRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-layers": InstanceType<typeof LayersElement>;
  }
}

if (!customElements.get("grave-layers")) {
  customElements.define("grave-layers", LayersElement);
}

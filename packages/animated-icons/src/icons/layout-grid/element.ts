import { createIconElement, type IconHandle } from "../../element";
import { layoutGridRecipe } from "./definition";

export type LayoutGridIconHandle = IconHandle;

const LayoutGridElement = createIconElement(layoutGridRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-layout-grid": InstanceType<typeof LayoutGridElement>;
  }
}

if (!customElements.get("grave-layout-grid")) {
  customElements.define("grave-layout-grid", LayoutGridElement);
}

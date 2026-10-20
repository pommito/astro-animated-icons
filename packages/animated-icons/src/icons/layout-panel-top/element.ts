import { createIconElement, type IconHandle } from "../../element";
import { layoutPanelTopRecipe } from "./definition";

export type LayoutPanelTopIconHandle = IconHandle;

const LayoutPanelTopElement = createIconElement(layoutPanelTopRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-layout-panel-top": InstanceType<typeof LayoutPanelTopElement>;
  }
}

if (!customElements.get("grave-layout-panel-top")) {
  customElements.define("grave-layout-panel-top", LayoutPanelTopElement);
}

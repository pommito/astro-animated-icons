import { createIconElement, type IconHandle } from "../../element";
import { panelRightOpenRecipe } from "./definition";

export type PanelRightOpenIconHandle = IconHandle;

const PanelRightOpenElement = createIconElement(panelRightOpenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-panel-right-open": InstanceType<typeof PanelRightOpenElement>;
  }
}

if (!customElements.get("grave-panel-right-open")) {
  customElements.define("grave-panel-right-open", PanelRightOpenElement);
}

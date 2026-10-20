import { createIconElement, type IconHandle } from "../../element";
import { panelLeftCloseRecipe } from "./definition";

export type PanelLeftCloseIconHandle = IconHandle;

const PanelLeftCloseElement = createIconElement(panelLeftCloseRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-panel-left-close": InstanceType<typeof PanelLeftCloseElement>;
  }
}

if (!customElements.get("grave-panel-left-close")) {
  customElements.define("grave-panel-left-close", PanelLeftCloseElement);
}

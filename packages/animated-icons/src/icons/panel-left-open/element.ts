import { createIconElement, type IconHandle } from "../../element";
import { panelLeftOpenRecipe } from "./definition";

export type PanelLeftOpenIconHandle = IconHandle;

const PanelLeftOpenElement = createIconElement(panelLeftOpenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-panel-left-open": InstanceType<typeof PanelLeftOpenElement>;
  }
}

if (!customElements.get("grave-panel-left-open")) {
  customElements.define("grave-panel-left-open", PanelLeftOpenElement);
}

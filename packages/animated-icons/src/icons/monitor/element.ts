import { createIconElement } from "../../element";
import { monitorRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MonitorIconHandle = IconHandle;

const MonitorElement = createIconElement(monitorRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-monitor": InstanceType<typeof MonitorElement>;
  }
}

if (!customElements.get("grave-monitor")) {
  customElements.define("grave-monitor", MonitorElement);
}

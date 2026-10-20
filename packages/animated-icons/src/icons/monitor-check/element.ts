import { createIconElement, type IconHandle } from "../../element";
import { monitorCheckRecipe } from "./definition";

export type MonitorCheckIconHandle = IconHandle;
const MonitorCheckElement = createIconElement(monitorCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-monitor-check": InstanceType<typeof MonitorCheckElement>;
  }
}

if (!customElements.get("grave-monitor-check")) {
  customElements.define("grave-monitor-check", MonitorCheckElement);
}

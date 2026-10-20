import { createIconElement, type IconHandle } from "../../element";
import { monitorCogRecipe } from "./definition";

export type MonitorCogIconHandle = IconHandle;
const MonitorCogElement = createIconElement(monitorCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-monitor-cog": InstanceType<typeof MonitorCogElement>;
  }
}

if (!customElements.get("grave-monitor-cog")) {
  customElements.define("grave-monitor-cog", MonitorCogElement);
}

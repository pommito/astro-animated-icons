import { createIconElement, type IconHandle } from "../../element";
import { waypointsRecipe } from "./definition";

export type WaypointsIconHandle = IconHandle;

const WaypointsElement = createIconElement(waypointsRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-waypoints": InstanceType<typeof WaypointsElement>;
  }
}

if (!customElements.get("grave-waypoints")) {
  customElements.define("grave-waypoints", WaypointsElement);
}

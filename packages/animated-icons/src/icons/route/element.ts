import { createIconElement, type IconHandle } from "../../element";
import { routeRecipe } from "./definition";

export type RouteIconHandle = IconHandle;

const RouteElement = createIconElement(routeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-route": InstanceType<typeof RouteElement>;
  }
}

if (!customElements.get("grave-route")) {
  customElements.define("grave-route", RouteElement);
}

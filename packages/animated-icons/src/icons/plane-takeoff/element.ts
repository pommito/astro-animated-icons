import { createIconElement, type IconHandle } from "../../element";
import { planeTakeoffRecipe } from "./definition";

export type PlaneTakeoffIconHandle = IconHandle;

const PlaneTakeoffElement = createIconElement(planeTakeoffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-plane-takeoff": InstanceType<typeof PlaneTakeoffElement>;
  }
}

if (!customElements.get("grave-plane-takeoff")) {
  customElements.define("grave-plane-takeoff", PlaneTakeoffElement);
}

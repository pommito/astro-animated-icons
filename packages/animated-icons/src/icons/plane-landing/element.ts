import { createIconElement, type IconHandle } from "../../element";
import { planeLandingRecipe } from "./definition";

export type PlaneLandingIconHandle = IconHandle;

const PlaneLandingElement = createIconElement(planeLandingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-plane-landing": InstanceType<typeof PlaneLandingElement>;
  }
}

if (!customElements.get("grave-plane-landing")) {
  customElements.define("grave-plane-landing", PlaneLandingElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { briefcaseBusinessRecipe } from "./definition";

export type BriefcaseBusinessIconHandle = IconHandle;
const BriefcaseBusinessElement = createIconElement(briefcaseBusinessRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-briefcase-business": InstanceType<typeof BriefcaseBusinessElement>;
  }
}

if (!customElements.get("grave-briefcase-business")) {
  customElements.define("grave-briefcase-business", BriefcaseBusinessElement);
}

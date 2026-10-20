import { createIconElement, type IconHandle } from "../../element";
import { activityRecipe } from "./definition";

export type ActivityIconHandle = IconHandle;
const ActivityElement = createIconElement(activityRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-activity": InstanceType<typeof ActivityElement>;
  }
}

if (!customElements.get("grave-activity")) {
  customElements.define("grave-activity", ActivityElement);
}

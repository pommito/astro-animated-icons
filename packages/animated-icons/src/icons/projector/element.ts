import { createIconElement, type IconHandle } from "../../element";
import { projectorRecipe } from "./definition";

export type ProjectorIconHandle = IconHandle;
const ProjectorElement = createIconElement(projectorRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-projector": InstanceType<typeof ProjectorElement>;
  }
}

if (!customElements.get("grave-projector")) {
  customElements.define("grave-projector", ProjectorElement);
}

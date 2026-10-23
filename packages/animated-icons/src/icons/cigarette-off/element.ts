import { createIconElement, type IconHandle } from "../../element";
import { cigaretteOffRecipe } from "./definition";

export type CigaretteOffIconHandle = IconHandle;
const CigaretteOffElement = createIconElement(cigaretteOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cigarette-off": InstanceType<typeof CigaretteOffElement>;
  }
}

if (!customElements.get("grave-cigarette-off")) {
  customElements.define("grave-cigarette-off", CigaretteOffElement);
}

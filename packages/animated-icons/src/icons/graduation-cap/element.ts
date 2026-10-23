import { createIconElement, type IconHandle } from "../../element";
import { graduationCapRecipe } from "./definition";

export type GraduationCapIconHandle = IconHandle;

const GraduationCapElement = createIconElement(graduationCapRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-graduation-cap": InstanceType<typeof GraduationCapElement>;
  }
}

if (!customElements.get("grave-graduation-cap")) {
  customElements.define("grave-graduation-cap", GraduationCapElement);
}

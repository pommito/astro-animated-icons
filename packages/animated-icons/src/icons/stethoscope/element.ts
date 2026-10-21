import { createIconElement, type IconHandle } from "../../element";
import { stethoscopeRecipe } from "./definition";

export type StethoscopeIconHandle = IconHandle;
const StethoscopeElement = createIconElement(stethoscopeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-stethoscope": InstanceType<typeof StethoscopeElement>;
  }
}

if (!customElements.get("grave-stethoscope")) {
  customElements.define("grave-stethoscope", StethoscopeElement);
}

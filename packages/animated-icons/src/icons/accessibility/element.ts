import { createIconElement, type IconHandle } from "../../element";
import { accessibilityRecipe } from "./definition";

export type AccessibilityIconHandle = IconHandle;
const AccessibilityElement = createIconElement(accessibilityRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-accessibility": InstanceType<typeof AccessibilityElement>;
  }
}

if (!customElements.get("grave-accessibility")) {
  customElements.define("grave-accessibility", AccessibilityElement);
}

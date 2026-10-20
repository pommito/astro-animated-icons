import { createIconElement, type IconHandle } from "../../element";
import { badgeAlertRecipe } from "./definition";

export type BadgeAlertIconHandle = IconHandle;

const BadgeAlertElement = createIconElement(badgeAlertRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-badge-alert": InstanceType<typeof BadgeAlertElement>;
  }
}

if (!customElements.get("grave-badge-alert")) {
  customElements.define("grave-badge-alert", BadgeAlertElement);
}

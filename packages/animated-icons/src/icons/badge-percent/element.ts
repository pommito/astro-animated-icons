import { createIconElement, type IconHandle } from "../../element";
import { badgePercentRecipe } from "./definition";

export type BadgePercentIconHandle = IconHandle;

const BadgePercentElement = createIconElement(badgePercentRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-badge-percent": InstanceType<typeof BadgePercentElement>;
  }
}

if (!customElements.get("grave-badge-percent")) {
  customElements.define("grave-badge-percent", BadgePercentElement);
}

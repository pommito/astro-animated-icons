import { createIconElement, type IconHandle } from "../../element";
import { phoneMissedRecipe } from "./definition";

export type PhoneMissedIconHandle = IconHandle;

const PhoneMissedElement = createIconElement(phoneMissedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone-missed": InstanceType<typeof PhoneMissedElement>;
  }
}

if (!customElements.get("grave-phone-missed")) {
  customElements.define("grave-phone-missed", PhoneMissedElement);
}

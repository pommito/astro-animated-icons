import { createIconElement, type IconHandle } from "../../element";
import { phoneForwardedRecipe } from "./definition";

export type PhoneForwardedIconHandle = IconHandle;

const PhoneForwardedElement = createIconElement(phoneForwardedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone-forwarded": InstanceType<typeof PhoneForwardedElement>;
  }
}

if (!customElements.get("grave-phone-forwarded")) {
  customElements.define("grave-phone-forwarded", PhoneForwardedElement);
}

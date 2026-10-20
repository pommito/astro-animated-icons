import { createIconElement, type IconHandle } from "../../element";
import { phoneCallRecipe } from "./definition";

export type PhoneCallIconHandle = IconHandle;

const PhoneCallElement = createIconElement(phoneCallRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone-call": InstanceType<typeof PhoneCallElement>;
  }
}

if (!customElements.get("grave-phone-call")) {
  customElements.define("grave-phone-call", PhoneCallElement);
}

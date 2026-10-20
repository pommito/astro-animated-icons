import { createIconElement, type IconHandle } from "../../element";
import { phoneIncomingRecipe } from "./definition";

export type PhoneIncomingIconHandle = IconHandle;

const PhoneIncomingElement = createIconElement(phoneIncomingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone-incoming": InstanceType<typeof PhoneIncomingElement>;
  }
}

if (!customElements.get("grave-phone-incoming")) {
  customElements.define("grave-phone-incoming", PhoneIncomingElement);
}

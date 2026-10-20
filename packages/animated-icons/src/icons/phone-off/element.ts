import { createIconElement, type IconHandle } from "../../element";
import { phoneOffRecipe } from "./definition";

export type PhoneOffIconHandle = IconHandle;

const PhoneOffElement = createIconElement(phoneOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone-off": InstanceType<typeof PhoneOffElement>;
  }
}

if (!customElements.get("grave-phone-off")) {
  customElements.define("grave-phone-off", PhoneOffElement);
}

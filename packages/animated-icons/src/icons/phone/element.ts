import { createIconElement, type IconHandle } from "../../element";
import { phoneRecipe } from "./definition";

export type PhoneIconHandle = IconHandle;

const PhoneElement = createIconElement(phoneRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-phone": InstanceType<typeof PhoneElement>;
  }
}

if (!customElements.get("grave-phone")) {
  customElements.define("grave-phone", PhoneElement);
}

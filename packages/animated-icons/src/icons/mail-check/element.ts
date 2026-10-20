import { createIconElement, type IconHandle } from "../../element";
import { mailCheckRecipe } from "./definition";

export type MailCheckIconHandle = IconHandle;

const MailCheckElement = createIconElement(mailCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-mail-check": InstanceType<typeof MailCheckElement>;
  }
}

if (!customElements.get("grave-mail-check")) {
  customElements.define("grave-mail-check", MailCheckElement);
}

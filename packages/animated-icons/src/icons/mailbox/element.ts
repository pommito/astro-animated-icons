import { createIconElement, type IconHandle } from "../../element";
import { mailboxRecipe } from "./definition";

export type MailboxIconHandle = IconHandle;

const MailboxElement = createIconElement(mailboxRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-mailbox": InstanceType<typeof MailboxElement>;
  }
}

if (!customElements.get("grave-mailbox")) {
  customElements.define("grave-mailbox", MailboxElement);
}

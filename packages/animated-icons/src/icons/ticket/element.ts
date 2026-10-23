import { createIconElement, type IconHandle } from "../../element";
import { ticketRecipe } from "./definition";

export type TicketIconHandle = IconHandle;

const TicketElement = createIconElement(ticketRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ticket": InstanceType<typeof TicketElement>;
  }
}

if (!customElements.get("grave-ticket")) {
  customElements.define("grave-ticket", TicketElement);
}

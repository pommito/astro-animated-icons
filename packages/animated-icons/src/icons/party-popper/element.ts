import { createIconElement, type IconHandle } from "../../element";
import { partyPopperRecipe } from "./definition";

export type PartyPopperIconHandle = IconHandle;
const PartyPopperElement = createIconElement(partyPopperRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-party-popper": InstanceType<typeof PartyPopperElement>;
  }
}

if (!customElements.get("grave-party-popper")) {
  customElements.define("grave-party-popper", PartyPopperElement);
}

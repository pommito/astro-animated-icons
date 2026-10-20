import { createIconElement, type IconHandle } from "../../element";
import { shipRecipe } from "./definition";

export type ShipIconHandle = IconHandle;

const ShipElement = createIconElement(shipRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ship": InstanceType<typeof ShipElement>;
  }
}

if (!customElements.get("grave-ship")) {
  customElements.define("grave-ship", ShipElement);
}

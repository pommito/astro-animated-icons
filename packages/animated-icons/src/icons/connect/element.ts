import { createIconElement } from "../../element";
import { connectRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ConnectIconHandle = IconHandle;

const ConnectElement = createIconElement(connectRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-connect": InstanceType<typeof ConnectElement>;
  }
}

if (!customElements.get("grave-connect")) {
  customElements.define("grave-connect", ConnectElement);
}

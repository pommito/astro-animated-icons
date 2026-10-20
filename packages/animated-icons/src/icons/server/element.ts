import { createIconElement, type IconHandle } from "../../element";
import { serverRecipe } from "./definition";

export type ServerIconHandle = IconHandle;

const ServerElement = createIconElement(serverRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-server": InstanceType<typeof ServerElement>;
  }
}

if (!customElements.get("grave-server")) {
  customElements.define("grave-server", ServerElement);
}

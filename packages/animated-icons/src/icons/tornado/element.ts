import { createIconElement } from "../../element";
import { tornadoRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type TornadoIconHandle = IconHandle;

const TornadoElement = createIconElement(tornadoRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-tornado": InstanceType<typeof TornadoElement>;
  }
}

if (!customElements.get("grave-tornado")) {
  customElements.define("grave-tornado", TornadoElement);
}

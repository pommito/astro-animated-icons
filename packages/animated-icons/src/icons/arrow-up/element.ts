import { clearArrow } from "../arrow";
import { createIconElement } from "../../element";
import { animateArrowUp } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowUpIconHandle = IconHandle;

const ArrowUpElement = createIconElement({
  animate: animateArrowUp,
  clear: clearArrow,
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up": InstanceType<typeof ArrowUpElement>;
  }
}

if (!customElements.get("grave-arrow-up")) {
  customElements.define("grave-arrow-up", ArrowUpElement);
}

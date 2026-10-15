import { createIconElement } from "../../element";
import type { IconHandle } from "../../element";
import { clearDiagonalArrow } from "../diagonal-arrow";
import { animateArrowUpRight } from "./definition";

export type ArrowUpRightIconHandle = IconHandle;

const ArrowUpRightElement = createIconElement({ animate: animateArrowUpRight, clear: clearDiagonalArrow });

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up-right": InstanceType<typeof ArrowUpRightElement>;
  }
}

if (!customElements.get("grave-arrow-up-right")) {
  customElements.define("grave-arrow-up-right", ArrowUpRightElement);
}

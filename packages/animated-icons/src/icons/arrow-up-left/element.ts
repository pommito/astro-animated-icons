import { createIconElement } from "../../element";
import { animateArrowUpLeft } from "./definition";
import { clearDiagonalArrow } from "../diagonal-arrow";
import type { IconHandle } from "../../element";

export type ArrowUpLeftIconHandle = IconHandle;

const ArrowUpLeftElement = createIconElement({
  animate: animateArrowUpLeft,
  clear: clearDiagonalArrow,
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up-left": InstanceType<typeof ArrowUpLeftElement>;
  }
}

if (!customElements.get("grave-arrow-up-left")) {
  customElements.define("grave-arrow-up-left", ArrowUpLeftElement);
}

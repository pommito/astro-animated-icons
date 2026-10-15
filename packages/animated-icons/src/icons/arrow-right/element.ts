import { createIconElement } from "../../element";
import { animateArrowRight, clearArrowRight } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowRightIconHandle = IconHandle;

const ArrowRightElement = createIconElement({
  animate: animateArrowRight,
  clear: clearArrowRight,
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-right": InstanceType<typeof ArrowRightElement>;
  }
}

if (!customElements.get("grave-arrow-right")) {
  customElements.define("grave-arrow-right", ArrowRightElement);
}

import { clearArrow } from "../arrow";
import { createIconElement } from "../../element";
import { animateArrowLeft } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowLeftIconHandle = IconHandle;

const ArrowLeftElement = createIconElement({
  animate: animateArrowLeft,
  clear: clearArrow,
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-left": InstanceType<typeof ArrowLeftElement>;
  }
}

if (!customElements.get("grave-arrow-left")) {
  customElements.define("grave-arrow-left", ArrowLeftElement);
}

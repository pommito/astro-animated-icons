import { createIconElement } from "../../element";
import { animateArrowLeft } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowLeftIconHandle = IconHandle;

const ArrowLeftElement = createIconElement({
  animate: animateArrowLeft,
  clear(drawing) {
    drawing.querySelectorAll("path").forEach((path) => {
      path.style.removeProperty("transform");
      path.style.removeProperty("stroke-dasharray");
    });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-left": InstanceType<typeof ArrowLeftElement>;
  }
}

if (!customElements.get("grave-arrow-left")) {
  customElements.define("grave-arrow-left", ArrowLeftElement);
}

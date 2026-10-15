import { createIconElement } from "../../element";
import { animateAtSign } from "./definition";
import type { IconHandle } from "../../element";

export type AtSignIconHandle = IconHandle;

const AtSignElement = createIconElement({
  animate: animateAtSign,
  clear(drawing) {
    for (const shape of drawing.querySelectorAll<SVGElement>("circle, path")) {
      for (const property of ["opacity", "stroke-dasharray", "stroke-dashoffset"]) {
        shape.style.removeProperty(property);
      }
    }
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-at-sign": InstanceType<typeof AtSignElement>;
  }
}

if (!customElements.get("grave-at-sign")) {
  customElements.define("grave-at-sign", AtSignElement);
}

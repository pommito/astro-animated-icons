import { createIconElement } from "../../element";
import { animateCheck } from "./definition";
import type { IconHandle } from "../../element";

export type CheckIconHandle = IconHandle;

const CheckElement = createIconElement({
  animate: animateCheck,
  clear(drawing) {
    const path = drawing.querySelector("path")!;
    for (const property of ["opacity", "stroke-dasharray", "transform"]) {
      path.style.removeProperty(property);
    }
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-check": InstanceType<typeof CheckElement>;
  }
}

if (!customElements.get("grave-check")) {
  customElements.define("grave-check", CheckElement);
}

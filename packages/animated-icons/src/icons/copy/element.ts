import { createIconElement } from "../../element";
import { animateCopy } from "./definition";
import type { IconHandle } from "../../element";

export type CopyIconHandle = IconHandle;

const CopyElement = createIconElement({
  animate: animateCopy,
  clear(drawing) {
    drawing.querySelectorAll("rect, path").forEach((part) => {
      (part as SVGElement).style.removeProperty("transform");
    });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-copy": InstanceType<typeof CopyElement>;
  }
}

if (!customElements.get("grave-copy")) {
  customElements.define("grave-copy", CopyElement);
}

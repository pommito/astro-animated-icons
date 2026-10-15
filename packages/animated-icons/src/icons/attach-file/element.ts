import { createIconElement } from "../../element";
import { animateAttachFile } from "./definition";
import type { IconHandle } from "../../element";

export type AttachFileIconHandle = IconHandle;

const AttachFileElement = createIconElement({
  animate: animateAttachFile,
  clear(drawing) {
    const path = drawing.querySelector("path")!;
    for (const property of ["opacity", "stroke-dasharray"]) {
      path.style.removeProperty(property);
    }
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-attach-file": InstanceType<typeof AttachFileElement>;
  }
}

if (!customElements.get("grave-attach-file")) {
  customElements.define("grave-attach-file", AttachFileElement);
}

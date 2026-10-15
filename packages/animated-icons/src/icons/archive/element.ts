import { createIconElement } from "../../element";
import { animateArchive, clearArchive } from "./definition";
import type { IconHandle } from "../../element";

export type ArchiveIconHandle = IconHandle;

const ArchiveElement = createIconElement({
  animate: animateArchive,
  clear: clearArchive,
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-archive": InstanceType<typeof ArchiveElement>;
  }
}

if (!customElements.get("grave-archive")) {
  customElements.define("grave-archive", ArchiveElement);
}

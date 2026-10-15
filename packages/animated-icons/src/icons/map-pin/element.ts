import { createIconElement } from "../../element";
import { animateMapPin } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinIconHandle = IconHandle;

const MapPinElement = createIconElement({
  animate: animateMapPin,
  clear(drawing) {
    drawing.ownerSVGElement!.style.removeProperty("transform");
    const circle = drawing.querySelector("circle")!;
    circle.style.removeProperty("opacity");
    circle.style.removeProperty("stroke-dasharray");
    circle.style.removeProperty("stroke-dashoffset");
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin": InstanceType<typeof MapPinElement>;
  }
}

if (!customElements.get("grave-map-pin")) {
  customElements.define("grave-map-pin", MapPinElement);
}

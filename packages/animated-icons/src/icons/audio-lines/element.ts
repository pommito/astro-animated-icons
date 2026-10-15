import { createIconElement } from "../../element";
import { animateAudioLines, audioLines } from "./definition";
import type { IconHandle } from "../../element";

export type AudioLinesIconHandle = IconHandle;

const AudioLinesElement = createIconElement({
  animate: animateAudioLines,
  clear(drawing) {
    drawing.querySelectorAll<SVGPathElement>("[data-audio-line]").forEach((path, index) => {
      const line = audioLines[index];
      path.style.removeProperty("stroke-dasharray");
      path.style.removeProperty("stroke-dashoffset");
      if (line.normalLength !== line.length) {
        path.style.strokeDasharray = `${line.normalLength}px ${line.length}px`;
        path.style.strokeDashoffset = `${line.top - line.normalTop}px`;
      }
    });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "grave-audio-lines": InstanceType<typeof AudioLinesElement>;
  }
}

if (!customElements.get("grave-audio-lines")) {
  customElements.define("grave-audio-lines", AudioLinesElement);
}

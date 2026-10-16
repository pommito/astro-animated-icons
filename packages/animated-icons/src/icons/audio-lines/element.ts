import { createIconElement } from "../../element";
import { audioLinesRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AudioLinesIconHandle = IconHandle;

const AudioLinesElement = createIconElement(audioLinesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-audio-lines": InstanceType<typeof AudioLinesElement>;
  }
}

if (!customElements.get("grave-audio-lines")) {
  customElements.define("grave-audio-lines", AudioLinesElement);
}

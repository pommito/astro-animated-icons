import { createIconElement, type IconHandle } from "../../element";
import { drumRecipe } from "./definition";

export type DrumIconHandle = IconHandle;

const DrumElement = createIconElement(drumRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-drum": InstanceType<typeof DrumElement>;
  }
}

if (!customElements.get("grave-drum")) {
  customElements.define("grave-drum", DrumElement);
}

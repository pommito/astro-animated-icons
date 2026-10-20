import { createIconElement, type IconHandle } from "../../element";
import { pauseRecipe } from "./definition";

export type PauseIconHandle = IconHandle;

const PauseElement = createIconElement(pauseRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-pause": InstanceType<typeof PauseElement>;
  }
}

if (!customElements.get("grave-pause")) {
  customElements.define("grave-pause", PauseElement);
}

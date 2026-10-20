import { createIconElement, type IconHandle } from "../../element";
import { playRecipe } from "./definition";

export type PlayIconHandle = IconHandle;

const PlayElement = createIconElement(playRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-play": InstanceType<typeof PlayElement>;
  }
}

if (!customElements.get("grave-play")) {
  customElements.define("grave-play", PlayElement);
}

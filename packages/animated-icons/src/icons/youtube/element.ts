import { createIconElement } from "../../element";
import { youtubeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type YoutubeIconHandle = IconHandle;

const YoutubeElement = createIconElement(youtubeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-youtube": InstanceType<typeof YoutubeElement>;
  }
}

if (!customElements.get("grave-youtube")) {
  customElements.define("grave-youtube", YoutubeElement);
}

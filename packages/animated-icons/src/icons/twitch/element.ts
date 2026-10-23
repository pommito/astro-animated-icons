import { createIconElement } from "../../element";
import { twitchRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type TwitchIconHandle = IconHandle;

const TwitchElement = createIconElement(twitchRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-twitch": InstanceType<typeof TwitchElement>;
  }
}

if (!customElements.get("grave-twitch")) {
  customElements.define("grave-twitch", TwitchElement);
}

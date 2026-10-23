import { createIconElement } from "../../element";
import { discordRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type DiscordIconHandle = IconHandle;

const DiscordElement = createIconElement(discordRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-discord": InstanceType<typeof DiscordElement>;
  }
}

if (!customElements.get("grave-discord")) {
  customElements.define("grave-discord", DiscordElement);
}

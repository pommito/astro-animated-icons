import { createIconElement } from "../../element";
import { settingsRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SettingsIconHandle = IconHandle;

const SettingsElement = createIconElement(settingsRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-settings": InstanceType<typeof SettingsElement>;
  }
}

if (!customElements.get("grave-settings")) {
  customElements.define("grave-settings", SettingsElement);
}

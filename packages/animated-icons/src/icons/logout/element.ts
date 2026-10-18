import { createIconElement } from "../../element";
import { logoutRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LogoutIconHandle = IconHandle;

const LogoutElement = createIconElement(logoutRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-logout": InstanceType<typeof LogoutElement>;
  }
}

if (!customElements.get("grave-logout")) {
  customElements.define("grave-logout", LogoutElement);
}

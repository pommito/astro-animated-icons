import { createIconElement } from "../../element";
import { loginRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LoginIconHandle = IconHandle;

const LoginElement = createIconElement(loginRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-login": InstanceType<typeof LoginElement>;
  }
}

if (!customElements.get("grave-login")) {
  customElements.define("grave-login", LoginElement);
}

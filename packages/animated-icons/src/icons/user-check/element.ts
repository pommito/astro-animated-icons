import { createIconElement } from "../../element";
import { userCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserCheckIconHandle = IconHandle;

const UserCheckElement = createIconElement(userCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user-check": InstanceType<typeof UserCheckElement>;
  }
}

if (!customElements.get("grave-user-check")) {
  customElements.define("grave-user-check", UserCheckElement);
}

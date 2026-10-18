import { createIconElement } from "../../element";
import { usersRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UsersIconHandle = IconHandle;

const UsersElement = createIconElement(usersRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-users": InstanceType<typeof UsersElement>;
  }
}

if (!customElements.get("grave-users")) {
  customElements.define("grave-users", UsersElement);
}

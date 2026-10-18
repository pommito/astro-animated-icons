import { createIconElement } from "../../element";
import { userRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserIconHandle = IconHandle;

const UserElement = createIconElement(userRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user": InstanceType<typeof UserElement>;
  }
}

if (!customElements.get("grave-user")) {
  customElements.define("grave-user", UserElement);
}

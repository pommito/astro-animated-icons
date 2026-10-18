import { createIconElement } from "../../element";
import { userPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserPlusIconHandle = IconHandle;

const UserPlusElement = createIconElement(userPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user-plus": InstanceType<typeof UserPlusElement>;
  }
}

if (!customElements.get("grave-user-plus")) {
  customElements.define("grave-user-plus", UserPlusElement);
}

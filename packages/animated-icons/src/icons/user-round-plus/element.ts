import { createIconElement } from "../../element";
import { userRoundPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserRoundPlusIconHandle = IconHandle;

const UserRoundPlusElement = createIconElement(userRoundPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user-round-plus": InstanceType<typeof UserRoundPlusElement>;
  }
}

if (!customElements.get("grave-user-round-plus")) {
  customElements.define("grave-user-round-plus", UserRoundPlusElement);
}

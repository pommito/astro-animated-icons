import { createIconElement } from "../../element";
import { userRoundCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserRoundCheckIconHandle = IconHandle;

const UserRoundCheckElement = createIconElement(userRoundCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user-round-check": InstanceType<typeof UserRoundCheckElement>;
  }
}

if (!customElements.get("grave-user-round-check")) {
  customElements.define("grave-user-round-check", UserRoundCheckElement);
}

import { createIconElement } from "../../element";
import { userRoundCogRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UserRoundCogIconHandle = IconHandle;

const UserRoundCogElement = createIconElement(userRoundCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-user-round-cog": InstanceType<typeof UserRoundCogElement>;
  }
}

if (!customElements.get("grave-user-round-cog")) {
  customElements.define("grave-user-round-cog", UserRoundCogElement);
}

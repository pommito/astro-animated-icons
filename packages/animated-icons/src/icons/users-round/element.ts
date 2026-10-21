import { createIconElement, type IconHandle } from "../../element";
import { usersRoundRecipe } from "./definition";

export type UsersRoundIconHandle = IconHandle;
const UsersRoundElement = createIconElement(usersRoundRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-users-round": InstanceType<typeof UsersRoundElement>;
  }
}

if (!customElements.get("grave-users-round")) {
  customElements.define("grave-users-round", UsersRoundElement);
}

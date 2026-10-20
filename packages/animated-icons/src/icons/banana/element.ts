import { createIconElement, type IconHandle } from "../../element";
import { bananaRecipe } from "./definition";

export type BananaIconHandle = IconHandle;
const BananaElement = createIconElement(bananaRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-banana": InstanceType<typeof BananaElement>;
  }
}

if (!customElements.get("grave-banana")) {
  customElements.define("grave-banana", BananaElement);
}

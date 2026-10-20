import { createIconElement, type IconHandle } from "../../element";
import { clapRecipe } from "./definition";

export type ClapIconHandle = IconHandle;
const ClapElement = createIconElement(clapRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-clap": InstanceType<typeof ClapElement>;
  }
}

if (!customElements.get("grave-clap")) {
  customElements.define("grave-clap", ClapElement);
}

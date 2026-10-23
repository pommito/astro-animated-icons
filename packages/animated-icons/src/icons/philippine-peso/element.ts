import { createIconElement, type IconHandle } from "../../element";
import { philippinePesoRecipe } from "./definition";

export type PhilippinePesoIconHandle = IconHandle;

const PhilippinePesoElement = createIconElement(philippinePesoRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-philippine-peso": InstanceType<typeof PhilippinePesoElement>;
  }
}

if (!customElements.get("grave-philippine-peso")) {
  customElements.define("grave-philippine-peso", PhilippinePesoElement);
}

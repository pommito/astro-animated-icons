import { createIconElement, type IconHandle } from "../../element";
import { georgianLariRecipe } from "./definition";

export type GeorgianLariIconHandle = IconHandle;

const GeorgianLariElement = createIconElement(georgianLariRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-georgian-lari": InstanceType<typeof GeorgianLariElement>;
  }
}

if (!customElements.get("grave-georgian-lari")) {
  customElements.define("grave-georgian-lari", GeorgianLariElement);
}

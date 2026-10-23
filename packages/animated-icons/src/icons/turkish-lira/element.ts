import { createIconElement, type IconHandle } from "../../element";
import { turkishLiraRecipe } from "./definition";

export type TurkishLiraIconHandle = IconHandle;

const TurkishLiraElement = createIconElement(turkishLiraRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-turkish-lira": InstanceType<typeof TurkishLiraElement>;
  }
}

if (!customElements.get("grave-turkish-lira")) {
  customElements.define("grave-turkish-lira", TurkishLiraElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { russianRubleRecipe } from "./definition";

export type RussianRubleIconHandle = IconHandle;

const RussianRubleElement = createIconElement(russianRubleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-russian-ruble": InstanceType<typeof RussianRubleElement>;
  }
}

if (!customElements.get("grave-russian-ruble")) {
  customElements.define("grave-russian-ruble", RussianRubleElement);
}

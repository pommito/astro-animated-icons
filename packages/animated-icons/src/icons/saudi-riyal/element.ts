import { createIconElement, type IconHandle } from "../../element";
import { saudiRiyalRecipe } from "./definition";

export type SaudiRiyalIconHandle = IconHandle;

const SaudiRiyalElement = createIconElement(saudiRiyalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-saudi-riyal": InstanceType<typeof SaudiRiyalElement>;
  }
}

if (!customElements.get("grave-saudi-riyal")) {
  customElements.define("grave-saudi-riyal", SaudiRiyalElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { rockingChairRecipe } from "./definition";

export type RockingChairIconHandle = IconHandle;

const RockingChairElement = createIconElement(rockingChairRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-rocking-chair": InstanceType<typeof RockingChairElement>;
  }
}

if (!customElements.get("grave-rocking-chair")) {
  customElements.define("grave-rocking-chair", RockingChairElement);
}

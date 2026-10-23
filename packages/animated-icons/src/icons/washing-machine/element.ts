import { createIconElement, type IconHandle } from "../../element";
import { washingMachineRecipe } from "./definition";

export type WashingMachineIconHandle = IconHandle;

const WashingMachineElement = createIconElement(washingMachineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-washing-machine": InstanceType<typeof WashingMachineElement>;
  }
}

if (!customElements.get("grave-washing-machine")) {
  customElements.define("grave-washing-machine", WashingMachineElement);
}

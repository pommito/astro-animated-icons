import { createIconElement, type IconHandle } from "../../element";
import { laptopMinimalCheckRecipe } from "./definition";

export type LaptopMinimalCheckIconHandle = IconHandle;
const LaptopMinimalCheckElement = createIconElement(laptopMinimalCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-laptop-minimal-check": InstanceType<typeof LaptopMinimalCheckElement>;
  }
}

if (!customElements.get("grave-laptop-minimal-check")) {
  customElements.define("grave-laptop-minimal-check", LaptopMinimalCheckElement);
}

import { createIconElement } from "../../element";
import { dribbbleRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type DribbbleIconHandle = IconHandle;

const DribbbleElement = createIconElement(dribbbleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-dribbble": InstanceType<typeof DribbbleElement>;
  }
}

if (!customElements.get("grave-dribbble")) {
  customElements.define("grave-dribbble", DribbbleElement);
}

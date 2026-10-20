import { createIconElement } from "../../element";
import { dropletRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type DropletIconHandle = IconHandle;

const DropletElement = createIconElement(dropletRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-droplet": InstanceType<typeof DropletElement>;
  }
}

if (!customElements.get("grave-droplet")) {
  customElements.define("grave-droplet", DropletElement);
}

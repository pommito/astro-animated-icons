import { createIconElement } from "../../element";
import { instagramRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type InstagramIconHandle = IconHandle;

const InstagramElement = createIconElement(instagramRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-instagram": InstanceType<typeof InstagramElement>;
  }
}

if (!customElements.get("grave-instagram")) {
  customElements.define("grave-instagram", InstagramElement);
}

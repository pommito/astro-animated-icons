import { createIconElement } from "../../element";
import { linkedinRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type LinkedinIconHandle = IconHandle;

const LinkedinElement = createIconElement(linkedinRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-linkedin": InstanceType<typeof LinkedinElement>;
  }
}

if (!customElements.get("grave-linkedin")) {
  customElements.define("grave-linkedin", LinkedinElement);
}

import { createIconElement } from "../../element";
import { externalLinkRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ExternalLinkIconHandle = IconHandle;

const ExternalLinkElement = createIconElement(externalLinkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-external-link": InstanceType<typeof ExternalLinkElement>;
  }
}

if (!customElements.get("grave-external-link")) {
  customElements.define("grave-external-link", ExternalLinkElement);
}

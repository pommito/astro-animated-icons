import { createIconElement } from "../../element";
import { gitCompareRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitCompareIconHandle = IconHandle;

const GitCompareElement = createIconElement(gitCompareRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-compare": InstanceType<typeof GitCompareElement>;
  }
}

if (!customElements.get("grave-git-compare")) {
  customElements.define("grave-git-compare", GitCompareElement);
}

import { createIconElement } from "../../element";
import { gitCompareArrowsRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitCompareArrowsIconHandle = IconHandle;

const GitCompareArrowsElement = createIconElement(gitCompareArrowsRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-compare-arrows": InstanceType<typeof GitCompareArrowsElement>;
  }
}

if (!customElements.get("grave-git-compare-arrows")) {
  customElements.define("grave-git-compare-arrows", GitCompareArrowsElement);
}

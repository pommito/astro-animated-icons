import { createIconElement } from "../../element";
import { gitMergeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitMergeIconHandle = IconHandle;

const GitMergeElement = createIconElement(gitMergeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-merge": InstanceType<typeof GitMergeElement>;
  }
}

if (!customElements.get("grave-git-merge")) {
  customElements.define("grave-git-merge", GitMergeElement);
}

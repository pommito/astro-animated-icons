import { createIconElement } from "../../element";
import { gitCommitHorizontalRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitCommitHorizontalIconHandle = IconHandle;

const GitCommitHorizontalElement = createIconElement(gitCommitHorizontalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-commit-horizontal": InstanceType<typeof GitCommitHorizontalElement>;
  }
}

if (!customElements.get("grave-git-commit-horizontal")) {
  customElements.define("grave-git-commit-horizontal", GitCommitHorizontalElement);
}

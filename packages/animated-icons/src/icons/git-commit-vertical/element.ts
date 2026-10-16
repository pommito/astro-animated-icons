import { createIconElement } from "../../element";
import { gitCommitVerticalRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitCommitVerticalIconHandle = IconHandle;

const GitCommitVerticalElement = createIconElement(gitCommitVerticalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-commit-vertical": InstanceType<typeof GitCommitVerticalElement>;
  }
}

if (!customElements.get("grave-git-commit-vertical")) {
  customElements.define("grave-git-commit-vertical", GitCommitVerticalElement);
}

import { createIconElement } from "../../element";
import { gitPullRequestRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitPullRequestIconHandle = IconHandle;

const GitPullRequestElement = createIconElement(gitPullRequestRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-pull-request": InstanceType<typeof GitPullRequestElement>;
  }
}

if (!customElements.get("grave-git-pull-request")) {
  customElements.define("grave-git-pull-request", GitPullRequestElement);
}

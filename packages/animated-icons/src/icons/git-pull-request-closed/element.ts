import { createIconElement } from "../../element";
import { gitPullRequestClosedRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitPullRequestClosedIconHandle = IconHandle;

const GitPullRequestClosedElement = createIconElement(gitPullRequestClosedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-pull-request-closed": InstanceType<typeof GitPullRequestClosedElement>;
  }
}

if (!customElements.get("grave-git-pull-request-closed")) {
  customElements.define("grave-git-pull-request-closed", GitPullRequestClosedElement);
}

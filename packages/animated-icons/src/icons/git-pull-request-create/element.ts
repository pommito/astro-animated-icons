import { createIconElement } from "../../element";
import { gitPullRequestCreateRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitPullRequestCreateIconHandle = IconHandle;

const GitPullRequestCreateElement = createIconElement(gitPullRequestCreateRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-pull-request-create": InstanceType<typeof GitPullRequestCreateElement>;
  }
}

if (!customElements.get("grave-git-pull-request-create")) {
  customElements.define("grave-git-pull-request-create", GitPullRequestCreateElement);
}

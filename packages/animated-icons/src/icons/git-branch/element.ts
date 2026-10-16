import { createIconElement } from "../../element";
import { gitBranchRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitBranchIconHandle = IconHandle;

const GitBranchElement = createIconElement(gitBranchRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-branch": InstanceType<typeof GitBranchElement>;
  }
}

if (!customElements.get("grave-git-branch")) {
  customElements.define("grave-git-branch", GitBranchElement);
}

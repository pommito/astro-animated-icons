import { createIconElement } from "../../element";
import { gitForkRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitForkIconHandle = IconHandle;

const GitForkElement = createIconElement(gitForkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-fork": InstanceType<typeof GitForkElement>;
  }
}

if (!customElements.get("grave-git-fork")) {
  customElements.define("grave-git-fork", GitForkElement);
}

import { createIconElement } from "../../element";
import { gitGraphRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitGraphIconHandle = IconHandle;

const GitGraphElement = createIconElement(gitGraphRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-git-graph": InstanceType<typeof GitGraphElement>;
  }
}

if (!customElements.get("grave-git-graph")) {
  customElements.define("grave-git-graph", GitGraphElement);
}

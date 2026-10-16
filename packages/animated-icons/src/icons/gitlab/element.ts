import { createIconElement } from "../../element";
import { gitlabRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GitlabIconHandle = IconHandle;

const GitlabElement = createIconElement(gitlabRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gitlab": InstanceType<typeof GitlabElement>;
  }
}

if (!customElements.get("grave-gitlab")) {
  customElements.define("grave-gitlab", GitlabElement);
}

import { createIconElement } from "../../element";
import { githubRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GithubIconHandle = IconHandle;

const GithubElement = createIconElement(githubRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-github": InstanceType<typeof GithubElement>;
  }
}

if (!customElements.get("grave-github")) {
  customElements.define("grave-github", GithubElement);
}

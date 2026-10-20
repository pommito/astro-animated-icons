import { createIconElement, type IconHandle } from "../../element";
import { serverCogRecipe } from "./definition";

export type ServerCogIconHandle = IconHandle;

const ServerCogElement = createIconElement(serverCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-server-cog": InstanceType<typeof ServerCogElement>;
  }
}

if (!customElements.get("grave-server-cog")) {
  customElements.define("grave-server-cog", ServerCogElement);
}

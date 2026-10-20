import { createIconElement, type IconHandle } from "../../element";
import { serverCrashRecipe } from "./definition";

export type ServerCrashIconHandle = IconHandle;

const ServerCrashElement = createIconElement(serverCrashRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-server-crash": InstanceType<typeof ServerCrashElement>;
  }
}

if (!customElements.get("grave-server-crash")) {
  customElements.define("grave-server-crash", ServerCrashElement);
}

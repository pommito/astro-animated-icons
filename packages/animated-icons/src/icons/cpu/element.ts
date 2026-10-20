import { createIconElement, type IconHandle } from "../../element";
import { cpuRecipe } from "./definition";

export type CpuIconHandle = IconHandle;

const CpuElement = createIconElement(cpuRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cpu": InstanceType<typeof CpuElement>;
  }
}

if (!customElements.get("grave-cpu")) {
  customElements.define("grave-cpu", CpuElement);
}

import { createIconElement, type IconHandle } from "../../element";
import { fileChartLineRecipe } from "./definition";

export type FileChartLineIconHandle = IconHandle;

const FileChartLineElement = createIconElement(fileChartLineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-file-chart-line": InstanceType<typeof FileChartLineElement>;
  }
}

if (!customElements.get("grave-file-chart-line")) {
  customElements.define("grave-file-chart-line", FileChartLineElement);
}

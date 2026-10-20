import { createIconElement, type IconHandle } from "../../element";
import { workflowRecipe } from "./definition";

export type WorkflowIconHandle = IconHandle;

const WorkflowElement = createIconElement(workflowRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-workflow": InstanceType<typeof WorkflowElement>;
  }
}

if (!customElements.get("grave-workflow")) {
  customElements.define("grave-workflow", WorkflowElement);
}

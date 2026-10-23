import { createIconElement, type IconHandle } from "../../element";
import { constructionRecipe } from "./definition";

export type ConstructionIconHandle = IconHandle;
const ConstructionBase = createIconElement(constructionRecipe);
let nextPatternId = 0;

class ConstructionElement extends ConstructionBase {
  connectedCallback() {
    const pattern = this.querySelector<SVGPatternElement>("[data-stripes]");
    const rectangle = this.querySelector("rect");
    if (pattern && rectangle) {
      // Template clones duplicate SVG IDs, so bind each connected instance to its own pattern.
      pattern.id = `grave-construction-client-${nextPatternId++}`;
      rectangle.setAttribute("fill", `url(#${pattern.id})`);
    }
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "grave-construction": InstanceType<typeof ConstructionElement>;
  }
}

if (!customElements.get("grave-construction")) {
  customElements.define("grave-construction", ConstructionElement);
}

import { createIconElement, type IconRecipe } from "../element";

export function registerCSSRecipes<T>(attribute: string, create: (data: T) => IconRecipe) {
  const scan = (root: Document | DocumentFragment) => {
    for (const host of root.querySelectorAll<HTMLElement>("[" + attribute + "]")) {
      const tag = host.localName;
      if (tag.startsWith("grave-") && host.hasAttribute("data-grave-icon") && !customElements.get(tag)) {
        customElements.define(tag, createIconElement(create(JSON.parse(host.getAttribute(attribute)!))));
      }
    }
    for (const template of root.querySelectorAll("template")) scan(template.content);
  };
  scan(document);
  document.addEventListener("astro:page-load", () => scan(document));
}

import { createIconElement, type IconRecipe } from "../../packages/animated-icons/src/element";

export function registerDeliveryProof<T>(attribute: string, create: (data: T) => IconRecipe) {
  const source = attribute.replace(/-recipe$/, "-src");
  const pending = new Map<string, Promise<void>>();
  const define = (tag: string, data: T) => {
    if (!customElements.get(tag)) customElements.define(tag, createIconElement(create(data)));
  };
  const scan = (root: Document | DocumentFragment) => {
    const roots: (Document | DocumentFragment)[] = [];
    const collect = (part: Document | DocumentFragment) => {
      roots.push(part);
      for (const template of part.querySelectorAll("template")) collect(template.content);
    };
    collect(root);
    for (const part of roots) {
      for (const host of part.querySelectorAll<HTMLElement>("[" + attribute + "]")) {
        if (host.localName.startsWith("grave-") && host.hasAttribute("data-grave-icon")) define(host.localName, JSON.parse(host.getAttribute(attribute)!));
      }
    }
    for (const part of roots) {
      for (const host of part.querySelectorAll<HTMLElement>("[" + source + "]")) {
        const tag = host.localName;
        if (!tag.startsWith("grave-") || !host.hasAttribute("data-grave-icon") || customElements.get(tag) || pending.has(tag)) continue;
        const url = new URL(host.getAttribute(source)!, document.baseURI);
        const request = fetch(url).then(response => {
          if (!response.ok) throw Error("Recipe fetch failed: " + response.status);
          return response.json();
        }).then(data => define(tag, data)).finally(() => pending.delete(tag));
        pending.set(tag, request);
        request.catch(error => console.error("Recipe delivery proof", tag, error));
      }
    }
  };
  scan(document);
  document.addEventListener("astro:page-load", () => scan(document));
}

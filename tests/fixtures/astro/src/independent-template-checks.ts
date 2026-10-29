import type { FolderDownIconHandle as IconHandle } from "@grave/animated-icons/astro";
const slugs = [...document.querySelector<HTMLTemplateElement>("#first")!.content.querySelectorAll("[data-grave-icon]")].map(icon => icon.localName.slice(6));
await Promise.all(slugs.map(slug => "grave-" + slug).map(tag => customElements.whenDefined(tag)));
const template = document.querySelector<HTMLTemplateElement>("#second")!;
document.querySelector("#after")!.append(template.content.cloneNode(true));
document.querySelector("#check-templates")!.addEventListener("click", () => {
  const results: Record<string, boolean> = {};
  results.clonedBeforeRegistration = document.querySelector<HTMLElement>("#before")!.dataset.beforeRegistration === "true";
  results.firstTemplateStillInert = document.querySelector<HTMLTemplateElement>("#first")!.content.querySelectorAll("[data-grave-icon]").length === slugs.length;
  results.reducedMotionDisabled = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const location of ["before", "after"]) for (const kind of slugs) {
    const icon = document.querySelector<HTMLElement & IconHandle>("#" + location + " grave-" + kind)!;
    const count = kind === "calendar-days" ? 6 : kind === "circle-dashed" ? 8 : 1;
    const animations = () => icon.getAnimations({ subtree: true });
    icon.startAnimation();
    const entry = animations();
    entry.forEach(animation => { animation.pause(); animation.currentTime = 125; });
    results[location + "/" + kind + "/entry"] = entry.length === count;
    icon.stopAnimation();
    results[location + "/" + kind + "/return"] = animations().length === count;
    const parent = icon.parentElement!;
    icon.remove();
    results[location + "/" + kind + "/disconnect"] = animations().length === 0 && !icon.hasAttribute("data-cycle-state") && !icon.hasAttribute("data-opacity-state");
    parent.append(icon);
    icon.startAnimation();
    results[location + "/" + kind + "/reconnect"] = animations().length === count;
    icon.remove(); parent.append(icon);
  }
  for (const kind of slugs) {
    results[kind + "/oneActiveSheet"] = document.querySelectorAll('[data-grave-cycle-style="' + kind + '"]').length === 1;
  }
  const late = document.createElement("section");
  document.body.append(late);
  late.append(document.querySelector<HTMLTemplateElement>("#first")!.content.cloneNode(true));
  for (const kind of slugs) {
    const icon = late.querySelector<HTMLElement & IconHandle>("grave-" + kind)!;
    const sheetCount = () => document.querySelectorAll('[data-grave-cycle-style="' + kind + '"]').length;
    results[kind + "/lateTemplateOnConnect"] = sheetCount() === 1;
    const count = kind === "calendar-days" ? 6 : kind === "circle-dashed" ? 8 : 1;
    icon.startAnimation();
    results[kind + "/lateTemplatePlayback"] = icon.getAnimations({ subtree: true }).length === count && sheetCount() === 1;
  }
  late.remove();
  document.querySelector("#template-result")!.textContent = JSON.stringify({ results, failures: Object.keys(results).filter(key => !results[key]) });
});

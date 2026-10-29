import type { IconHandle } from "../../../../packages/animated-icons/src/element";
const icons = [...document.querySelectorAll<HTMLElement & IconHandle>("[data-grave-icon]")];
await Promise.all(icons.map(icon => customElements.whenDefined(icon.localName)));
const results: Record<string, Record<string, boolean>> = {};
const tracks = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
const report = () => {
  document.querySelector("#media-result")!.textContent = JSON.stringify({ preference: matchMedia("(prefers-reduced-motion: reduce)").matches, results, failures: Object.keys(results).filter(id => Object.values(results[id]).some(value => !value)) });
};
document.querySelector("#prepare")!.addEventListener("click", () => {
  for (const icon of icons) {
    icon.startAnimation();
    const animations = tracks(icon);
    animations.forEach(animation => { animation.pause(); animation.currentTime = 125; });
    results[icon.localName] = { registered: typeof icon.startAnimation === "function", entryStarts: animations.length > 0, pausedBeforePreferenceChange: animations.length > 0 };
  }
  document.querySelector<HTMLButtonElement>("#check-reduced")!.disabled = false;
  report();
});
document.querySelector("#check-reduced")!.addEventListener("click", () => {
  for (const icon of icons) {
    const result = results[icon.localName];
    result.nativePreferenceMatches = matchMedia("(prefers-reduced-motion: reduce)").matches;
    result.nativePreferenceCancels = tracks(icon).length === 0;
    result.nativePreferenceClears = !icon.hasAttribute("data-cycle-state") && !icon.hasAttribute("data-opacity-state") && [...icon.querySelectorAll<SVGElement>("svg,g,path,circle,rect")].every(element => !element.style.transform && !element.style.opacity && !element.style.getPropertyValue("--grave-cycle-from") && !element.style.getPropertyValue("--grave-opacity-from") && !element.style.getPropertyValue("--grave-opacity-entry-from"));
    result.capturedVariablesClear = [...icon.style].every(property => !property.startsWith("--grave-cycle-")) && !icon.querySelector<SVGElement>("svg")!.style.transformOrigin;
    icon.startAnimation();
    result.reducedManualStatic = tracks(icon).length === 0;
  }
  document.querySelector<HTMLButtonElement>("#check-restored")!.disabled = false;
  report();
});
document.querySelector("#check-restored")!.addEventListener("click", () => {
  for (const icon of icons) {
    icon.startAnimation();
    results[icon.localName].replayAfterNativePreference = tracks(icon).length > 0;
    const parent = icon.parentElement!;
    icon.remove(); parent.append(icon);
  }
  report();
});

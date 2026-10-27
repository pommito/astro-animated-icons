export function ensureRecipeCSS(id: string, document: Document, generate: () => string) {
  const [active, ...duplicates] = document.querySelectorAll('style[data-grave-cycle-style="' + id + '"]');
  duplicates.forEach(sheet => sheet.remove());
  if (active) return;
  const sheet = document.createElement("style");
  sheet.setAttribute("data-grave-cycle-style", id);
  sheet.textContent = generate();
  document.head.append(sheet);
}

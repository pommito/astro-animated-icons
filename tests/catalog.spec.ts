import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { readCatalog } from "../scripts/catalog.mjs";

const catalog = readCatalog();

test("every public icon loads its production registration", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/");
  expect(response!.status()).toBe(200);
  expect(catalog.length).toBeGreaterThan(0);
  const scripts = catalog.flatMap(({ slug }) => {
    const route = slug === "arrow-left" ? "single" : `${slug}-single`;
    const html = readFileSync(new URL(`fixtures/astro/dist/${route}/index.html`, import.meta.url), "utf8");
    const entries = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(([, src]) => src);
    expect(entries.length, `${slug} production entry`).toBeGreaterThan(0);
    return entries;
  });
  await page.evaluate(async entries => {
    await Promise.all(entries.map(entry => import(entry)));
  }, [...new Set(scripts)]);
  await page.waitForFunction(icons => icons.every(({ tag }) => !!customElements.get(tag)), catalog);
  const actual = await page.evaluate(icons => icons.map(({ tag }) => {
    const icon = document.createElement(tag) as HTMLElement & { startAnimation?: unknown; stopAnimation?: unknown };
    return { tag: icon.localName, start: typeof icon.startAnimation, stop: typeof icon.stopAnimation };
  }), catalog);
  expect(actual).toEqual(catalog.map(({ tag }) => ({ tag, start: "function", stop: "function" })));
  expect(errors).toEqual([]);
});

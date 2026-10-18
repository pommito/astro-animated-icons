import { expect, test } from "@playwright/test";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { documentIcons } from "./helpers/documents.js";

testIconBehavior(documentIcons, [100, 450, 650]);

test("all document and transfer adapters match the original React components at small sizes", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/documents-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction(
    (tags) => tags.every((tag) => !!customElements.get(tag)),
    documentIcons.map((icon) => icon.tag),
  );
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "documents-seek",
    times: [0, 50, 100, 150, 200, 300, 400, 600, 800, 1000, 1500],
    origin: "svg" as const,
  });
  const { maximumGeometry, maximumPaint } = compareUpstreamPoses(samples);
  expect(errors).toEqual([]);
  console.log(
    `Document comparison: ten original React components at 14, 16, 24, and 28 px; maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${maximumPaint.toFixed(6)}.`,
  );
});

import { expect, test } from "@playwright/test";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { userIcons } from "./helpers/user-icons.js";

testIconBehavior(userIcons, [100, 450, 650]);

test("all user adapters match the original React components at small sizes", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/users-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction(
    (tags) => tags.every((tag) => !!customElements.get(tag)),
    userIcons.map((icon) => icon.tag),
  );
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  const samples = await page.evaluate(() => {
    return [0, 50, 100, 150, 200, 300, 400, 600, 800, 1000, 1500].flatMap((time) => {
      document.dispatchEvent(new CustomEvent("user-seek", { detail: time }));
      return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")].map((row) => {
        const pose = (selector: string) =>
          [
            ...row.querySelectorAll<SVGGeometryElement>(
              `${selector} path, ${selector} circle, ${selector} line, ${selector} rect`,
            ),
          ].map((shape) => {
            const box = shape.getBoundingClientRect();
            const svg = shape.ownerSVGElement!.getBoundingClientRect();
            let opacity = 1;
            let parent: Element | null = shape;
            while (parent && parent !== shape.ownerSVGElement) {
              opacity *= Number(getComputedStyle(parent).opacity);
              parent = parent.parentElement;
            }
            const length = Number(shape.getAttribute("pathLength")) || shape.getTotalLength();
            const dash = parseFloat(getComputedStyle(shape).strokeDasharray);
            return [
              box.x - svg.x,
              box.y - svg.y,
              box.width,
              box.height,
              opacity,
              Number.isNaN(dash) ? 1 : dash / length,
              parseFloat(getComputedStyle(shape).strokeDashoffset) / length,
            ];
          });
        return {
          time,
          icon: row.dataset.icon,
          size: row.dataset.size,
          adapter: pose("[data-adapter]"),
          reference: pose("[data-reference]"),
        };
      });
    });
  });
  let maximumGeometry = 0;
  let maximumPaint = 0;
  for (const sample of samples) {
    expect(sample.adapter.length).toBe(sample.reference.length);
    sample.adapter.forEach((shape, index) =>
      shape.forEach((value, coordinate) => {
        const difference = Math.abs(value - sample.reference[index][coordinate]);
        if (coordinate < 4) maximumGeometry = Math.max(maximumGeometry, difference);
        else maximumPaint = Math.max(maximumPaint, difference);
        expect(
          difference,
          `${sample.icon} ${sample.size}px at ${sample.time}ms, shape ${index}, coordinate ${coordinate}`,
        ).toBeLessThan(coordinate < 4 ? 0.03 : 0.005);
      }),
    );
  }
  expect(errors).toEqual([]);
  console.log(
    `User comparison: seven original React components at 14, 16, 24, and 28 px; maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${maximumPaint.toFixed(6)}.`,
  );
});

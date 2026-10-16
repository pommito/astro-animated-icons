import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { folders } from "./helpers/folders.js";

for (const icon of folders) {
  test.describe(icon.name, () => {
    if (!icon.loop)
      test("stopping a completed entry starts from the held pose", async ({ page }) => {
        await page.goto(`/${icon.slug}/`);
        await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
        const element = page.locator(`#controlled ${icon.tag}`);
        await element.evaluate((element: HTMLElement & IconHandle) => {
          element.startAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        });
        await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        const poses = await element.evaluate((element: HTMLElement & IconHandle) => {
          const pose = () =>
            [...element.querySelectorAll("[data-motion]")].flatMap((shape) => {
              const matrix = new DOMMatrix(getComputedStyle(shape).transform);
              return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
            });
          const before = pose();
          element.stopAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => {
            animation.pause();
            animation.currentTime = 0;
          });
          return { before, after: pose() };
        });
        poses.before.forEach((value, index) => expect(poses.after[index]).toBeCloseTo(value, 4));
      });
    test("renders the complete upstream drawing and link without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/${icon.slug}/`);
      const shapes = page.locator("#primary svg path, #primary svg line, #primary svg circle, #primary svg rect");
      expect(
        await shapes.evaluateAll((elements) =>
          elements.map((element) => ({
            tag: element.tagName,
            attributes: Object.fromEntries(
              [...element.attributes]
                .filter((attribute) => !["style", "opacity", "data-motion"].includes(attribute.name))
                .map((attribute) => [attribute.name, attribute.value]),
            ),
          })),
        ),
      ).toEqual(icon.geometry);
      await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
      await page.locator("#primary").click();
      await expect(page).toHaveURL(/#destination$/);
      await context.close();
    });

    test("manual playback preserves interrupted geometry and restores every track", async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const element = page.locator(`#controlled ${icon.tag}`);
      const poses = await element.evaluate((element: HTMLElement & IconHandle) => {
        const pose = () =>
          [...element.querySelectorAll<SVGGeometryElement>("path, line, circle, rect")].flatMap((shape) => {
            const box = shape.getBoundingClientRect();
            const svg = shape.ownerSVGElement!.getBoundingClientRect();
            return [box.x - svg.x, box.y - svg.y, box.width, box.height, Number(getComputedStyle(shape).opacity)];
          });
        const rest = pose();
        for (let index = 0; index < 4; index++) element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause();
          animation.currentTime = 100;
        });
        const before = pose();
        const tracks = element.getAnimations({ subtree: true }).length;
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause();
          animation.currentTime = 0;
        });
        const after = pose();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        return { rest, before, after, tracks };
      });
      expect(poses.tracks).toBe(icon.animationCount);
      poses.before.forEach((value, index) => expect(poses.after[index]).toBeCloseTo(value, 4));
      await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      await expect
        .poll(() =>
          element.evaluate((element) =>
            [...element.querySelectorAll("[data-motion]")].every(
              (shape) =>
                !(shape as SVGElement).style.transform &&
                !(shape as SVGElement).style.opacity &&
                !(shape as SVGElement).style.strokeDasharray &&
                !(shape as SVGElement).style.strokeDashoffset,
            ),
          ),
        )
        .toBe(true);
      expect(
        await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length),
      ).toBe(0);
    });
  });
}

test("all folder adapters match the original React components at small sizes", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/folders-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction(
    (tags) => tags.every((tag) => !!customElements.get(tag)),
    folders.map((icon) => icon.tag),
  );
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  const samples = await page.evaluate(() => {
    return [0, 50, 100, 150, 200, 300, 400, 600, 800, 1000, 1500].flatMap((time) => {
      document.dispatchEvent(new CustomEvent("folder-seek", { detail: time }));
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
    `Folder comparison: 24 original React components at 14, 16, 24, and 28 px; maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${maximumPaint.toFixed(6)}.`,
  );
});

test("FolderHeart loops until stopped and restores its initial opacity", async ({ page }) => {
  await page.goto("/folder-heart/");
  await expect(page.locator("#controlled grave-folder-heart")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-folder-heart"));
  const icon = page.locator("#controlled grave-folder-heart");
  const iterations = await icon.evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    return icon.getAnimations({ subtree: true }).map((animation) => animation.effect!.getTiming().iterations);
  });
  expect(iterations).toEqual([Infinity, Infinity]);
  await icon.evaluate((icon: HTMLElement & IconHandle) => icon.stopAnimation());
  await expect.poll(() => icon.evaluate((icon) => icon.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").last()).toHaveCSS("opacity", "0.9");
});

test("FolderGit2 draws its branch backwards after the first commit", async ({ page }) => {
  await page.goto("/folder-git-2/");
  await expect(page.locator("#controlled grave-folder-git-2")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-folder-git-2"));
  const pose = await page.locator("#controlled grave-folder-git-2").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    icon.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 400;
    });
    const branch = icon.querySelectorAll("path")[1];
    return {
      offset: parseFloat(getComputedStyle(branch).strokeDashoffset) / branch.getTotalLength(),
      opacity: Number(getComputedStyle(branch).opacity),
    };
  });
  expect(pose.offset).toBeCloseTo(-1, 5);
  expect(pose.opacity).toBe(0);
});

test("Folders holds its stacked spring pose until stopped", async ({ page }) => {
  await page.goto("/folders/");
  await expect(page.locator("#controlled grave-folders")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-folders"));
  const result = await page.locator("#controlled grave-folders").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    icon.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 1500;
    });
    return [...icon.querySelectorAll("path")].map((path) => {
      const matrix = new DOMMatrix(getComputedStyle(path).transform);
      return [matrix.m41, matrix.m42, matrix.a, Number(getComputedStyle(path).opacity)];
    });
  });
  expect(result).toEqual([
    [-2, 2, 1, 1],
    [2, -2, 0.9, 0],
  ]);
});

test("FolderCheck renders its complete drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/folder-check/");
  await expect(page.locator("#primary svg")).toBeVisible();
  expect(
    await page.locator("#primary path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))),
  ).toEqual([
    "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
    "m9 13 2 2 4-4",
  ]);
  await context.close();
});

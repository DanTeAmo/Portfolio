import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = "http://127.0.0.1:4173";
const results = new URL("../test-results/", import.meta.url);
await mkdir(results, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const report = { widths: [], interactions: [], consoleErrors: errors };
try {
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("main section").count(), 6);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibilityViolations = accessibility.violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      elements: nodes.map((node) => node.target),
    }),
  );
  for (const width of [1440, 1024, 1023, 768, 767, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) => el.decode());
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: new URL(`page-${width}.png`, results).pathname.replace(
        /^\/(\w:)/,
        "$1",
      ),
      fullPage: true,
    });
    const geometry = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
      images: [...document.querySelectorAll("main img")].map((img) => ({
        loaded: img.complete && img.naturalWidth > 0,
        width: img.clientWidth,
      })),
    }));
    assert.ok(
      geometry.content <= width,
      `Overflow at ${width}: ${geometry.content}`,
    );
    assert.ok(
      geometry.images.every((img) => img.loaded && img.width > 0),
      `Images at ${width}`,
    );
    report.widths.push({ width, ...geometry });
  }
  const menu = page.locator(".menu-toggle");
  await menu.click();
  assert.equal(await menu.evaluate(el => el.parentElement.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await menu.evaluate(el => el.parentElement.open), false);
  assert.equal(
    await menu.evaluate((el) => el === document.activeElement),
    true,
  );
  await menu.click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects" })
    .click();
  assert.equal(await menu.evaluate(el => el.parentElement.open), false);
  assert.equal(
    await page
      .locator("#projects-title")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  report.interactions.push(
    "Mobile menu: Escape, focus return, anchor selection",
  );
  const details = page.locator(".project-details");
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  assert.equal(await details.getAttribute("open"), "");
  assert.equal(await details.locator("li").count(), 7);
  await page.keyboard.press("Space");
  assert.equal(await details.getAttribute("open"), null);
  report.interactions.push(
    "Native details: Enter/Space and complete project features",
  );
  const opener = page.getByRole("link", {
    name: "Open image: categories",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  assert.equal(
    await dialog
      .getByRole("button", { name: "Close" })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press("ArrowRight");
  await page
    .getByRole("heading", { name: "Product cards", exact: true })
    .waitFor();
  await dialog.getByRole("button", { name: "Zoom in" }).click();
  assert.equal(
    await page.locator(".zoom-surface").evaluate((el) => el.style.width),
    "150%",
  );
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page.locator("#viewer-title").innerText(),
    "Product cards",
  );
  await page.keyboard.press("Home");
  assert.equal(
    await page.locator(".zoom-surface").evaluate((el) => el.style.width),
    "100%",
  );
  await dialog.getByRole("button", { name: "Next screenshot" }).click();
  assert.equal(
    await page.locator("#viewer-title").innerText(),
    "Brands & footer",
  );
  await dialog.getByRole("button", { name: "Next screenshot" }).click();
  assert.equal(await page.locator("#viewer-title").innerText(), "Categories");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.body.style.overflow === "");
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(
    await opener.evaluate((el) => el === document.activeElement),
    true,
  );
  report.interactions.push(
    "Viewer: all images, cyclic navigation, zoom, Home, Escape, focus and scroll restoration",
  );
  for (const name of ["Databases", "JavaScript"]) {
    const href = await page
      .getByRole("link", { name: `View certificate: ${name} (PDF)` })
      .getAttribute("href");
    const response = await page.request.get(base + href);
    assert.equal(response.status(), 200);
    assert.ok(response.headers()["content-type"].includes("application/pdf"));
  }
  report.interactions.push("Both certificate PDFs: HTTP 200, application/pdf");
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  report.interactions.push("Reduced motion: smooth scrolling disabled");
  const plain = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await plain.goto(base);
  assert.equal(await plain.locator("h1").innerText(), "Daniel\nRusnac.");
  await plain.locator(".menu-toggle").click();
  assert.equal(
    await plain.getByRole("navigation").getByRole("link").count(),
    5,
  );
  await plain.locator(".menu-toggle").click();
  await plain.locator(".project-details summary").click();
  assert.equal(
    await plain.locator(".project-details").getAttribute("open"),
    "",
  );
  assert.ok(
    await plain
      .getByRole("link", { name: "Open image: categories" })
      .getAttribute("href"),
  );
  report.interactions.push(
    "JavaScript disabled: prerendered content, navigation, details, original image links",
  );
  await plain.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(report.accessibilityViolations, []);
  console.log(JSON.stringify(report, null, 2));
  await writeFile(
    new URL("browser-report.json", results),
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}

import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const output = new URL("../test-results/", import.meta.url);
await mkdir(output, { recursive: true });
const chrome = await launch({
  chromeFlags: ["--headless", "--no-first-run", "--disable-extensions"],
});
try {
  const result = await lighthouse("http://127.0.0.1:4173/", {
    port: chrome.port,
    output: ["html", "json"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  await writeFile(new URL("lighthouse-mobile.html", output), result.report[0]);
  await writeFile(new URL("lighthouse-mobile.json", output), result.report[1]);
  const { categories, audits } = result.lhr;
  console.log(
    JSON.stringify(
      {
        scores: Object.fromEntries(
          Object.entries(categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
            "speed-index",
          ].map((key) => [key, audits[key].displayValue]),
        ),
        opportunities: Object.values(audits)
          .filter((a) => a.score !== null && a.score < 0.9)
          .map((a) => ({ id: a.id, title: a.title, value: a.displayValue })),
      },
      null,
      2,
    ),
  );
} finally {
  await chrome.kill();
}

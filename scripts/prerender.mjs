import { readFile, writeFile, rm } from "node:fs/promises";
import { render } from "../.prerender/prerender.js";
const file = new URL("../dist/index.html", import.meta.url);
const template = await readFile(file, "utf8");
if (!template.includes("<!--app-html-->"))
  throw new Error("Missing prerender slot");
await writeFile(file, template.replace("<!--app-html-->", render()));
await rm(new URL("../.prerender", import.meta.url), {
  recursive: true,
  force: true,
});
console.log("Prerendered complete portfolio: readable without JavaScript.");

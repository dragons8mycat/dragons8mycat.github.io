import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const webDir = resolve("web");
const source = resolve(webDir, "vite-entry.html");
const target = resolve(webDir, "index.html");

if (existsSync(source)) {
  copyFileSync(source, target);
  console.log(`Copied ${source} -> ${target}`);
}

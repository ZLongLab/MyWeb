import { build } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const option = process.argv.find((arg) => arg.startsWith("--site-url="));
const site = new URL(
  option ? option.slice(11) : "https://zlonglab.github.io/MyWeb/",
);
if (
  site.protocol !== "https:" ||
  site.username ||
  site.password ||
  site.search ||
  site.hash ||
  !site.pathname.endsWith("/")
)
  throw Error("Use a complete HTTPS site URL ending in /.");
process.env.MYWEB_BASE = site.pathname;
process.env.MYWEB_REQUIRE_OPTIMIZER = "1";
await build({ root: fileURLToPath(root) });
const meta = JSON.parse(
  await readFile(new URL(".tmp/react-build.json", root), "utf8"),
);
await writeFile(
  new URL(".tmp/pages-build.json", root),
  JSON.stringify({ ...meta, site: site.href }, null, 2) + "\n",
);
if (process.env.GITHUB_OUTPUT)
  await writeFile(
    process.env.GITHUB_OUTPUT,
    "directory=" + meta.directory + "\n",
    { flag: "a" },
  );
console.log("Publish directory: " + meta.directory);

import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { optimizerFiles } from "./scripts/optimizer-files.mjs";

const root = fileURLToPath(new URL("./", import.meta.url));
// Native controllers still own parts of the page DOM. Limit Fast Refresh and
// automatic memoization to components whose entire subtree belongs to React.
const managedComponents = /\/src\/(?:components\/(?:ProjectCard|ProjectCollection|ToolShortcut|SiteMark|image-tools\/(?:ImageToolsSettings|ImageToolsQueue))|pages\/ImageToolsPage)\.jsx$/;
// The page owns a Worker and Blob URLs. Editing the page itself reloads it to
// dispose those resources; its pure child components can preserve state.
const refreshComponents = /\/src\/components\/(?:ProjectCard|ProjectCollection|ToolShortcut|SiteMark|image-tools\/(?:ImageToolsSettings|ImageToolsQueue))\.jsx$/;
const compilerPreset = reactCompilerPreset({ compilationMode: 'annotation', target: '19' });
compilerPreset.rolldown.filter.id = { include: managedComponents, exclude: /node_modules/ };
async function syncStyles() {
  // Serve each stylesheet in its original order; bundling these together changes
  // the cascade on projects, notes and the workbench. src/styles is canonical.
  await fs.mkdir(path.join(root, "public/assets"), { recursive: true });
  for (const file of await fs.readdir(path.join(root, "src/styles"))) {
    if (file.endsWith(".css") && file !== "react-shell.css") {
      await fs.copyFile(
        path.join(root, "src/styles", file),
        path.join(root, "public/assets", file),
      );
    }
  }
}
const pages = (await fs.readdir(root)).filter((file) =>
  /^[a-z0-9-]+\.html$/.test(file),
);
let base = process.env.MYWEB_BASE || "/MyWeb/";
if (
  !base.startsWith("/") ||
  !base.endsWith("/") ||
  base.includes("..") ||
  /[?#\\]/.test(base)
)
  throw Error("MYWEB_BASE must be a path such as /MyWeb/ or /.");

function siteFiles() {
  let outDir;
  return {
    name: "myweb-static-publishing",
    async configResolved(config) {
      outDir = path.resolve(root, config.build.outDir);
      base = config.base;
      await syncStyles();
    },
    async configureServer(server) {
      server.watcher.on("change", async (file) => {
        if (
          path.dirname(file) === path.join(root, "src/styles") &&
          file.endsWith(".css") &&
          path.basename(file) !== "react-shell.css"
        ) {
          await syncStyles();
          server.ws.send({ type: "full-reload" });
        }
      });
      const optimizer = await optimizerFiles(root, true);
      const files = new Map(
        (optimizer?.files || []).map((file) => [file.relative, file]),
      );
      server.middlewares.use(async (req, res, next) => {
        let pathname;
        try {
          pathname = decodeURIComponent(
            new URL(req.url, "http://localhost").pathname,
          );
        } catch {
          return next();
        }
        const prefix = pathname.startsWith(base) ? base : "/";
        if (!pathname.startsWith(prefix + "prompt-optimizer")) return next();
        if (pathname === prefix + "prompt-optimizer") {
          res.writeHead(302, { Location: prefix + "prompt-optimizer/" });
          return res.end();
        }
        const relative =
          pathname.slice((prefix + "prompt-optimizer/").length) || "index.html";
        const file = files.get(relative);
        if (!file) {
          res.writeHead(404);
          return res.end(
            "Prompt Optimizer is an independent subsite. Run npm run build:optimizer first.",
          );
        }
        try {
          res.setHeader("Content-Type", file.mime);
          res.end(await fs.readFile(file.full));
        } catch (error) {
          next(error);
        }
      });
    },
    async closeBundle() {
      const optimizer = await optimizerFiles(
        root,
        process.env.MYWEB_REQUIRE_OPTIMIZER !== "1",
      );
      if (optimizer)
        for (const file of optimizer.files) {
          const target = path.join(outDir, "prompt-optimizer", file.relative);
          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.copyFile(file.full, target);
        }
      else
        console.info(
          "Main site built. Independent optimizer is absent; build:pages requires it before publishing.",
        );
      const missing = path.join(outDir, "404.html");
      await fs.writeFile(
        missing,
        (await fs.readFile(missing, "utf8")).replace(
          "<head>",
          '<head>\n  <base href="' + base + '">',
        ),
      );
      // Vite emits content-hashed JS/CSS. Cache exactly this build, never a stale handwritten list.
      const files = [];
      const publishedFiles = [];
      async function walk(directory, prefix = "") {
        for (const entry of await fs.readdir(directory, {
          withFileTypes: true,
        })) {
          const relative = prefix + entry.name;
          if (relative === "prompt-optimizer" || relative === ".vite") continue;
          if (entry.isDirectory())
            await walk(path.join(directory, entry.name), relative + "/");
          else {
            publishedFiles.push(relative);
            if (
              // Large codec binaries stay network-loaded, never precached.
              /\.(?:html|js|css|svg|webp|png|webmanifest)$/.test(relative) &&
              relative !== "sw.js"
            )
              files.push(relative);
          }
        }
      }
      await walk(outDir);
      files.sort();
      const hash = createHash("sha256");
      const template = await fs.readFile(
        path.join(root, "src/runtime/service-worker.js"),
        "utf8",
      );
      hash.update(template);
      for (const file of files)
        hash.update(file).update(await fs.readFile(path.join(outDir, file)));
      const version =
        JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"))
          .version +
        "-react-" +
        hash.digest("hex").slice(0, 12);
      const worker = template
        .replace("__CACHE_VERSION__", version)
        .replace(
          /const APP_FILES = \[\];\s*\/\*__APP_FILES__\*\//,
          "const APP_FILES = " + JSON.stringify(files, null, 2) + ";",
        );
      if (/__APP_FILES__|__CACHE_VERSION__/.test(worker))
        throw Error("Service worker template was not expanded.");
      await fs.writeFile(path.join(outDir, "sw.js"), worker);
      await fs.writeFile(path.join(outDir, ".nojekyll"), "");
      await fs.mkdir(path.join(root, ".tmp"), { recursive: true });
      await fs.writeFile(
        path.join(root, ".tmp/react-build.json"),
        JSON.stringify(
          {
            directory: outDir,
            base,
            cacheVersion: version,
            cachedFiles: files.length,
            mainFiles: publishedFiles.length + 2,
            optimizerFiles: optimizer?.files.length || 0,
          },
          null,
          2,
        ),
      );
    },
  };
}

export default defineConfig({
  appType: "mpa",
  base,
  plugins: [react({ include: refreshComponents }), babel({ presets: [compilerPreset] }), siteFiles()],
  oxc: { jsx: { runtime: "automatic" } },
  optimizeDeps: {
    entries: pages,
    include: ["react", "react-dom/client", "react/jsx-runtime"],
    exclude: ["@jsquash/webp", "@jsquash/jpeg", "@jsquash/avif", "@jsquash/resize"],
  },
  worker: { format: "es" },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT || 4173),
    strictPort: true,
    watch: {
      ignored: [
        "**/.tmp/**",
        "**/backups/**",
        "**/research/**",
        "**/handoff/**",
      ],
    },
    fs: {
      deny: [
        ".git/**",
        ".env*",
        ".tmp/**",
        "backups/**",
        "handoff/**",
        "research/**",
      ],
    },
  },
  preview: {
    host: "127.0.0.1",
    port: Number(process.env.PORT || 4174),
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rolldownOptions: {
      input: Object.fromEntries(
        pages.map((file) => [file.slice(0, -5), path.join(root, file)]),
      ),
    },
  },
});

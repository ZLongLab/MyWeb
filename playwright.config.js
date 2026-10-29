import { defineConfig } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
const browserTemp = path.resolve(".tmp/browser-temp");
fs.mkdirSync(browserTemp, { recursive: true });
process.env.TEMP = browserTemp;
process.env.TMP = browserTemp;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  outputDir: ".tmp/react-test-results",
  reporter: [["list"], ["json", { outputFile: ".tmp/react-tests.json" }]],
  use: {
    baseURL: "http://127.0.0.1:4192/MyWeb/",
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    timezoneId: "Asia/Shanghai",
    reducedMotion: "reduce",
    launchOptions: { downloadsPath: path.resolve(".tmp/react-downloads") },
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run preview -- --port 4192",
      url: "http://127.0.0.1:4192/MyWeb/",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node server.mjs",
      env: { PORT: "4193" },
      url: "http://127.0.0.1:4193/MyWeb/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});

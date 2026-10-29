// Compatibility entry for npm start and the Windows preview launcher.
import { createServer } from "vite";
const server = await createServer({
  server: { open: process.argv.includes("--open") },
});
await server.listen();
server.printUrls();

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = new URL('./', import.meta.url);
const portText = process.env.PORT ?? '4173';
if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
  console.error('PORT 必须是 1 至 65535 之间的整数。');
  process.exit(1);
}
const port = Number(portText);
const previewUrl = `http://127.0.0.1:${port}`;
const files = new Map([
  ['/index.html', 'text/html; charset=utf-8'],
  ['/projects.html', 'text/html; charset=utf-8'],
  ['/project.html', 'text/html; charset=utf-8'],
  ['/about.html', 'text/html; charset=utf-8'],
  ['/articles.html', 'text/html; charset=utf-8'],
  ['/article.html', 'text/html; charset=utf-8'],
  ['/guestbook.html', 'text/html; charset=utf-8'],
  ['/workbench.html', 'text/html; charset=utf-8'],
  ['/assets/workbench.css', 'text/css; charset=utf-8'],
  ['/assets/workbench-data.js', 'text/javascript; charset=utf-8'],
  ['/assets/workbench.js', 'text/javascript; charset=utf-8'],
  ['/assets/styles.css', 'text/css; charset=utf-8'],
  ['/assets/site-theme.css', 'text/css; charset=utf-8'],
  ['/assets/home.css', 'text/css; charset=utf-8'],
  ['/assets/media-viewer.css', 'text/css; charset=utf-8'],
  ['/assets/media-viewer.js', 'text/javascript; charset=utf-8'],
  ['/assets/background.css', 'text/css; charset=utf-8'],
  ['/assets/page-background.svg', 'image/svg+xml; charset=utf-8'],
  ['/assets/site-mark.svg', 'image/svg+xml; charset=utf-8'],
  ['/assets/images/recallai-preview.png', 'image/png'],
  ['/assets/images/recallai-adoption-preview.png', 'image/png'],
  ['/assets/images/documentassistant-preview.png', 'image/png'],
  ['/assets/site-data.js', 'text/javascript; charset=utf-8'],
  ['/assets/app.js', 'text/javascript; charset=utf-8'],
  ['/assets/navigation.js', 'text/javascript; charset=utf-8'],
  ['/assets/navigation.css', 'text/css; charset=utf-8'],
  ['/assets/project.js', 'text/javascript; charset=utf-8'],
  ['/assets/articles-data.js', 'text/javascript; charset=utf-8'],
  ['/assets/content.js', 'text/javascript; charset=utf-8'],
  ['/assets/articles.js', 'text/javascript; charset=utf-8'],
  ['/assets/projects-data.js', 'text/javascript; charset=utf-8'],
  ['/assets/projects.js', 'text/javascript; charset=utf-8'],
  ['/assets/projects.css', 'text/css; charset=utf-8'],
  ['/assets/home-projects.js', 'text/javascript; charset=utf-8'],
  ['/assets/search.js', 'text/javascript; charset=utf-8'],
  ['/assets/search.css', 'text/css; charset=utf-8'],
  ['/assets/guestbook.js', 'text/javascript; charset=utf-8'],
  ['/assets/guestbook.css', 'text/css; charset=utf-8'],
  ['/assets/favicon.svg', 'image/svg+xml; charset=utf-8'],
]);

function sendText(request, response, status, message, extraHeaders = {}) {
  const body = Buffer.from(message, 'utf8');
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendText(request, response, 405, '只支持 GET 和 HEAD。\n', { Allow: 'GET, HEAD' });
    return;
  }

  // 在 URL 规范化之前检查路径，避免 ../ 被自动折叠而漏过检查。
  let pathname;
  try {
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
  } catch {
    sendText(request, response, 400, '无效的 URL 编码。\n');
    return;
  }
  if (!pathname.startsWith('/') || /[\\\0]/.test(pathname)
      || pathname.split('/').some((part) => part === '..' || part === '.')) {
    sendText(request, response, 403, '不允许访问此路径。\n');
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const mime = files.get(pathname);
  if (!mime) {
    sendText(request, response, 404, '页面不存在。\n');
    return;
  }

  try {
    const body = await readFile(new URL(pathname.slice(1), root));
    response.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      sendText(request, response, 404, '页面不存在。\n');
      return;
    }
    console.error('读取页面失败：', error.message);
    sendText(request, response, 500, '暂时无法读取页面。\n');
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用。请关闭已有预览，或设置 PORT 后重试。`);
  } else {
    console.error('本地预览启动失败：', error.message);
  }
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`本地预览已启动：${previewUrl}`);
  console.log(`网站目录：${fileURLToPath(root)}`);
  console.log('按 Ctrl+C 停止预览。');
  if (process.argv.includes('--open') && process.platform === 'win32') {
    const browser = spawn('cmd.exe', ['/d', '/c', 'start', '', previewUrl], {
      windowsHide: true,
      stdio: 'ignore',
    });
    browser.on('error', () => {
      console.log(`无法自动打开浏览器，请手动访问：${previewUrl}`);
    });
  }
});

process.on('SIGINT', () => {
  console.log('\n正在停止本地预览。');
  server.close();
});

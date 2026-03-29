import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT ?? process.argv[2] ?? '4273');
const appBasePath = '/day-matter/';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalizedPath =
    decodedPath === '/'
      ? '/index.html'
      : decodedPath.startsWith(appBasePath)
        ? `/${decodedPath.slice(appBasePath.length)}`
        : decodedPath;
  const relativePath = normalizedPath === '/index.html' || normalizedPath === '/'
    ? 'index.html'
    : normalizedPath.replace(/^\/+/, '');
  const filePath = path.resolve(distDir, relativePath);

  if (!filePath.startsWith(distDir)) {
    return null;
  }

  return filePath;
}

async function getServedFile(filePath) {
  if (filePath && existsSync(filePath)) {
    const fileStat = await stat(filePath);
    if (fileStat.isFile()) {
      return filePath;
    }
  }

  return path.join(distDir, 'index.html');
}

const server = createServer(async (request, response) => {
  try {
    const requestPath = resolveRequestPath(request.url ?? '/');

    if (!requestPath) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const filePath = await getServedFile(requestPath);
    const extension = path.extname(filePath);
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500);
    response.end('Internal Server Error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Daymark dist server listening on http://127.0.0.1:${port}`);
});

/**
 * npm run share — показать сайт по публичной ссылке (для проверки на других
 * устройствах: телефон, Mac с Safari и т. п.).
 *
 * Что делает:
 *   1. проверяет, что бэкенд отвечает (по умолчанию http://127.0.0.1:3001);
 *   2. собирает фронт в .nuxt-share / .output-share — запущенный `npm run dev`
 *      это не задевает;
 *   3. поднимает прокси: /api/v1, /uploads и сокет чата — на бэкенд,
 *      остальное — на собранный фронт. Наружу уходит одна ссылка,
 *      Swagger (/api) через неё не виден;
 *   4. запускает Cloudflare Tunnel (бесплатно, без регистрации) и печатает ссылку.
 *
 * Флаги:
 *   npm run share -- --no-build   без пересборки (если слетел только туннель)
 * Переменные окружения:
 *   SHARE_API    адрес бэкенда, если он не на 127.0.0.1:3001
 *   CLOUDFLARED  путь к cloudflared, если он установлен в нестандартное место
 *
 * Ссылка при каждом запуске новая. Работает, пока открыт терминал; Ctrl+C —
 * остановить всё.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SERVER_ENTRY = path.join(ROOT, ".output-share", "server", "index.mjs");
const TOOLS_DIR = path.join(ROOT, ".share");
const API = new URL(process.env.SHARE_API || "http://127.0.0.1:3001");
const API_PORT = Number(API.port) || 80;
const SKIP_BUILD = process.argv.includes("--no-build");

/** Запросы, которые уходят на бэкенд. Всё остальное — страницы фронта. */
const toBackend = (url) => /^\/(api\/v1|uploads|socket\.io)(\/|\?|$)/.test(url);

const children = [];

function log(message) {
  console.log(`[share] ${message}`);
}

function stopAll() {
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
}

function fail(message) {
  console.error(`\n[share] Ошибка: ${message}\n`);
  stopAll();
  process.exit(1);
}

process.on("SIGINT", () => {
  log("Останавливаю…");
  stopAll();
  process.exit(0);
});
process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
process.on("exit", stopAll);

// --- 1. Бэкенд -------------------------------------------------------------

async function checkBackend() {
  try {
    const res = await fetch(new URL("/api/v1/category", API), {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    fail(
      `бэкенд не отвечает на ${API.origin} (${error.message}).\n` +
        "        Запустите MongoDB и бэкенд: cd byte-back && npm run start:dev",
    );
  }
}

// --- 2. Сборка -------------------------------------------------------------

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: ROOT, stdio: "inherit", shell: true });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} завершился с кодом ${code}`)),
    );
  });
}

async function build() {
  if (SKIP_BUILD) {
    if (!fs.existsSync(SERVER_ENTRY)) {
      fail("сборки ещё нет. Запустите без --no-build: npm run share");
    }
    log("Без пересборки: беру прошлую сборку из .output-share");
    return;
  }
  log("Собираю фронт (около минуты)…");
  try {
    await runCommand("npx", ["nuxt", "build", "--envName", "share"]);
  } catch (error) {
    fail(`сборка не удалась: ${error.message}`);
  }
}

// --- 3. cloudflared --------------------------------------------------------

function findInPath(name) {
  return new Promise((resolve) => {
    const finder = process.platform === "win32" ? "where" : "which";
    const child = spawn(finder, [name]);
    let out = "";
    child.stdout.on("data", (chunk) => (out += chunk));
    child.on("error", () => resolve(null));
    child.on("exit", (code) => resolve(code === 0 ? out.split(/\r?\n/)[0].trim() : null));
  });
}

async function getCloudflared() {
  if (process.env.CLOUDFLARED) return process.env.CLOUDFLARED;

  const isWindows = process.platform === "win32";
  const local = path.join(TOOLS_DIR, isWindows ? "cloudflared.exe" : "cloudflared");
  if (fs.existsSync(local)) return local;

  const installed = await findInPath("cloudflared");
  if (installed) return installed;

  if (!isWindows) {
    fail("не найден cloudflared. Установите: brew install cloudflared (macOS) или пакет cloudflared (Linux).");
  }

  // Официальная сборка с GitHub Cloudflare, кладётся в .share (в git не попадает).
  log("Скачиваю cloudflared — один раз, около 55 МБ…");
  const url =
    "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe";
  const res = await fetch(url).catch((error) => fail(`не удалось скачать cloudflared: ${error.message}`));
  if (!res.ok) fail(`не удалось скачать cloudflared: HTTP ${res.status}`);
  fs.mkdirSync(TOOLS_DIR, { recursive: true });
  const partial = `${local}.download`;
  fs.writeFileSync(partial, Buffer.from(await res.arrayBuffer()));
  fs.renameSync(partial, local);
  return local;
}

// --- 4. Прокси -------------------------------------------------------------

function findFreePort(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(findFreePort(port + 1)));
    probe.listen(port, "127.0.0.1", () => probe.close(() => resolve(port)));
  });
}

function startProxy(port, frontPort) {
  const server = http.createServer((req, res) => {
    const backend = toBackend(req.url ?? "/");
    const upstream = http.request(
      {
        host: backend ? API.hostname : "127.0.0.1",
        port: backend ? API_PORT : frontPort,
        method: req.method,
        path: req.url,
        headers: req.headers,
      },
      (upRes) => {
        res.writeHead(upRes.statusCode ?? 502, upRes.headers);
        upRes.pipe(res);
      },
    );
    upstream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      }
      res.end(backend ? "Бэкенд недоступен" : "Сайт ещё запускается, обновите страницу");
    });
    req.pipe(upstream);
  });

  // WebSocket чата: пробрасываем соединение на бэкенд как есть.
  server.on("upgrade", (req, socket, head) => {
    if (!req.url?.startsWith("/socket.io")) {
      socket.destroy();
      return;
    }
    const upstream = net.connect(API_PORT, API.hostname, () => {
      let raw = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        raw += `${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\r\n`;
      }
      upstream.write(`${raw}\r\n`);
      if (head?.length) upstream.write(head);
      socket.pipe(upstream).pipe(socket);
    });
    const close = () => {
      socket.destroy();
      upstream.destroy();
    };
    upstream.on("error", close);
    socket.on("error", close);
  });

  return new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
}

// --- 5. Туннель и сайт -----------------------------------------------------

function startTunnel(cloudflared, proxyPort) {
  return new Promise((resolve) => {
    // HTTP/2 вместо QUIC по умолчанию: QUIC идёт по UDP, и в некоторых сетях
    // соединение рвётся каждые несколько минут (ошибка 1033 у посетителя).
    const tunnel = spawn(cloudflared, [
      "tunnel",
      "--no-autoupdate",
      "--protocol",
      "http2",
      "--url",
      `http://127.0.0.1:${proxyPort}`,
    ]);
    children.push(tunnel);

    let url = null;
    let ready = false;
    const timer = setTimeout(
      () => fail("туннель не поднялся за 60 секунд. Проверьте интернет и попробуйте ещё раз."),
      60_000,
    );

    const onLine = (line) => {
      const found = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (found && !url) url = found[0];
      if (line.includes("Registered tunnel connection")) {
        if (!ready && url) {
          ready = true;
          clearTimeout(timer);
          resolve(url);
        } else if (ready) {
          log("Туннель переподключился — ссылка та же.");
        }
      }
      // Ошибки подключения показываем; проблему с DNS-резолвером cloudflared
      // пишет всегда, на работу она не влияет.
      if (/\bERR\b/.test(line) && !line.includes("DNS local resolver") && ready) {
        log(`Туннель: ${line.replace(/^\S+\s+ERR\s+/, "").slice(0, 120)}`);
      }
    };

    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      lines.forEach(onLine);
    };
    tunnel.stdout.on("data", onData);
    tunnel.stderr.on("data", onData);
    tunnel.on("exit", (code) => {
      if (!ready) fail(`cloudflared завершился с кодом ${code}`);
      log("Туннель остановился. Перезапустите: npm run share -- --no-build");
      stopAll();
      process.exit(1);
    });
  });
}

async function startSite(port, url) {
  const site = spawn(process.execPath, [SERVER_ENTRY], {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "pipe"],
    env: {
      ...process.env,
      PORT: String(port),
      HOST: "127.0.0.1",
      // Адрес API и сайта — сама ссылка туннеля: прокси разводит запросы.
      NUXT_PUBLIC_API_ORIGIN: url,
      NUXT_PUBLIC_SITE_URL: url,
    },
  });
  children.push(site);
  site.stderr.on("data", (chunk) => process.stderr.write(`[site] ${chunk}`));
  site.on("exit", (code) => {
    if (code !== null && code !== 0) fail(`сайт завершился с кодом ${code}`);
  });

  // Ждём, пока сервер начнёт отвечать.
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok) return;
    } catch {
      // ещё не поднялся
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  fail("сайт не запустился за 30 секунд");
}

// --- Запуск ----------------------------------------------------------------

await checkBackend();
await build();
const cloudflared = await getCloudflared();

const sitePort = await findFreePort(3100);
const proxyPort = await findFreePort(sitePort + 100);
await startProxy(proxyPort, sitePort);

log("Поднимаю туннель…");
const url = await startTunnel(cloudflared, proxyPort);
await startSite(sitePort, url);

console.log(`
  Готово. Ссылка для просмотра:

      ${url}

  Работает, пока открыт этот терминал. Остановить — Ctrl+C.
  После изменений в коде запустите npm run share заново — он пересоберёт сайт.
  Ссылка при каждом запуске новая.
`);

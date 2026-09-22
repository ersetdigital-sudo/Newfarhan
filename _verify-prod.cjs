// Tunggu deploy, lalu verifikasi UI production di Chrome asli.
const { spawn } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9225;
const BASE = "https://newfarhan.vercel.app";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cssTrackLists() {
  const html = await (await fetch(BASE + "/")).text();
  const hrefs = [...new Set([...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]))];
  const all = [];
  for (const h of hrefs) {
    const url = h.startsWith("http") ? h : BASE + h;
    const css = await (await fetch(url)).text();
    all.push(...(css.match(/grid-template-columns:[^;}]*/g) || []));
  }
  return [...new Set(all)].sort();
}

(async () => {
  console.log("── nunggu deploy baru ──");
  let lists = [];
  for (let i = 0; i < 30; i++) {
    lists = await cssTrackLists();
    const masihKoma = lists.some((l) => /,/.test(l));
    if (!masihKoma) break;
    await sleep(10000);
  }
  console.log("track list di CSS live:");
  lists.forEach((l) => console.log("  ", l));
  const koma = lists.filter((l) => /,/.test(l));
  console.log(koma.length === 0 ? "→ nol track list ber-koma ✓" : `→ MASIH ADA KOMA: ${koma}`);

  // ── CDP: ukur UI beneran di production
  const chrome = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--user-data-dir=" + path.join(os.tmpdir(), "verify-prod-profile"),
    "about:blank",
  ], { stdio: "ignore" });

  let target;
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await sleep(300);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  await new Promise((r) => ws.addEventListener("open", r));
  const send = (method, params) => {
    const mid = ++id;
    ws.send(JSON.stringify({ id: mid, method, params }));
    return new Promise((r) => pending.set(mid, r));
  };
  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    return res.result.result.value;
  };
  const goto = async (url) => { await send("Page.navigate", { url }); await sleep(3000); };

  await send("Page.enable");
  await send("Runtime.enable");

  await goto(BASE + "/");
  console.log("\nlogin /api/admin/login →", await evaluate(`
    (async () => (await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "farhan2026" })
    })).status)()
  `));

  for (const vp of [{ name: "desktop 1440", w: 1440, h: 900 }, { name: "hp 390", w: 390, h: 844, mobile: true }]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: Boolean(vp.mobile),
    });

    await goto(BASE + "/");
    console.log(`\n── ${vp.name} ──`);
    console.log("  homepage:", await evaluate(`
      (() => {
        const hero = document.querySelector('h1')?.parentElement?.querySelector('.grid');
        return JSON.stringify({
          heroKolom: hero ? getComputedStyle(hero).gridTemplateColumns : 'n/a',
          scrollHorizontal: document.documentElement.scrollWidth > innerWidth + 1
        });
      })()
    `));

    await goto(BASE + "/admin");
    console.log("  tab:", await evaluate(`
      (() => {
        const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Grid Portofolio'));
        if (!b) return 'nggak ketemu';
        b.click(); return 'diklik';
      })()
    `));
    await sleep(2000);
    console.log("  admin:", await evaluate(`
      (() => {
        const imgs = [...document.querySelectorAll('img')].filter(i => i.className.includes('object-contain'));
        const first = imgs[0]?.getBoundingClientRect();
        const grid = imgs[0]?.closest('.grid');
        return JSON.stringify({
          jumlahFoto: imgs.length,
          fotoPertama: first ? Math.round(first.width) + 'x' + Math.round(first.height) : 'n/a',
          gridKolom: grid ? getComputedStyle(grid).gridTemplateColumns : 'n/a',
          scrollHorizontal: document.documentElement.scrollWidth > innerWidth + 1
        });
      })()
    `));
  }

  ws.close();
  chrome.kill();
  process.exit(0);
})();

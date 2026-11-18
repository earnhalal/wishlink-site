/* WishLink analytics — the site's own counting system (no Google wait).
   POST /api/track {device, page, type:"visit"|"ping"}
     visit — counts a page view, daily + total counters, unique devices.
     ping  — heartbeat every 30s from an open page; powers "Live now".
   POST /api/track {type:"setpin", pin} — one-time setup of the stats PIN
     (only while no PIN exists yet).
   POST /api/track {type:"stats", pin} — returns the dashboard numbers.
   POST /api/track {type:"wipe", token} — agent-token only; clears all
     stats nodes (used once after the launch test).
   Data (RTDB):
     stats_days/<YYYY-MM-DD> = {visits, uniques, pages:{<pageKey>:n},
       countries:{<CC>:n}, devtypes:{<Mobile|Tablet|Desktop>:n},
       oses:{<os>:n}, browsers:{<browser>:n}}
     stats_total             = {visits, uniques, + the same maps}
     stats_devices/<device>  = {first, last, days:{<date>:1}, cc, dtype, os, browser}
     stats_live/<device>     = last heartbeat timestamp
     stats_visitors/<device> = {ip, cc, city, dtype, os, browser, first, last,
       visits, sessions, pv:{<page>:views},
       sess:[{t, pages:{<page>:{s:secs, sc:scrollMax}}}] (newest first, max 8;
       a new session starts after 30 min of inactivity)}
     stats_bots/<bot name> = {name, n, last, cc, city, ip} — crawlers and AI
       agents are counted SEPARATELY (day/total "bots" maps + this
       last-seen index), never inside the human numbers. They arrive via
       the JS tracker (bots that render pages) and via POST {type:"botlog"}
       from the edge middleware (bots that only fetch HTML).
     stats_admin             = {salt, hash}  (stats PIN, scrypt)
   Days follow Asia/Karachi (PKT = UTC+5, no DST). */
const {
  dbGet, dbSet, dbRemove, readBody, send, clientIp,
  rateLimited, recordFailure, hashSecret, newSalt, verifySecret,
} = require("./_lib");

const DEV_RE = /^[a-zA-Z0-9-]{8,40}$/;
const PAGE_RE = /^[a-z0-9-]{1,40}$/;
const LIVE_WINDOW = 90 * 1000;

function pktDay(ts) {
  return new Date(ts + 5 * 3600 * 1000).toISOString().slice(0, 10);
}

/* Where a visit came from: Vercel's edge adds the visitor's country to
   every request (x-vercel-ip-country) at no cost; the device family,
   OS and browser come from the User-Agent header. "??" = unknown
   (e.g. local or non-Vercel traffic). */
function visitCountry(req) {
  const cc = String((req.headers && req.headers["x-vercel-ip-country"]) || "").toUpperCase();
  return /^[A-Z]{2}$/.test(cc) ? cc : "??";
}
function visitDevice(req) {
  const ua = String((req.headers && req.headers["user-agent"]) || "");
  let type = "Desktop";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) type = "Tablet";
  else if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) type = "Mobile";
  let os = "Other";
  if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS|Macintosh/i.test(ua)) os = "Mac";
  else if (/Linux/i.test(ua)) os = "Linux";
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/SamsungBrowser/i.test(ua)) browser = "Samsung";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  return { type, os, browser };
}
function bumpMap(map, key) {
  const m = Object.assign({}, map || {});
  m[key] = (m[key] || 0) + 1;
  return m;
}

const SESSION_GAP = 30 * 60 * 1000;
const MAX_SESS = 8;

function blankVisitor() {
  return { ip: "", cc: "??", city: "", dtype: "", os: "", browser: "", first: 0, last: 0, visits: 0, sessions: 0, pv: {}, sess: [] };
}
/* Returns the visitor's current session record, starting (and counting)
   a new one when the last activity is older than SESSION_GAP. */
function ensureSession(v, now) {
  if (!Array.isArray(v.sess)) v.sess = [];
  if (!v.sess.length || !v.last || now - v.last > SESSION_GAP) {
    v.sess.unshift({ t: now, pages: {} });
    v.sessions = (v.sessions || 0) + 1;
    if (v.sess.length > MAX_SESS) v.sess.length = MAX_SESS;
  }
  if (!v.sess[0].pages) v.sess[0].pages = {};
  return v.sess[0];
}
/* Vercel also sends the visitor's city (URL-encoded, ISP-based, so it
   is an approximation — sometimes the nearest big city, sometimes
   empty). Sanitized before it is stored or shown. */
function cleanCity(raw) {
  let s = String(raw || "");
  try { s = decodeURIComponent(s); } catch (e) { /* keep raw */ }
  s = s.replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 60);
  return s;
}
function visitCity(req) {
  return cleanCity(req.headers && req.headers["x-vercel-ip-city"]);
}
/* Known crawlers / AI agents by user-agent. Returns a display name or
   null for what looks like a human browser. Display names avoid the
   characters Firebase keys forbid (. $ # [ ] /). */
function botName(ua) {
  const u = String(ua || "");
  if (!u) return null;
  const rules = [
    [/GPTBot/i, "GPTBot (OpenAI)"],
    [/OAI-SearchBot/i, "OpenAI SearchBot"],
    [/ChatGPT-User/i, "ChatGPT user agent"],
    [/ClaudeBot/i, "ClaudeBot (Anthropic)"],
    [/Claude-Web|anthropic-ai/i, "Claude (Anthropic)"],
    [/PerplexityBot/i, "PerplexityBot"],
    [/Perplexity-User/i, "Perplexity user agent"],
    [/CCBot/i, "CCBot (Common Crawl)"],
    [/Google-Extended/i, "Google-Extended (AI)"],
    [/Googlebot/i, "Googlebot"],
    [/Bingbot/i, "Bingbot"],
    [/Applebot-Extended/i, "Applebot (AI)"],
    [/Applebot/i, "Applebot"],
    [/Meta-ExternalAgent/i, "Meta AI agent"],
    [/facebookexternalhit/i, "Facebook crawler"],
    [/Twitterbot/i, "Twitterbot"],
    [/LinkedInBot/i, "LinkedInBot"],
    [/DuckDuckBot/i, "DuckDuckBot"],
    [/YandexBot/i, "YandexBot"],
    [/Baiduspider/i, "Baiduspider"],
    [/Bytespider/i, "Bytespider (TikTok)"],
    [/Amazonbot/i, "Amazonbot"],
    [/cohere-ai/i, "Cohere AI"],
    [/Diffbot/i, "Diffbot"],
    [/ImagesiftBot/i, "ImagesiftBot"],
    [/PetalBot/i, "PetalBot"],
    [/SemrushBot/i, "SemrushBot"],
    [/AhrefsBot/i, "AhrefsBot"],
    [/MJ12bot/i, "MJ12bot"],
    [/DotBot/i, "DotBot"],
    [/DataForSeoBot/i, "DataForSEO Bot"],
    [/ia_archiver|archive\.org_bot/i, "Internet Archive"],
    [/MistralAI/i, "Mistral AI"],
    [/YouBot/i, "YouBot"],
    [/HeadlessChrome/i, "Headless Chrome"],
    [/python-requests|python-urllib|Go-http-client|axios|node-fetch|okhttp|curl\/|wget/i, "Script tool"],
  ];
  for (const rule of rules) if (rule[0].test(u)) return rule[1];
  if (/bot|crawl|spider|slurp|fetcher|scraper/i.test(u)) return "Other bot";
  return null;
}
/* Count one bot visit: day + total "bots" maps and the last-seen index.
   Human counters are NOT touched, and every other field of the day /
   total records is preserved exactly as found. */
async function recordBot(name, cc, ip, city) {
  const now = Date.now();
  const day = pktDay(now);
  const dayRec = (await dbGet("stats_days/" + day)) || { visits: 0, uniques: 0, pages: {} };
  dayRec.bots = bumpMap(dayRec.bots, name);
  await dbSet("stats_days/" + day, dayRec);
  const total = (await dbGet("stats_total")) || { visits: 0, uniques: 0 };
  total.bots = bumpMap(total.bots, name);
  await dbSet("stats_total", total);
  const prev = (await dbGet("stats_bots/" + name)) || {};
  await dbSet("stats_bots/" + name, {
    name, n: (prev.n || 0) + 1, last: now,
    cc: cc || prev.cc || "??", ip: ip || prev.ip || "", city: city || prev.city || "",
  });
}

/* Traffic source from the referrer the tracker sends (document.referrer
   host). WhatsApp in-app clicks usually carry NO referrer, so they land
   in "Direct" — that is a platform limit, not a bug. */
function visitSource(ref) {
  const r = String(ref || "").toLowerCase();
  if (!r) return "Direct";
  if (r.includes("wishlink.pp.ua")) return "Direct";
  if (r.includes("whatsapp") || r.includes("wa.me")) return "WhatsApp";
  if (r.includes("facebook") || r.includes("fb.")) return "Facebook";
  if (r.includes("instagram")) return "Instagram";
  if (r.includes("tiktok")) return "TikTok";
  if (r.includes("t.me") || r.includes("telegram")) return "Telegram";
  if (r.includes("youtube") || r.includes("youtu.be")) return "YouTube";
  if (r.includes("google")) return "Google";
  return "Other";
}

async function buildStats() {
  const now = Date.now();
  const today = pktDay(now);
  const yesterday = pktDay(now - 86400000);
  const days = (await dbGet("stats_days")) || {};
  const total = (await dbGet("stats_total")) || { visits: 0, uniques: 0 };
  const liveMap = (await dbGet("stats_live")) || {};
  let live = 0;
  const stale = [];
  for (const dev of Object.keys(liveMap)) {
    const ts = liveMap[dev] || 0;
    if (now - ts <= LIVE_WINDOW) live++;
    else if (now - ts > 10 * 60 * 1000) stale.push(dev);
  }
  for (const dev of stale.slice(0, 50)) dbRemove("stats_live/" + dev).catch(() => {});
  const monthPrefix = today.slice(0, 7);
  let monthVisits = 0;
  for (const d of Object.keys(days)) {
    if (d.startsWith(monthPrefix)) monthVisits += days[d].visits || 0;
  }
  const last7 = [], last30 = [];
  for (let i = 6; i >= 0; i--) {
    const d = pktDay(now - i * 86400000);
    const rec = days[d] || {};
    last7.push({ d, visits: rec.visits || 0, uniques: rec.uniques || 0, created: rec.created || 0, edits: rec.edits || 0, paid: rec.paid || 0 });
  }
  for (let i = 29; i >= 0; i--) {
    const d = pktDay(now - i * 86400000);
    const rec = days[d] || {};
    last30.push({ d, visits: rec.visits || 0, uniques: rec.uniques || 0, created: rec.created || 0 });
  }
  const hours = (await dbGet("stats_hours/" + today)) || {};
  /* economy: aggregate the credits wallets (fine at current scale) */
  const wallets = (await dbGet("studio_wallets")) || {};
  let walletCount = 0, sumFree = 0, sumPaid = 0;
  for (const k of Object.keys(wallets)) {
    const w = wallets[k] || {};
    walletCount++; sumFree += w.free || 0; sumPaid += w.paid || 0;
  }
  const recentTopups = (await dbGet("recent_topups")) || [];
  const t = days[today] || {};
  const y = days[yesterday] || {};
  const dayOut = (rec) => ({
    visits: rec.visits || 0, uniques: rec.uniques || 0, created: rec.created || 0,
    edits: rec.edits || 0, paid: rec.paid || 0, paidRs: rec.paidRs || 0,
    opens: rec.opens || 0, views: rec.views || 0,
    pages: rec.pages || {}, countries: rec.countries || {}, devtypes: rec.devtypes || {},
    oses: rec.oses || {}, browsers: rec.browsers || {},
    sources: rec.sources || {}, themes: rec.themes || {}, occs: rec.occs || {}, bots: rec.bots || {},
  });
  const tt = dayOut(t); tt.date = today;
  const yy = dayOut(y); yy.date = yesterday;
  /* per-visitor detail (newest first, max 50) */
  const vMap = (await dbGet("stats_visitors")) || {};
  const visitors = Object.keys(vMap).map((dev) => {
    const v = Object.assign(blankVisitor(), vMap[dev] || {});
    const pages = {};
    let totalSecs = 0;
    const sessOut = [];
    (v.sess || []).forEach((s) => {
      let ss = 0;
      Object.keys(s.pages || {}).forEach((pg) => {
        const e = s.pages[pg] || {};
        pages[pg] = pages[pg] || { v: 0, s: 0, sc: 0 };
        pages[pg].s += e.s || 0;
        pages[pg].sc = Math.max(pages[pg].sc, e.sc || 0);
        ss += e.s || 0;
      });
      totalSecs += ss;
      sessOut.push({ t: s.t || 0, s: ss });
    });
    Object.keys(v.pv || {}).forEach((pg) => {
      pages[pg] = pages[pg] || { v: 0, s: 0, sc: 0 };
      pages[pg].v = v.pv[pg] || 0;
    });
    return {
      ip: v.ip || "", cc: v.cc || "??", city: v.city || "", dtype: v.dtype || "", os: v.os || "", browser: v.browser || "",
      first: v.first || 0, last: v.last || 0, visits: v.visits || 0, sessions: v.sessions || 0,
      totalSecs, pages, sess: sessOut,
    };
  }).sort((a, b) => (b.last || 0) - (a.last || 0)).slice(0, 50);
  const botsMap = (await dbGet("stats_bots")) || {};
  const bots = Object.keys(botsMap).map((k) => botsMap[k]).filter(Boolean)
    .sort((a, b) => (b.last || 0) - (a.last || 0)).slice(0, 20);
  return {
    live, today: tt, yesterday: yy, last7, last30, hours, monthVisits, visitors, bots,
    economy: { wallets: walletCount, creditsFree: sumFree, creditsPaid: sumPaid, recentTopups },
    total: {
      visits: total.visits || 0, uniques: total.uniques || 0, pages: total.pages || 0,
      edits: total.edits || 0, paid: total.paid || 0, paidRs: total.paidRs || 0,
      opens: total.opens || 0, views: total.views || 0, adGranted: total.adGranted || 0,
      countries: total.countries || {}, devtypes: total.devtypes || {}, oses: total.oses || {},
      browsers: total.browsers || {}, sources: total.sources || {}, themes: total.themes || {}, occs: total.occs || {},
      bots: total.bots || {},
    },
  };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const type = String(b.type || "");

    if (type === "wipe") {
      if (!process.env.WL_AGENT_TOKEN || String(b.token || "") !== process.env.WL_AGENT_TOKEN) {
        return send(res, 401, { error: "auth" });
      }
      await dbRemove("stats_days");
      await dbRemove("stats_total");
      await dbRemove("stats_devices");
      await dbRemove("stats_live");
      await dbRemove("stats_hours");
      await dbRemove("stats_visitors");
      await dbRemove("stats_bots");
      await dbRemove("stats_admin");
      return send(res, 200, { ok: true, wiped: true });
    }

    if (type === "resetpin") {
      if (!process.env.WL_AGENT_TOKEN || String(b.token || "") !== process.env.WL_AGENT_TOKEN) {
        return send(res, 401, { error: "auth" });
      }
      await dbRemove("stats_admin");
      return send(res, 200, { ok: true });
    }

    if (type === "setpin") {
      const pin = String(b.pin || "");
      if (!/^\d{4,8}$/.test(pin)) return send(res, 400, { error: "PIN must be 4-8 digits" });
      const existing = await dbGet("stats_admin");
      if (existing) return send(res, 409, { error: "PIN already set" });
      const salt = newSalt();
      const hash = await hashSecret(pin, salt);
      await dbSet("stats_admin", { salt, hash });
      return send(res, 200, { ok: true });
    }

    if (type === "ownerfeed") {
      /* the owner's Telegram bot reads the same numbers with the agent
         token (for live alerts + the nightly report) */
      if (!process.env.WL_AGENT_TOKEN || String(b.token || "") !== process.env.WL_AGENT_TOKEN) {
        return send(res, 401, { error: "auth" });
      }
      return send(res, 200, await buildStats());
    }

    if (type === "stats") {
      const admin = await dbGet("stats_admin");
      if (!admin) return send(res, 200, { setup: true });
      const okPin = await verifySecret(String(b.pin || ""), admin.salt, admin.hash);
      if (!okPin) return send(res, 401, { error: "Wrong PIN" });
      return send(res, 200, await buildStats());
    }

    if (type === "botlog") {
      /* from the edge middleware: a crawler that only fetched the HTML
         (no JavaScript). UA, IP and country arrive in the body because
         the middleware's own request would hide the originals. */
      const name = botName(b.ua);
      if (!name) return send(res, 200, { ok: true });
      const ipB = String(b.ip || "").slice(0, 64);
      const guardB = await rateLimited(ipB || "botlog", "track", 300, 10 * 60 * 1000);
      if (guardB.limited) return send(res, 200, { ok: true });
      await recordFailure(guardB.key, guardB.rec, guardB.now).catch(() => {});
      const ccRaw = String(b.cc || "").toUpperCase();
      await recordBot(name, /^[A-Z]{2}$/.test(ccRaw) ? ccRaw : "??", ipB, cleanCity(b.city));
      return send(res, 200, { ok: true });
    }

    /* ---- visit / ping ---- */
    const device = String(b.device || "");
    if (!DEV_RE.test(device)) return send(res, 400, { error: "bad device" });
    const page = String(b.page || "home").toLowerCase();
    if (!PAGE_RE.test(page)) return send(res, 400, { error: "bad page" });
    if (type !== "visit" && type !== "ping") return send(res, 400, { error: "bad type" });

    const ip = clientIp(req);
    const guard = await rateLimited(ip, "track", 300, 10 * 60 * 1000);
    if (guard.limited) return send(res, 200, { ok: true });
    await recordFailure(guard.key, guard.rec, guard.now).catch(() => {});

    /* Bots that DO run JavaScript land here too — count them as bots,
       never as people, and never in the live/visitor records. */
    const bot = botName(req.headers && req.headers["user-agent"]);
    if (bot) {
      if (type === "visit") await recordBot(bot, visitCountry(req), ip, visitCity(req));
      return send(res, 200, { ok: true });
    }

    const now = Date.now();
    await dbSet("stats_live/" + device, now);
    if (type === "ping") {
      /* per-visitor detail: how long this page stayed open + how far
         it was scrolled (cumulative values, stored with max semantics) */
      const secs = Math.max(0, Math.min(86400, parseInt(b.secs, 10) || 0));
      const scroll = Math.max(0, Math.min(100, parseInt(b.scroll, 10) || 0));
      const v = Object.assign(blankVisitor(), (await dbGet("stats_visitors/" + device)) || {});
      const cur = ensureSession(v, now);
      const ent = cur.pages[page] || { s: 0, sc: 0 };
      ent.s = Math.max(ent.s || 0, secs);
      ent.sc = Math.max(ent.sc || 0, scroll);
      cur.pages[page] = ent;
      const vdP = visitDevice(req);
      v.ip = ip; v.cc = visitCountry(req);
      v.city = visitCity(req) || v.city;
      v.dtype = vdP.type; v.os = vdP.os; v.browser = vdP.browser;
      if (!v.first) v.first = now;
      v.last = now;
      await dbSet("stats_visitors/" + device, v);
      return send(res, 200, { ok: true });
    }

    const day = pktDay(now);
    const devRec = await dbGet("stats_devices/" + device);
    const isNewDevice = !devRec;
    const isNewToday = !(devRec && devRec.days && devRec.days[day]);

    const cc = visitCountry(req);
    const vd = visitDevice(req);
    const src = visitSource(b.ref);

    /* hourly buckets for today's chart (PKT hour) */
    const hourKey = String(new Date(now + 5 * 3600 * 1000).getUTCHours()).padStart(2, "0");
    const hourUpd = {}; hourUpd[hourKey] = ((await dbGet("stats_hours/" + day + "/" + hourKey)) || 0) + 1;
    await dbSet("stats_hours/" + day + "/" + hourKey, hourUpd[hourKey]).catch(() => {});

    const dayRec = (await dbGet("stats_days/" + day)) || { visits: 0, uniques: 0, pages: {} };
    const pages = dayRec.pages || {};
    pages[page] = (pages[page] || 0) + 1;
    await dbSet("stats_days/" + day, {
      visits: (dayRec.visits || 0) + 1,
      uniques: (dayRec.uniques || 0) + (isNewToday ? 1 : 0),
      created: dayRec.created || 0,
      edits: dayRec.edits || 0,
      paid: dayRec.paid || 0,
      paidRs: dayRec.paidRs || 0,
      opens: dayRec.opens || 0,
      views: dayRec.views || 0,
      themes: dayRec.themes || {},
      occs: dayRec.occs || {},
      bots: dayRec.bots || {},
      pages,
      countries: bumpMap(dayRec.countries, cc),
      devtypes: bumpMap(dayRec.devtypes, vd.type),
      oses: bumpMap(dayRec.oses, vd.os),
      browsers: bumpMap(dayRec.browsers, vd.browser),
      sources: bumpMap(dayRec.sources, src),
    });

    const total = (await dbGet("stats_total")) || { visits: 0, uniques: 0 };
    await dbSet("stats_total", {
      visits: (total.visits || 0) + 1,
      uniques: (total.uniques || 0) + (isNewDevice ? 1 : 0),
      pages: total.pages || 0,
      edits: total.edits || 0,
      paid: total.paid || 0,
      paidRs: total.paidRs || 0,
      opens: total.opens || 0,
      views: total.views || 0,
      adGranted: total.adGranted || 0,
      themes: total.themes || {},
      occs: total.occs || {},
      bots: total.bots || {},
      countries: bumpMap(total.countries, cc),
      devtypes: bumpMap(total.devtypes, vd.type),
      oses: bumpMap(total.oses, vd.os),
      browsers: bumpMap(total.browsers, vd.browser),
      sources: bumpMap(total.sources, src),
    });

    const daysMap = (devRec && devRec.days) || {};
    daysMap[day] = 1;
    await dbSet("stats_devices/" + device, {
      first: devRec ? devRec.first || now : now,
      last: now,
      days: daysMap,
      cc: cc,
      dtype: vd.type,
      os: vd.os,
      browser: vd.browser,
    });

    /* per-visitor detail: repeat history (visits + sessions) */
    const v = Object.assign(blankVisitor(), (await dbGet("stats_visitors/" + device)) || {});
    const cur = ensureSession(v, now);
    if (!cur.pages[page]) cur.pages[page] = { s: 0, sc: 0 };
    v.visits = (v.visits || 0) + 1;
    v.pv = bumpMap(v.pv, page);
    v.ip = ip; v.cc = cc;
    v.city = visitCity(req) || v.city;
    v.dtype = vd.type; v.os = vd.os; v.browser = vd.browser;
    if (!v.first) v.first = now;
    v.last = now;
    await dbSet("stats_visitors/" + device, v);
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: "track failed" });
  }
};

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

    if (type === "stats") {
      const admin = await dbGet("stats_admin");
      if (!admin) return send(res, 200, { setup: true });
      const okPin = await verifySecret(String(b.pin || ""), admin.salt, admin.hash);
      if (!okPin) return send(res, 401, { error: "Wrong PIN" });
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
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = pktDay(now - i * 86400000);
        const rec = days[d] || { visits: 0, uniques: 0, created: 0, edits: 0, paid: 0 };
        last7.push({ d, visits: rec.visits || 0, uniques: rec.uniques || 0, created: rec.created || 0, edits: rec.edits || 0, paid: rec.paid || 0 });
      }
      const t = days[today] || { visits: 0, uniques: 0, created: 0, edits: 0, paid: 0, paidRs: 0, pages: {} };
      const y = days[yesterday] || { visits: 0, uniques: 0, created: 0, edits: 0, paid: 0, paidRs: 0 };
      return send(res, 200, {
        live,
        today: { date: today, visits: t.visits || 0, uniques: t.uniques || 0, created: t.created || 0, edits: t.edits || 0, paid: t.paid || 0, paidRs: t.paidRs || 0, pages: t.pages || {}, countries: t.countries || {}, devtypes: t.devtypes || {}, oses: t.oses || {}, browsers: t.browsers || {} },
        yesterday: { date: yesterday, visits: y.visits || 0, uniques: y.uniques || 0, created: y.created || 0, edits: y.edits || 0, paid: y.paid || 0, paidRs: y.paidRs || 0 },
        last7,
        monthVisits,
        total: { visits: total.visits || 0, uniques: total.uniques || 0, pages: total.pages || 0, edits: total.edits || 0, paid: total.paid || 0, paidRs: total.paidRs || 0, countries: total.countries || {}, devtypes: total.devtypes || {}, oses: total.oses || {}, browsers: total.browsers || {} },
      });
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

    const now = Date.now();
    await dbSet("stats_live/" + device, now);
    if (type === "ping") return send(res, 200, { ok: true });

    const day = pktDay(now);
    const devRec = await dbGet("stats_devices/" + device);
    const isNewDevice = !devRec;
    const isNewToday = !(devRec && devRec.days && devRec.days[day]);

    const cc = visitCountry(req);
    const vd = visitDevice(req);

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
      pages,
      countries: bumpMap(dayRec.countries, cc),
      devtypes: bumpMap(dayRec.devtypes, vd.type),
      oses: bumpMap(dayRec.oses, vd.os),
      browsers: bumpMap(dayRec.browsers, vd.browser),
    });

    const total = (await dbGet("stats_total")) || { visits: 0, uniques: 0 };
    await dbSet("stats_total", {
      visits: (total.visits || 0) + 1,
      uniques: (total.uniques || 0) + (isNewDevice ? 1 : 0),
      pages: total.pages || 0,
      edits: total.edits || 0,
      paid: total.paid || 0,
      paidRs: total.paidRs || 0,
      countries: bumpMap(total.countries, cc),
      devtypes: bumpMap(total.devtypes, vd.type),
      oses: bumpMap(total.oses, vd.os),
      browsers: bumpMap(total.browsers, vd.browser),
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
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: "track failed" });
  }
};

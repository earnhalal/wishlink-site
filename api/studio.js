/* /api/studio — ALL WishLink Studio endpoints in ONE serverless function.
   Vercel's Hobby plan allows only 12 functions per deployment, so the
   studio family (request, status, agent, grant, pay, pay-agent) lives
   here behind ?a= and vercel.json rewrites keep the public paths:
     /api/studio-request  -> ?a=request    /api/studio-status -> ?a=status
     /api/studio-agent    -> ?a=agent      /api/studio-grant  -> ?a=grant
     /api/studio-pay      -> ?a=pay        /api/studio-pay-agent -> ?a=payagent
     /api/studio-wallet   -> ?a=wallet */
const { dbGet, dbSet, dbUpdate, dbRemove, readBody, send, clientIp, rateLimited, recordFailure, randomCode } = require("./_lib");

/* POST /api/studio-request — { img, name, style }
   A visitor asks Laila (the AI agent) to edit their photo into a birthday
   scene. The request joins a queue in RTDB; the agent picks it up within
   a few minutes and posts the result back (see /api/studio-agent). */

const STYLES = ["midnight", "rose", "royal"];

/* analytics counters (best-effort): stats_days/<PKT day>.<field> and
   stats_total.<field> — a stats failure must never break studio work */
async function bumpStat(field) { return bumpStatN(field, 1); }
async function bumpStatN(field, n) {
  try {
    const day = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
    const dayRec = (await dbGet("stats_days/" + day)) || {};
    const dUpd = {}; dUpd[field] = (dayRec[field] || 0) + n;
    await dbUpdate("stats_days/" + day, dUpd);
    const tot = (await dbGet("stats_total")) || {};
    const tUpd = {}; tUpd[field] = (tot[field] || 0) + n;
    await dbUpdate("stats_total", tUpd);
  } catch (e) {}
}

/* ---------- Credits wallet ----------
   studio_wallets/<device> = { free, freeTs, paid, ts }
   - 20 free credits, refilled back to 20 every 24 hours (lazy, on touch);
     free credits never accumulate past 20
   - paid credits never expire; top-ups: Rs 100 = 50 credits (Rs 2/credit),
     minimum top-up Rs 100
   - one AI edit costs 10 credits; free credits are spent first
   Legacy studio_usage bonus edits migrate to paid credits (1 bonus = 10). */
const FREE_CAP = 20, EDIT_COST = 10, DAY_MS = 24 * 3600 * 1000, MIN_TOPUP_RS = 100;
/* Premium page designs: unlocked once per design, forever, for DESIGN_PRICE
   credits. create.js enforces the same list server-side. */
const PREMIUM_THEMES = [], DESIGN_PRICE = 50; /* all designs free (owner order 2026-11-17) */

async function getWallet(device) {
  let w = await dbGet("studio_wallets/" + device);
  const now = Date.now();
  if (!w) {
    const legacy = (await dbGet("studio_usage/" + device)) || {};
    w = { free: FREE_CAP, freeTs: now, paid: (legacy.bonus || 0) * EDIT_COST, ts: now };
    await dbSet("studio_wallets/" + device, w);
    return w;
  }
  if (now - (w.freeTs || 0) >= DAY_MS) {
    w.free = FREE_CAP; w.freeTs = now; w.ts = now;
    await dbSet("studio_wallets/" + device, w);
  }
  return w;
}

/* ---------- Device fingerprint guard ----------
   The wallet key used to be only the random device id stored in the
   browser, so changing browsers (or clearing the cache) minted a fresh
   wallet with 20 new free credits. The client now also sends a device
   fingerprint hash (screen, pixel ratio, timezone, language, touch,
   cores, GPU family — traits that stay the same across browsers on one
   phone). studio_fp/<fp> remembers which wallet claimed a fingerprint:
   - same fingerprint AND same network IP -> the visitor is handed their
     ORIGINAL wallet (the client adopts that device id), no new free credits
   - same fingerprint but a different network (VPN, moved, carrier IP
     changed) -> the other wallet is never handed over (it could be a
     stranger with the same phone model); a brand-new wallet instead
     starts with 0 free credits, because this fingerprint already claimed
     its free allowance. Paid top-ups still work and the normal 24h
     refill still applies. */
function validFp(fp) { return /^[a-f0-9]{32,64}$/.test(fp || ""); }

async function resolveWallet(device, fp, ip) {
  let own = null;
  try { own = await dbGet("studio_wallets/" + device); } catch (e) {}
  if (validFp(fp)) {
    let idx = null;
    try { idx = await dbGet("studio_fp/" + fp); } catch (e) {}
    if (idx && idx.device && idx.device !== device) {
      let target = null;
      try { target = await dbGet("studio_wallets/" + idx.device); } catch (e) {}
      if (target) {
        if (idx.ip && ip && idx.ip === ip) {
          const w = await getWallet(idx.device);
          try { await dbUpdate("studio_fp/" + fp, { ip: ip, ts: Date.now() }); } catch (e) {}
          return { device: idx.device, wallet: w, aliased: true };
        }
        if (!own) {
          const now = Date.now();
          const w = { free: 0, freeTs: now, paid: 0, ts: now, fpDenied: fp };
          await dbSet("studio_wallets/" + device, w);
          return { device: device, wallet: w, aliased: false };
        }
        return { device: device, wallet: await getWallet(device), aliased: false };
      }
    }
    const w = await getWallet(device);
    try {
      if (!idx) await dbSet("studio_fp/" + fp, { device: device, ip: ip || "", ts: Date.now() });
      else if (idx.device === device) await dbUpdate("studio_fp/" + fp, { ip: ip || idx.ip || "", ts: Date.now() });
    } catch (e) {}
    return { device: device, wallet: w, aliased: false };
  }
  return { device: device, wallet: await getWallet(device), aliased: false };
}

async function spendCredits(device) {
  const w = await getWallet(device);
  if ((w.free || 0) + (w.paid || 0) < EDIT_COST) return null;
  const ff = Math.min(w.free || 0, EDIT_COST);
  const fp = EDIT_COST - ff;
  w.free = (w.free || 0) - ff; w.paid = (w.paid || 0) - fp; w.ts = Date.now();
  await dbSet("studio_wallets/" + device, w);
  return { ff, fp };
}

async function spendAmount(device, amount) {
  const w = await getWallet(device);
  if ((w.free || 0) + (w.paid || 0) < amount) return null;
  const ff = Math.min(w.free || 0, amount);
  const fp = amount - ff;
  w.free = (w.free || 0) - ff; w.paid = (w.paid || 0) - fp; w.ts = Date.now();
  await dbSet("studio_wallets/" + device, w);
  return { ff, fp };
}

async function refundCredits(device, spend) {
  if (!device || !spend) return;
  try {
    const w = await getWallet(device);
    w.free = Math.min(FREE_CAP, (w.free || 0) + (spend.ff || 0));
    w.paid = (w.paid || 0) + (spend.fp || 0);
    w.ts = Date.now();
    await dbSet("studio_wallets/" + device, w);
  } catch (e) {}
}

const hRequest = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const img = String(b.img || "");
    const name = String(b.name || "").slice(0, 40);
    const style = STYLES.includes(b.style) ? b.style : "midnight";
    if (!img.startsWith("data:image/") || img.length < 1000 || img.length > 1400000)
      return send(res, 400, { error: "bad image" });

    let device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, "studio", 5, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many requests — try again in a few minutes" });

    const resolved = await resolveWallet(device, String(b.fp || ""), ip);
    device = resolved.device;

    const spend = await spendCredits(device);
    if (!spend) {
      const w = await getWallet(device);
      return send(res, 403, { limit: true, needCredits: true, balance: (w.free || 0) + (w.paid || 0), error: "Not enough credits — one AI edit costs 10 credits" });
    }

    const id = "sr" + randomCode(12);
    await dbSet("studio_requests/" + id, { img, name, style, device, status: "pending", ts: Date.now(), spend });
    await recordFailure(rl.key, rl.rec, rl.now);
    return send(res, 200, { id });
  } catch (e) {
    return send(res, 500, { error: "request failed" });
  }
};
/* GET /api/studio-status?id=srXXXX — poll the state of an AI edit request.
   Requests (and the photos in them) expire after 60 minutes. */

const hStatus = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  try {
    const url = new URL(req.url, "https://x.local");
    const id = String(url.searchParams.get("id") || "");
    if (!/^sr[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
    const rec = await dbGet("studio_requests/" + id);
    if (!rec) return send(res, 404, { error: "not found" });
    if (Date.now() - (rec.ts || 0) > 60 * 60 * 1000) {
      await dbRemove("studio_requests/" + id);
      if (rec.status !== "done" && rec.device) await refundCredits(rec.device, rec.spend);
      return send(res, 200, { status: "expired" });
    }
    const out = { status: rec.status };
    if (rec.status === "done" && rec.result) out.result = rec.result;
    return send(res, 200, out);
  } catch (e) {
    return send(res, 500, { error: "status failed" });
  }
};
/* /api/studio-agent — the agent's private door to the AI-edit queue.
   Auth: header x-agent-token must match env WL_AGENT_TOKEN.
   GET  → claim up to 3 pending requests (marks them "working").
   POST { id, result } → mark done with the edited picture (data URL).
   POST { id, fail: true } → mark failed.
   Old requests (>2h, any state) are deleted on every call — photos are
   never kept longer than that. */

function authed(req) {
  const t = process.env.WL_AGENT_TOKEN || "";
  return t.length >= 16 && (req.headers["x-agent-token"] || "") === t;
}

const hAgent = async (req, res) => {
  if (!authed(req)) return send(res, 401, { error: "unauthorized" });
  try {
    const all = (await dbGet("studio_requests")) || {};
    const now = Date.now();
    for (const [id, r] of Object.entries(all)) {
      if (now - (r.ts || 0) > 2 * 60 * 60 * 1000) await dbRemove("studio_requests/" + id);
    }
    if (req.method === "GET") {
      const pending = Object.entries(all)
        .filter(([, r]) => now - (r.ts || 0) <= 2 * 60 * 60 * 1000 &&
          (r.status === "pending" || (r.status === "working" && now - (r.wts || 0) > 10 * 60 * 1000)))
        .sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0))
        .slice(0, 2);
      const out = [];
      for (const [id, r] of pending) {
        await dbUpdate("studio_requests/" + id, { status: "working", wts: now });
        out.push({ id, img: r.img, name: r.name || "", style: r.style || "midnight" });
      }
      return send(res, 200, { requests: out });
    }
    if (req.method === "POST") {
      const b = await readBody(req);
      const id = String(b.id || "");
      if (!/^sr[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
      const rec = await dbGet("studio_requests/" + id);
      if (!rec) return send(res, 404, { error: "not found" });
      if (b.fail) {
        await dbUpdate("studio_requests/" + id, { status: "failed" });
        await refundCredits(rec.device, rec.spend);
        return send(res, 200, { ok: true });
      }
      const result = String(b.result || "");
      if (!result.startsWith("data:image/") || result.length > 2500000)
        return send(res, 400, { error: "bad result" });
      await dbUpdate("studio_requests/" + id, { status: "done", result, doneTs: Date.now() });
      if (rec.status !== "done") await bumpStat("edits");
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { error: "method" });
  } catch (e) {
    return send(res, 500, { error: "agent failed" });
  }
};
/* POST /api/studio-grant — agent-token only.
   Body: { code } or { device }, plus { credits } (paid credits to add).
   Manual unlock path: the owner receives the payer's balance code on
   WhatsApp and forwards it; the code is chars 4..12 of the device id,
   matched against wallet keys (legacy usage keys as fallback). */

const hGrant = async (req, res) => {
  const token = process.env.WL_AGENT_TOKEN || "";
  if (!token || req.headers["x-agent-token"] !== token) return send(res, 401, { error: "unauthorized" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const credits = Math.max(0, Math.min(10000, parseInt(b.credits || b.add, 10) || 0));
    if (!credits) return send(res, 400, { error: "credits required" });
    let device = String(b.device || "");
    if (!device && b.code) {
      const code = String(b.code).toUpperCase().replace(/[^A-Z0-9]/g, "");
      const wallets = (await dbGet("studio_wallets")) || {};
      device = Object.keys(wallets).find((k) => k.slice(4, 12).toUpperCase() === code) || "";
      if (!device) {
        const all = (await dbGet("studio_usage")) || {};
        device = Object.keys(all).find((k) => k.slice(4, 12).toUpperCase() === code) || "";
      }
      if (!device) return send(res, 404, { error: "code not found" });
    }
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const w = await getWallet(device);
    w.paid = (w.paid || 0) + credits; w.ts = Date.now();
    await dbSet("studio_wallets/" + device, w);
    return send(res, 200, { ok: true, device, paid: w.paid, total: (w.free || 0) + w.paid });
  } catch (e) {
    return send(res, 500, { error: "grant failed" });
  }
};
/* /api/studio-pay — credit top-up by payment screenshot.
   POST { device, img }  → create a payment check request (one pending per device)
   GET  ?id=&device=     → { status, reason?, credits?, amount? }
   The screenshot is verified by the agent (see /api/studio-pay-agent);
   approval adds credits to the device's wallet (Rs 2 per credit,
   minimum top-up Rs 100). */

const hPay = async (req, res) => {
  try {
    if (req.method === "GET") {
      const id = String(req.query.id || "");
      const device = String(req.query.device || "");
      if (!/^pay[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
      const rec = await dbGet("pay_requests/" + id);
      if (!rec || rec.device !== device) return send(res, 404, { error: "not found" });
      if (Date.now() - (rec.ts || 0) > 60 * 60 * 1000) return send(res, 200, { status: "expired" });
      const out = { status: rec.status || "pending" };
      if (rec.status === "rejected" && rec.reason) out.reason = rec.reason;
      if (rec.status === "approved") { out.credits = rec.credits || 0; out.amount = rec.amount || 0; }
      return send(res, 200, out);
    }
    if (req.method !== "POST") return send(res, 405, { error: "method" });
    const b = await readBody(req);
    let device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const img = String(b.img || "");
    if (!img.startsWith("data:image/") || img.length < 1000 || img.length > 1600000)
      return send(res, 400, { error: "bad image" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, "pay", 5, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many tries — wait a few minutes" });

    const resolvedPay = await resolveWallet(device, String(b.fp || ""), ip);
    device = resolvedPay.device;

    /* one open check per device: reuse it instead of stacking duplicates */
    const all = (await dbGet("pay_requests")) || {};
    for (const [pid, r] of Object.entries(all)) {
      if (r.device === device && (r.status === "pending" || r.status === "checking") &&
          Date.now() - (r.ts || 0) <= 60 * 60 * 1000)
        return send(res, 200, { id: pid, status: r.status });
    }

    const id = "pay" + randomCode(12);
    await dbSet("pay_requests/" + id, { img, device, status: "pending", ts: Date.now() });
    await recordFailure(rl.key, rl.rec, rl.now);
    return send(res, 200, { id, status: "pending" });
  } catch (e) {
    return send(res, 500, { error: "pay failed" });
  }
};
/* /api/studio-pay-agent — the agent's private door to the payment queue.
   Auth: header x-agent-token must match env WL_AGENT_TOKEN.
   GET  → claim up to 2 pending screenshot checks (marks them "checking").
   POST { id, ok: true, tid, amount } → approve: the transaction id must be
          unused and the amount at least the minimum top-up; records the
          tid and adds amount/2 credits to the device's wallet.
   POST { id, ok: false, reason } → reject (amount|receiver|unreadable|not_receipt).
   Old requests (>2h) are deleted on every call. */

const REASONS = ["amount", "receiver", "unreadable", "not_receipt"];

const hPayAgent = async (req, res) => {
  if (!authed(req)) return send(res, 401, { error: "unauthorized" });
  try {
    const all = (await dbGet("pay_requests")) || {};
    const now = Date.now();
    for (const [id, r] of Object.entries(all)) {
      if (now - (r.ts || 0) > 2 * 60 * 60 * 1000) await dbRemove("pay_requests/" + id);
    }
    if (req.method === "GET") {
      const pending = Object.entries(all)
        .filter(([, r]) => now - (r.ts || 0) <= 2 * 60 * 60 * 1000 &&
          (r.status === "pending" || (r.status === "checking" && now - (r.wts || 0) > 10 * 60 * 1000)))
        .sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0))
        .slice(0, 2);
      const out = [];
      for (const [id, r] of pending) {
        await dbUpdate("pay_requests/" + id, { status: "checking", wts: now });
        out.push({ id, img: r.img, device: r.device });
      }
      return send(res, 200, { requests: out });
    }
    if (req.method === "POST") {
      const b = await readBody(req);
      const id = String(b.id || "");
      if (!/^pay[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
      const rec = await dbGet("pay_requests/" + id);
      if (!rec) return send(res, 404, { error: "gone" });
      if (rec.status === "approved" || rec.status === "rejected")
        return send(res, 200, { ok: true, already: rec.status });

      if (b.ok === true) {
        const tid = String(b.tid || "").replace(/[^a-zA-Z0-9]/g, "");
        if (tid.length < 6 || tid.length > 24) {
          await dbUpdate("pay_requests/" + id, { status: "rejected", reason: "unreadable" });
          return send(res, 200, { ok: true, rejected: "unreadable" });
        }
        const amount = parseInt(b.amount, 10) || 0;
        if (amount < MIN_TOPUP_RS) {
          await dbUpdate("pay_requests/" + id, { status: "rejected", reason: "amount" });
          return send(res, 200, { ok: true, rejected: "amount" });
        }
        const used = await dbGet("used_tids/" + tid);
        if (used) {
          await dbUpdate("pay_requests/" + id, { status: "rejected", reason: "tid_used", tid });
          return send(res, 200, { ok: true, rejected: "tid_used" });
        }
        await dbSet("used_tids/" + tid, { device: rec.device, ts: now });
        const credits = Math.floor(amount / 2);
        const w = await getWallet(rec.device);
        w.paid = (w.paid || 0) + credits; w.ts = now;
        await dbSet("studio_wallets/" + rec.device, w);
        await dbUpdate("pay_requests/" + id, { status: "approved", tid, amount, credits, doneTs: now });
        await bumpStat("paid");
        await bumpStatN("paidRs", amount);
        /* dashboard economy panel: keep the last 10 top-ups (best-effort) */
        try {
          const recent = (await dbGet("recent_topups")) || [];
          recent.unshift({ amount, credits, code: String(rec.device || "").slice(4, 12).toUpperCase(), ts: now });
          await dbSet("recent_topups", recent.slice(0, 10));
        } catch (e) {}
        return send(res, 200, { ok: true, approved: true, credits });
      }
      const reason = REASONS.includes(b.reason) ? b.reason : "unreadable";
      await dbUpdate("pay_requests/" + id, { status: "rejected", reason });
      return send(res, 200, { ok: true, rejected: reason });
    }
    return send(res, 405, { error: "method" });
  } catch (e) {
    return send(res, 500, { error: "agent failed" });
  }
};

/* POST /api/studio-buydesign { device, fp, theme } — unlock a premium page
   design forever for DESIGN_PRICE credits (free credits first, then paid).
   The unlock lives at design_unlocks/<device>/<theme>; /api/create refuses
   premium themes without it. */
const hBuyDesign = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const ip = clientIp(req);
    const rl = await rateLimited(ip, "buydesign", 10, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many tries — wait a few minutes" });
    const b = await readBody(req);
    let device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const theme = String(b.theme || "");
    if (!PREMIUM_THEMES.includes(theme)) return send(res, 400, { error: "not a premium design" });
    const resolved = await resolveWallet(device, String(b.fp || ""), ip);
    device = resolved.device;
    const unlocks = (await dbGet("design_unlocks/" + device).catch(() => null)) || {};
    const w0 = resolved.wallet;
    if (unlocks[theme]) {
      return send(res, 200, { ok: true, already: true, device, free: w0.free || 0, paid: w0.paid || 0, total: (w0.free || 0) + (w0.paid || 0), unlocked: Object.keys(unlocks) });
    }
    const spend = await spendAmount(device, DESIGN_PRICE);
    if (!spend) {
      const w = await getWallet(device);
      return send(res, 402, { error: "need_credits", need: DESIGN_PRICE, free: w.free || 0, paid: w.paid || 0, total: (w.free || 0) + (w.paid || 0) });
    }
    await dbSet("design_unlocks/" + device + "/" + theme, Date.now());
    unlocks[theme] = Date.now();
    const w = await getWallet(device);
    return send(res, 200, { ok: true, device, theme, free: w.free || 0, paid: w.paid || 0, total: (w.free || 0) + (w.paid || 0), unlocked: Object.keys(unlocks) });
  } catch (e) {
    return send(res, 500, { error: "buydesign failed" });
  }
};

/* /api/studio-wallet — the credits wallet door.
   GET  ?device=         → { free, paid, total, code } — creates/migrates
                           the wallet and applies the 24h free refill.
   POST { code, device } → restore: find the wallet that owns this balance
                           code and return its device id + balance, so the
                           visitor can adopt it on a new phone/browser. */
const hWallet = async (req, res) => {
  try {
    if (req.method === "GET") {
      const device = String((req.query && req.query.device) || "");
      if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
      const fp = String((req.query && req.query.fp) || "");
      const resolved = await resolveWallet(device, fp, clientIp(req));
      const w = resolved.wallet;
      const unlocks = (await dbGet("design_unlocks/" + resolved.device).catch(() => null)) || {};
      return send(res, 200, { device: resolved.device, free: w.free || 0, paid: w.paid || 0, total: (w.free || 0) + (w.paid || 0), code: resolved.device.slice(4, 12).toUpperCase(), designs: { price: DESIGN_PRICE, premium: PREMIUM_THEMES, unlocked: Object.keys(unlocks) } });
    }
    if (req.method === "POST") {
      const ip = clientIp(req);
      const rl = await rateLimited(ip, "restore", 5, 10 * 60 * 1000);
      if (rl.limited) return send(res, 429, { error: "too many tries — wait a few minutes" });
      const b = await readBody(req);
      const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (code.length < 6) return send(res, 400, { error: "bad code" });
      await recordFailure(rl.key, rl.rec, rl.now);
      const wallets = (await dbGet("studio_wallets")) || {};
      let device = Object.keys(wallets).find((k) => k.slice(4, 12).toUpperCase() === code) || "";
      if (!device) {
        const all = (await dbGet("studio_usage")) || {};
        device = Object.keys(all).find((k) => k.slice(4, 12).toUpperCase() === code) || "";
      }
      if (!device) return send(res, 404, { error: "code not found" });
      const w = await getWallet(device);
      return send(res, 200, { device, free: w.free || 0, paid: w.paid || 0, total: (w.free || 0) + (w.paid || 0) });
    }
    return send(res, 405, { error: "method" });
  } catch (e) {
    return send(res, 500, { error: "wallet failed" });
  }
};

/* ---------- Rewarded ads (Telegram Mini App) ----------
   POST ?a=adstart {device} creates a one-time ad session and returns
   { ymid }. The Mini App passes that ymid to Monetag's SDK; Monetag's
   server then calls the postback URL configured in its dashboard:
   GET ?a=adreward&ymid=...&event_type=impression&reward_event_type=valued
   A valued impression grants AD_REWARD_CREDITS to the session device's
   wallet — once per session (Monetag retries/duplicates postbacks, so
   the used flag is the dedup) and under a per-device daily cap. */
const AD_REWARD_CREDITS = 10, AD_DAILY_CAP = 5;

function pktDay() { return new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10); }

const hAdStart = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const ip = clientIp(req);
    const rl = await rateLimited(ip, "adstart", 10, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many — try again in a few minutes" });
    await recordFailure(rl.key, rl.rec, rl.now);
    const id = "ad" + randomCode(14);
    await dbSet("ad_sessions/" + id, { device, ts: Date.now(), used: false });
    return send(res, 200, { ymid: id });
  } catch (e) {
    return send(res, 500, { error: "adstart failed" });
  }
};

const hAdReward = async (req, res) => {
  /* Monetag postback. Always answer 200 so Monetag stops retrying;
     unknown, expired or already-used sessions are simply ignored. */
  try {
    const url = new URL(req.url, "https://x.local");
    const ymid = String(url.searchParams.get("ymid") || "");
    const valued = String(url.searchParams.get("reward_event_type") || "") === "valued";
    const evType = String(url.searchParams.get("event_type") || "");
    if (!/^ad[a-zA-Z0-9]{10,20}$/.test(ymid)) return send(res, 200, { ok: true, ignored: "bad ymid" });
    const sess = await dbGet("ad_sessions/" + ymid);
    if (!sess || sess.used || Date.now() - (sess.ts || 0) > 2 * 3600 * 1000)
      return send(res, 200, { ok: true, ignored: "unknown or used" });
    await dbUpdate("ad_sessions/" + ymid, { used: true, valued, evType, doneTs: Date.now() });
    if (!valued || evType !== "impression") return send(res, 200, { ok: true, granted: false });
    const device = sess.device;
    const day = pktDay();
    const cnt = (await dbGet("ad_grants/" + device + "/" + day)) || 0;
    if (cnt >= AD_DAILY_CAP) return send(res, 200, { ok: true, granted: false, capped: true });
    const w = await getWallet(device);
    w.paid = (w.paid || 0) + AD_REWARD_CREDITS; w.ts = Date.now();
    await dbSet("studio_wallets/" + device, w);
    await dbSet("ad_grants/" + device + "/" + day, cnt + 1);
    try {
      const tot = (await dbGet("stats_total")) || {};
      await dbUpdate("stats_total", { adGranted: (tot.adGranted || 0) + AD_REWARD_CREDITS });
    } catch (e) {}
    return send(res, 200, { ok: true, granted: true, credits: AD_REWARD_CREDITS });
  } catch (e) {
    return send(res, 200, { ok: true });
  }
};

module.exports = async (req, res) => {
  const a = (req.query && req.query.a) || "";
  if (a === "request") return hRequest(req, res);
  if (a === "status") return hStatus(req, res);
  if (a === "agent") return hAgent(req, res);
  if (a === "grant") return hGrant(req, res);
  if (a === "pay") return hPay(req, res);
  if (a === "payagent") return hPayAgent(req, res);
  if (a === "wallet") return hWallet(req, res);
  if (a === "buydesign") return hBuyDesign(req, res);
  if (a === "adstart") return hAdStart(req, res);
  if (a === "adreward") return hAdReward(req, res);
  return send(res, 404, { error: "unknown studio action" });
};

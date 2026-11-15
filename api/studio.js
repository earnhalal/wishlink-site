/* /api/studio — ALL WishLink Studio endpoints in ONE serverless function.
   Vercel's Hobby plan allows only 12 functions per deployment, so the
   studio family (request, status, agent, grant, pay, pay-agent) lives
   here behind ?a= and vercel.json rewrites keep the public paths:
     /api/studio-request  -> ?a=request    /api/studio-status -> ?a=status
     /api/studio-agent    -> ?a=agent      /api/studio-grant  -> ?a=grant
     /api/studio-pay      -> ?a=pay        /api/studio-pay-agent -> ?a=payagent */
const { dbGet, dbSet, dbUpdate, dbRemove, readBody, send, clientIp, rateLimited, recordFailure, randomCode } = require("./_lib");

/* POST /api/studio-request — { img, name, style }
   A visitor asks Laila (the AI agent) to edit their photo into a birthday
   scene. The request joins a queue in RTDB; the agent picks it up within
   a few minutes and posts the result back (see /api/studio-agent). */

const STYLES = ["midnight", "rose", "royal"];

/* analytics counters (best-effort): stats_days/<PKT day>.<field> and
   stats_total.<field> — a stats failure must never break studio work */
async function bumpStat(field) {
  try {
    const day = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
    const dayRec = (await dbGet("stats_days/" + day)) || {};
    const dUpd = {}; dUpd[field] = (dayRec[field] || 0) + 1;
    await dbUpdate("stats_days/" + day, dUpd);
    const tot = (await dbGet("stats_total")) || {};
    const tUpd = {}; tUpd[field] = (tot[field] || 0) + 1;
    await dbUpdate("stats_total", tUpd);
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

    const device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const usage = (await dbGet("studio_usage/" + device)) || { count: 0 };
    if ((usage.count || 0) >= 2 + (usage.bonus || 0))
      return send(res, 403, { limit: true, error: "Free limit reached — 2 free AI edits per device" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, "studio", 5, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many requests — try again in a few minutes" });

    const id = "sr" + randomCode(12);
    await dbSet("studio_requests/" + id, { img, name, style, device, status: "pending", ts: Date.now() });
    await dbSet("studio_usage/" + device, { count: (usage.count || 0) + 1, bonus: usage.bonus || 0, ts: Date.now() });
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
      if (rec.status !== "done" && rec.device) {
        const u = (await dbGet("studio_usage/" + rec.device)) || { count: 0 };
        await dbSet("studio_usage/" + rec.device, { count: Math.max(0, (u.count || 0) - 1), bonus: u.bonus || 0, ts: Date.now() });
      }
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
        if (rec.device) {
          const u = (await dbGet("studio_usage/" + rec.device)) || { count: 0 };
          await dbSet("studio_usage/" + rec.device, { count: Math.max(0, (u.count || 0) - 1), bonus: u.bonus || 0, ts: Date.now() });
        }
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
   Body: { code } or { device }, optional { add } (default 1).
   Adds paid bonus edits to a device's studio quota (limit = 2 + bonus).
   The owner receives the payer's order code on WhatsApp and forwards it;
   the code is chars 4..12 of the device id, matched against usage keys. */

const hGrant = async (req, res) => {
  const token = process.env.WL_AGENT_TOKEN || "";
  if (!token || req.headers["x-agent-token"] !== token) return send(res, 401, { error: "unauthorized" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const add = Math.max(1, Math.min(10, parseInt(b.add, 10) || 1));
    let device = String(b.device || "");
    if (!device && b.code) {
      const code = String(b.code).toUpperCase().replace(/[^A-Z0-9]/g, "");
      const all = (await dbGet("studio_usage")) || {};
      device = Object.keys(all).find((k) => k.slice(4, 12).toUpperCase() === code) || "";
      if (!device) return send(res, 404, { error: "code not found" });
    }
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const u = (await dbGet("studio_usage/" + device)) || { count: 0 };
    const bonus = (u.bonus || 0) + add;
    await dbSet("studio_usage/" + device, { count: u.count || 0, bonus, ts: Date.now() });
    return send(res, 200, { ok: true, device, bonus });
  } catch (e) {
    return send(res, 500, { error: "grant failed" });
  }
};
/* /api/studio-pay — paid AI-edit unlock by payment screenshot.
   POST { device, img }  → create a payment check request (one pending per device)
   GET  ?id=&device=     → { status, reason? }  pending|checking|approved|rejected|expired
   The screenshot is verified by the agent (see /api/studio-pay-agent);
   approval grants +1 bonus edit to the device automatically. */

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
      return send(res, 200, out);
    }
    if (req.method !== "POST") return send(res, 405, { error: "method" });
    const b = await readBody(req);
    const device = String(b.device || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const img = String(b.img || "");
    if (!img.startsWith("data:image/") || img.length < 1000 || img.length > 1600000)
      return send(res, 400, { error: "bad image" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, "pay", 5, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many tries — wait a few minutes" });

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
   POST { id, ok: true, tid }  → approve: the transaction id must be unused;
          records it and grants the device +1 bonus edit.
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
        const used = await dbGet("used_tids/" + tid);
        if (used) {
          await dbUpdate("pay_requests/" + id, { status: "rejected", reason: "tid_used", tid });
          return send(res, 200, { ok: true, rejected: "tid_used" });
        }
        await dbSet("used_tids/" + tid, { device: rec.device, ts: now });
        const u = (await dbGet("studio_usage/" + rec.device)) || { count: 0 };
        await dbSet("studio_usage/" + rec.device, { count: u.count || 0, bonus: (u.bonus || 0) + 1, ts: now });
        await dbUpdate("pay_requests/" + id, { status: "approved", tid, doneTs: now });
        await bumpStat("paid");
        return send(res, 200, { ok: true, approved: true });
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

module.exports = async (req, res) => {
  const a = (req.query && req.query.a) || "";
  if (a === "request") return hRequest(req, res);
  if (a === "status") return hStatus(req, res);
  if (a === "agent") return hAgent(req, res);
  if (a === "grant") return hGrant(req, res);
  if (a === "pay") return hPay(req, res);
  if (a === "payagent") return hPayAgent(req, res);
  return send(res, 404, { error: "unknown studio action" });
};

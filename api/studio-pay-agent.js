/* /api/studio-pay-agent — the agent's private door to the payment queue.
   Auth: header x-agent-token must match env WL_AGENT_TOKEN.
   GET  → claim up to 2 pending screenshot checks (marks them "checking").
   POST { id, ok: true, tid }  → approve: the transaction id must be unused;
          records it and grants the device +1 bonus edit.
   POST { id, ok: false, reason } → reject (amount|receiver|unreadable|not_receipt).
   Old requests (>2h) are deleted on every call. */
const { dbGet, dbSet, dbUpdate, dbRemove, readBody, send } = require("./_lib");

function authed(req) {
  const t = process.env.WL_AGENT_TOKEN || "";
  return t.length >= 16 && (req.headers["x-agent-token"] || "") === t;
}
const REASONS = ["amount", "receiver", "unreadable", "not_receipt"];

module.exports = async (req, res) => {
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

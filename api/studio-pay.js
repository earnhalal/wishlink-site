/* /api/studio-pay — paid AI-edit unlock by payment screenshot.
   POST { device, img }  → create a payment check request (one pending per device)
   GET  ?id=&device=     → { status, reason? }  pending|checking|approved|rejected|expired
   The screenshot is verified by the agent (see /api/studio-pay-agent);
   approval grants +1 bonus edit to the device automatically. */
const { dbGet, dbSet, readBody, send, clientIp, rateLimited, recordFailure, randomCode } = require("./_lib");

module.exports = async (req, res) => {
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

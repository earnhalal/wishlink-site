/* POST /api/studio-grant — agent-token only.
   Body: { code } or { device }, optional { add } (default 1).
   Adds paid bonus edits to a device's studio quota (limit = 2 + bonus).
   The owner receives the payer's order code on WhatsApp and forwards it;
   the code is chars 4..12 of the device id, matched against usage keys. */
const { dbGet, dbSet, readBody, send } = require("./_lib");

module.exports = async (req, res) => {
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

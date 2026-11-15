/* GET /api/studio-status?id=srXXXX — poll the state of an AI edit request.
   Requests (and the photos in them) expire after 60 minutes. */
const { dbGet, dbRemove, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  try {
    const url = new URL(req.url, "https://x.local");
    const id = String(url.searchParams.get("id") || "");
    if (!/^sr[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
    const rec = await dbGet("studio_requests/" + id);
    if (!rec) return send(res, 404, { error: "not found" });
    if (Date.now() - (rec.ts || 0) > 60 * 60 * 1000) {
      await dbRemove("studio_requests/" + id);
      return send(res, 200, { status: "expired" });
    }
    const out = { status: rec.status };
    if (rec.status === "done" && rec.result) out.result = rec.result;
    return send(res, 200, out);
  } catch (e) {
    return send(res, 500, { error: "status failed" });
  }
};

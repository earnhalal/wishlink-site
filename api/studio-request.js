/* POST /api/studio-request — { img, name, style }
   A visitor asks Laila (the AI agent) to edit their photo into a birthday
   scene. The request joins a queue in RTDB; the agent picks it up within
   a few minutes and posts the result back (see /api/studio-agent). */
const { dbSet, readBody, send, clientIp, rateLimited, recordFailure, randomCode } = require("./_lib");

const STYLES = ["midnight", "rose", "royal"];

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const img = String(b.img || "");
    const name = String(b.name || "").slice(0, 40);
    const style = STYLES.includes(b.style) ? b.style : "midnight";
    if (!img.startsWith("data:image/") || img.length < 1000 || img.length > 1400000)
      return send(res, 400, { error: "bad image" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, "studio", 5, 10 * 60 * 1000);
    if (rl.limited) return send(res, 429, { error: "too many requests — try again in a few minutes" });

    const id = "sr" + randomCode(12);
    await dbSet("studio_requests/" + id, { img, name, style, status: "pending", ts: Date.now() });
    await recordFailure(rl.key, rl.rec, rl.now);
    return send(res, 200, { id });
  } catch (e) {
    return send(res, 500, { error: "request failed" });
  }
};

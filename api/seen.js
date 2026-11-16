/* POST /api/seen — { slug }
   Fired by the PIN-gate screen when someone opens a shared link (before
   any PIN is typed). Counts link views, deduplicated per visitor IP for
   6 hours so refreshes don't inflate the number. */
const { dbGet, dbUpdate, readBody, send, clientIp, rateLimited, rateLimitedKey, recordFailure } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const slug = String(b.slug || "");
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,48}$/.test(slug)) return send(res, 400, { error: "bad slug" });
    const ip = clientIp(req);
    const guard = await rateLimited(ip, "seen", 60, 10 * 60 * 1000);
    if (guard.limited) return send(res, 200, { ok: true });
    const page = await dbGet("pages/" + slug);
    if (!page) return send(res, 404, { error: "not found" });
    const dedupe = await rateLimitedKey("view_" + slug.replace(/[^a-zA-Z0-9-]/g, "") + "_" + require("crypto").createHash("sha256").update(ip).digest("hex").slice(0, 16), 1, 6 * 60 * 60 * 1000);
    if (!dedupe.limited) {
      await recordFailure(dedupe.key, dedupe.rec, dedupe.now);
      const seen = page.seen || { views: 0, opens: 0 };
      await dbUpdate("pages/" + slug, {
        seen: { views: (seen.views || 0) + 1, opens: seen.opens || 0, lastView: Date.now(), lastOpen: seen.lastOpen || 0 },
      }).catch(() => {});
      /* analytics funnel: total link views (best-effort) */
      try {
        const day = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
        const dayRec = (await dbGet("stats_days/" + day)) || {};
        await dbUpdate("stats_days/" + day, { views: (dayRec.views || 0) + 1 });
        const tot = (await dbGet("stats_total")) || {};
        await dbUpdate("stats_total", { views: (tot.views || 0) + 1 });
      } catch (e) {}
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: "seen failed" });
  }
};

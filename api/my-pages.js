/* GET /api/my-pages?device=<deviceId>
   Lists the surprise pages created on this device, with their seen
   stats. The device id lives only in the creator's own browser — the
   list is visible to whoever holds that device, and to no one else. */
const { dbGet, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  try {
    const url = new URL(req.url, "https://x.local");
    const device = String(url.searchParams.get("device") || "");
    if (!/^[a-zA-Z0-9-]{8,40}$/.test(device)) return send(res, 400, { error: "bad device" });
    const idx = (await dbGet("user_pages/" + device)) || {};
    const slugs = Object.keys(idx).sort((a, b) => (idx[b].ts || 0) - (idx[a].ts || 0)).slice(0, 50);
    const pages = [];
    for (const slug of slugs) {
      const p = await dbGet("pages/" + slug);
      if (!p || p.device !== device) continue;
      const seen = p.seen || { views: 0, opens: 0 };
      pages.push({
        slug, n: p.n || idx[slug].n || "", createdAt: p.createdAt || idx[slug].ts || 0,
        views: seen.views || 0, opens: seen.opens || 0,
        lastView: seen.lastView || 0, lastOpen: seen.lastOpen || 0,
      });
    }
    return send(res, 200, { pages });
  } catch (e) {
    return send(res, 500, { error: "list failed" });
  }
};

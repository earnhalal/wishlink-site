/* GET /api/page-stats?slug=<slug>&token=<editToken>
   Seen stats for one page, proven by the page's edit token (which only
   the creator's device holds). Used for pages created before device
   indexing existed. */
const { dbGet, verifySecret, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  try {
    const url = new URL(req.url, "https://x.local");
    const slug = String(url.searchParams.get("slug") || "");
    const token = String(url.searchParams.get("token") || "");
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,48}$/.test(slug) || !token) return send(res, 400, { error: "bad request" });
    const page = await dbGet("pages/" + slug);
    if (!page) return send(res, 404, { error: "not found" });
    if (!page.editHash || !(await verifySecret(token, page.editSalt, page.editHash)))
      return send(res, 401, { error: "not yours" });
    const seen = page.seen || { views: 0, opens: 0 };
    return send(res, 200, {
      slug, n: page.n || "", createdAt: page.createdAt || 0,
      views: seen.views || 0, opens: seen.opens || 0,
      lastView: seen.lastView || 0, lastOpen: seen.lastOpen || 0,
    });
  } catch (e) {
    return send(res, 500, { error: "stats failed" });
  }
};

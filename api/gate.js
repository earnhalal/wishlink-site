/* GET /api/gate?slug=<slug>
   Returns ONLY the page's theme id, so the PIN gate can be painted in
   the page's own colours before anything is unlocked. The theme is not
   secret — no name, wish, photo or any content leaves the server here. */
const { dbGet, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  try {
    const url = new URL(req.url, "https://x.local");
    const slug = String(url.searchParams.get("slug") || "");
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,48}$/.test(slug)) return send(res, 400, { error: "bad slug" });
    const page = await dbGet("pages/" + slug);
    if (!page) return send(res, 404, { error: "not found" });
    return send(res, 200, { t: page.t || "classic", o: page.o || "birthday" });
  } catch (e) {
    return send(res, 500, { error: "gate failed" });
  }
};

/* POST /api/report — { slug }
   Records a visitor report against a page. Pages with 5+ reports are
   flagged for manual review (flag is visible only server-side). */
const { init, readBody, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const { db } = init();
    const b = await readBody(req);
    const slug = String(b.slug || "");
    if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(slug)) return send(res, 400, { error: "bad slug" });
    const ref = db.ref("pages/" + slug);
    const snap = await ref.get();
    if (!snap.exists()) return send(res, 404, { error: "page not found" });
    const reports = (snap.val().reports || 0) + 1;
    await ref.update({ reports, flagged: reports >= 5 });
    return send(res, 200, { reported: true });
  } catch (e) {
    return send(res, 500, { error: "report failed" });
  }
};

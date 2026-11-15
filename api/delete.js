/* POST /api/delete — { slug, token }
   Deletes a page (database entry + stored photos) when the creator's
   private edit token matches its stored hash. */
const { dbGet, dbRemove, storageDeletePrefix, verifySecret, readBody, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const slug = String(b.slug || "");
    const token = String(b.token || "");
    if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(slug) || !token) return send(res, 400, { error: "slug and token required" });
    const page = await dbGet("pages/" + slug);
    if (!page) return send(res, 404, { error: "page not found" });
    if (!page.editHash) return send(res, 403, { error: "this page has no edit token (it was made before tokens existed)" });
    const ok = await verifySecret(token, page.editSalt, page.editHash);
    if (!ok) return send(res, 401, { error: "wrong edit token" });
    await dbRemove("pages/" + slug);
    try { await storageDeletePrefix("pages/" + slug + "/"); } catch (e) { /* photos may not exist */ }
    return send(res, 200, { deleted: true });
  } catch (e) {
    return send(res, 500, { error: "delete failed" });
  }
};

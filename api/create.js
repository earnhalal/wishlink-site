/* POST /api/create — create a surprise page.
   Body: { n, f, pin, w, l, g, t, images: [dataUrl, ...] }
   Stores content in RTDB with the PIN as a salted scrypt hash.
   Photos go to Firebase Storage at unguessable paths; the DB holds only URLs.
   Returns: { slug, editToken } — the edit token exists ONLY in this response
   and on the creator's device. */
const { dbSet, storageUpload, hashSecret, newSalt, randomCode, slugifyName, readBody, send } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const name = String(b.n || "").slice(0, 60);
    const from = String(b.f || "").slice(0, 60);
    const pin = String(b.pin || "");
    if (!name || !/^[0-9]{4,8}$/.test(pin)) return send(res, 400, { error: "name and a 4-8 digit PIN are required" });
    const content = {
      n: name,
      f: from,
      w: String(b.w || "").slice(0, 1200),
      l: String(b.l || "").slice(0, 4000),
      g: String(b.g || "").slice(0, 600),
      t: String(b.t || "classic").slice(0, 24),
      createdAt: Date.now(),
      reports: 0,
    };
    const slug = slugifyName(name) + "-" + randomCode(10);

    /* photos → Storage */
    const images = Array.isArray(b.images) ? b.images.slice(0, 4) : [];
    const urls = [];
    for (const dataUrl of images) {
      const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(String(dataUrl));
      if (!m) continue;
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > 400_000) continue;
      const path = "pages/" + slug + "/" + randomCode(16) + ".jpg";
      urls.push(await storageUpload(path, buf));
    }
    if (urls.length) content.im = urls;

    /* secrets: salted hashes only */
    const pinSalt = newSalt();
    content.pinHash = await hashSecret(pin, pinSalt);
    content.pinSalt = pinSalt;
    const editToken = randomCode(20);
    const editSalt = newSalt();
    content.editHash = await hashSecret(editToken, editSalt);
    content.editSalt = editSalt;

    await dbSet("pages/" + slug, content);
    return send(res, 200, { slug, editToken });
  } catch (e) {
    return send(res, 500, { error: "create failed" });
  }
};

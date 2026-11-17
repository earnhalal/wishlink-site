/* POST /api/create — create a surprise page.
   Body: { n, f, pin, w, l, g, t, images: [dataUrl, ...] }
   Stores content in RTDB with the PIN as a salted scrypt hash.
   Photos go to Firebase Storage at unguessable paths; the DB holds only URLs.
   Returns: { slug, editToken } — the edit token exists ONLY in this response
   and on the creator's device. */
const { dbGet, dbSet, dbUpdate, storageUpload, hashSecret, newSalt, randomCode, slugifyName, readBody, send } = require("./_lib");

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
      seen: { views: 0, opens: 0 },
    };
    const device = String(b.device || "");
    if (/^[a-zA-Z0-9-]{8,40}$/.test(device)) content.device = device;
    /* occasion: birthday is the default and stays implicit (old records
       have no field); any other known occasion is stored as content.o */
    const OCCS = ["love", "friendship", "newyear", "anniversary", "invitation", "wedding", "baby", "eid"];
    const occ = String(b.o || "birthday");
    if (OCCS.includes(occ)) content.o = occ;
    /* all designs are free (owner order 2026-11-17) — no premium gate */
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
      try {
        urls.push(await storageUpload(path, buf));
      } catch (e) {
        /* Storage not enabled on this project (needs Blaze) — keep the
           photo inside the page record instead. It is still only ever
           released by /api/unlock after the PIN checks out. */
        urls.push(dataUrl);
      }
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

    /* analytics: daily page-creation counter (best-effort — a stats
       failure must never block a page creation) */
    try {
      const day = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
      const dayRec = (await dbGet("stats_days/" + day)) || {};
      const theme = String(content.t || "classic");
      const dThemes = Object.assign({}, dayRec.themes || {});
      dThemes[theme] = (dThemes[theme] || 0) + 1;
      const occKey = String(content.o || "birthday");
      const dOccs = Object.assign({}, dayRec.occs || {});
      dOccs[occKey] = (dOccs[occKey] || 0) + 1;
      await dbUpdate("stats_days/" + day, { created: (dayRec.created || 0) + 1, themes: dThemes, occs: dOccs });
      const tot = (await dbGet("stats_total")) || {};
      const tThemes = Object.assign({}, tot.themes || {});
      tThemes[theme] = (tThemes[theme] || 0) + 1;
      const tOccs = Object.assign({}, tot.occs || {});
      tOccs[occKey] = (tOccs[occKey] || 0) + 1;
      await dbUpdate("stats_total", { pages: (tot.pages || 0) + 1, themes: tThemes, occs: tOccs });
    } catch (e) {}

    if (content.device) {
      await dbSet("user_pages/" + content.device + "/" + slug, { n: name, ts: content.createdAt }).catch(() => {});
    }
    return send(res, 200, { slug, editToken });
  } catch (e) {
    return send(res, 500, { error: "create failed" });
  }
};

/* POST /api/unlock — { slug, pin }
   The ONLY way page content leaves the server. Content is returned solely
   after the PIN verifies against its salted hash. Failed attempts are
   rate-limited per IP + page. */
const { dbGet, verifySecret, readBody, send, clientIp, rateLimited, recordFailure, clearFailures } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  try {
    const b = await readBody(req);
    const slug = String(b.slug || "");
    const pin = String(b.pin || "");
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,48}$/.test(slug)) return send(res, 400, { error: "bad slug" });

    const ip = clientIp(req);
    const rl = await rateLimited(ip, slug);
    if (rl.limited) return send(res, 429, { error: "too many tries — please wait a few minutes" });

    const page = await dbGet("pages/" + slug);
    if (!page) return send(res, 404, { error: "page not found" });

    const okPin = page.pinHash ? await verifySecret(pin, page.pinSalt, page.pinHash) : pin === page.p;
    if (!okPin) {
      await recordFailure(rl.key, rl.rec, rl.now);
      return send(res, 401, { error: "wrong PIN" });
    }
    await clearFailures(rl.key);

    /* content only — never the hashes. Fields pass through as stored:
       new pages carry full texts (w/l/g); legacy pages carry template
       indexes (wc/wi/li/gi) which the client resolves locally. */
    const out = {};
    for (const k of ["n", "f", "w", "l", "g", "wc", "wi", "li", "gi", "t", "im"]) {
      if (page[k] !== undefined) out[k] = page[k];
    }
    if (!out.t) out.t = "classic";
    if (!out.im) out.im = [];
    return send(res, 200, out);
  } catch (e) {
    return send(res, 500, { error: "unlock failed", detail: String(e && e.message || e) });
  }
};

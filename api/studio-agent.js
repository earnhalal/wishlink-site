/* /api/studio-agent — the agent's private door to the AI-edit queue.
   Auth: header x-agent-token must match env WL_AGENT_TOKEN.
   GET  → claim up to 3 pending requests (marks them "working").
   POST { id, result } → mark done with the edited picture (data URL).
   POST { id, fail: true } → mark failed.
   Old requests (>2h, any state) are deleted on every call — photos are
   never kept longer than that. */
const { dbGet, dbSet, dbUpdate, dbRemove, readBody, send } = require("./_lib");

function authed(req) {
  const t = process.env.WL_AGENT_TOKEN || "";
  return t.length >= 16 && (req.headers["x-agent-token"] || "") === t;
}

module.exports = async (req, res) => {
  if (!authed(req)) return send(res, 401, { error: "unauthorized" });
  try {
    const all = (await dbGet("studio_requests")) || {};
    const now = Date.now();
    for (const [id, r] of Object.entries(all)) {
      if (now - (r.ts || 0) > 2 * 60 * 60 * 1000) await dbRemove("studio_requests/" + id);
    }
    if (req.method === "GET") {
      const pending = Object.entries(all)
        .filter(([, r]) => now - (r.ts || 0) <= 2 * 60 * 60 * 1000 &&
          (r.status === "pending" || (r.status === "working" && now - (r.wts || 0) > 10 * 60 * 1000)))
        .sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0))
        .slice(0, 2);
      const out = [];
      for (const [id, r] of pending) {
        await dbUpdate("studio_requests/" + id, { status: "working", wts: now });
        out.push({ id, img: r.img, name: r.name || "", style: r.style || "midnight" });
      }
      return send(res, 200, { requests: out });
    }
    if (req.method === "POST") {
      const b = await readBody(req);
      const id = String(b.id || "");
      if (!/^sr[a-zA-Z0-9]{8,20}$/.test(id)) return send(res, 400, { error: "bad id" });
      const rec = await dbGet("studio_requests/" + id);
      if (!rec) return send(res, 404, { error: "not found" });
      if (b.fail) {
        await dbUpdate("studio_requests/" + id, { status: "failed" });
        if (rec.device) {
          const u = (await dbGet("studio_usage/" + rec.device)) || { count: 0 };
          await dbSet("studio_usage/" + rec.device, { count: Math.max(0, (u.count || 0) - 1), bonus: u.bonus || 0, ts: Date.now() });
        }
        return send(res, 200, { ok: true });
      }
      const result = String(b.result || "");
      if (!result.startsWith("data:image/") || result.length > 2500000)
        return send(res, 400, { error: "bad result" });
      await dbUpdate("studio_requests/" + id, { status: "done", result, doneTs: Date.now() });
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { error: "method" });
  } catch (e) {
    return send(res, 500, { error: "agent failed" });
  }
};

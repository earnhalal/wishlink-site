/* WishLink API shared helpers (Vercel serverless, Node 18+).
   Requires env var FIREBASE_SERVICE_ACCOUNT (JSON string of the service account). */
const crypto = require("crypto");

let admin = null;
let db = null;
let bucket = null;

function init() {
  if (db) return { db, bucket };
  admin = require("firebase-admin");
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
  const sa = JSON.parse(raw);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      databaseURL: "https://wishlink-e9752-default-rtdb.asia-southeast1.firebasedatabase.app",
      storageBucket: "wishlink-e9752.firebasestorage.app",
    });
  }
  db = admin.database();
  bucket = admin.storage().bucket();
  return { db, bucket };
}

function hashSecret(secret, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(String(secret), salt, 64, (err, key) => (err ? reject(err) : resolve(key.toString("hex"))));
  });
}
function newSalt() { return crypto.randomBytes(16).toString("hex"); }
async function verifySecret(secret, salt, expectedHex) {
  const got = await hashSecret(secret, salt);
  const a = Buffer.from(got, "hex");
  const b = Buffer.from(expectedHex, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function randomCode(n) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  const bytes = crypto.randomBytes(n);
  for (let i = 0; i < n; i++) s += chars[bytes[i] % chars.length];
  return s;
}
function slugifyName(name) {
  return String(name || "friend").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 18) || "friend";
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 3_500_000) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}
function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
function clientIp(req) {
  const fwd = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket?.remoteAddress || "unknown";
}
function ipKey(ip) { return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24); }

/* Rate limit: max `max` failed attempts per `windowMs` per IP+slug, stored in RTDB _rl/<key>. */
async function rateLimited(db, ip, slug, max = 8, windowMs = 10 * 60 * 1000) {
  const key = ipKey(ip) + "_" + slug.replace(/[^a-zA-Z0-9-]/g, "");
  const ref = db.ref("_rl/" + key);
  const snap = await ref.get();
  const now = Date.now();
  let rec = snap.val() || { count: 0, since: now };
  if (now - rec.since > windowMs) rec = { count: 0, since: now };
  return { limited: rec.count >= max, key, rec, now };
}
async function recordFailure(db, key, rec, now) {
  await db.ref("_rl/" + key).set({ count: (rec.count || 0) + 1, since: rec.since || now });
}
async function clearFailures(db, key) { await db.ref("_rl/" + key).remove(); }

module.exports = { init, hashSecret, newSalt, verifySecret, randomCode, slugifyName, readBody, send, clientIp, rateLimited, recordFailure, clearFailures };

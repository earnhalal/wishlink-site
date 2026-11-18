/* WishLink — bot logger.
   Static pages are served by Vercel's CDN without any server code, so
   crawlers that never run JavaScript (GPTBot, ClaudeBot, CCBot, ...)
   would be invisible to the site's JS tracker. This edge middleware
   spots known bot user-agents on page requests and reports them to
   /api/track (type "botlog"), where they are counted separately from
   human visitors. It never blocks or changes a response: any failure
   is swallowed and the page is served exactly as usual. */
const BOT_RE = /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Googlebot|Bingbot|Applebot|Meta-ExternalAgent|facebookexternalhit|Twitterbot|LinkedInBot|DuckDuckBot|YandexBot|Baiduspider|Bytespider|Amazonbot|cohere-ai|Diffbot|ImagesiftBot|PetalBot|SemrushBot|AhrefsBot|MJ12bot|DotBot|DataForSeoBot|ia_archiver|archive\.org_bot|MistralAI|YouBot|HeadlessChrome|python-requests|python-urllib|Go-http-client|axios|node-fetch|okhttp|curl\/|wget|bot|crawler|spider|slurp)/i;

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml).*)"],
};

export default function middleware(req, context) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    if (path === "/stats.html") return;
    if (path !== "/" && !path.endsWith(".html")) return;
    const ua = req.headers.get("user-agent") || "";
    if (!BOT_RE.test(ua)) return;
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const cc = req.headers.get("x-vercel-ip-country") || "";
    const city = req.headers.get("x-vercel-ip-city") || "";
    const page = path === "/" ? "home" : path.replace(/^\/+/, "").replace(/\.html$/, "");
    const body = JSON.stringify({ type: "botlog", ua: ua, ip: ip, cc: cc, city: city, page: page });
    const p = fetch(new URL("/api/track", req.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    }).catch(function () {});
    if (context && typeof context.waitUntil === "function") context.waitUntil(p);
  } catch (e) {
    /* never let logging break a page */
  }
}

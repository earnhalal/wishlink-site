# -*- coding: utf-8 -*-
"""WishLink static pages: About, Privacy, Terms, Contact, Blog + posts, sitemap, robots."""
import io, os

CSS = """
:root{--teal:#AD2E5D;--teal-d:#7E1F45;--ink:#571F30;--mut:#886A75;--bg2:#FFFBF7;--line:#F3D9E2}
*{box-sizing:border-box;margin:0;padding:0}
h1,h2,h3,.brand{font-family:'Newsreader',Georgia,serif}
:focus-visible{outline:3px solid #E8A62E;outline-offset:2px}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg2);color:var(--ink);line-height:1.6}
.top{display:flex;align-items:center;gap:14px;padding:14px 20px;max-width:1060px;margin:0 auto}
.brand{font-weight:800;font-size:21px}
.brand-emoji{font-size:24px}
.tagline{text-align:center;color:var(--mut);letter-spacing:2.5px;font-size:11px;font-weight:700;margin-top:-6px}
.nav{display:flex;gap:20px;align-items:center;margin-left:auto}
.nav a{color:var(--ink);text-decoration:none;font-weight:600;font-size:14.5px}
.nav a:hover{color:var(--teal)}
.langsel{margin-left:12px;border:1.5px solid #F3D9E2;background:#fff;color:#AD2E5D;font:600 13.5px 'DM Sans',sans-serif;padding:8px 10px;border-radius:999px;cursor:pointer;max-width:150px}
.mypill{margin-left:12px;background:#AD2E5D;color:#fff!important;text-decoration:none;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 16px rgba(173,46,93,.25)}
.mypill:hover{background:#7E1F45}
.menubtn{display:none;background:#fff;border:1.5px solid #F3D9E2;color:#AD2E5D;font-size:18px;line-height:1;padding:8px 13px;border-radius:999px;cursor:pointer;margin-left:10px}
@media(max-width:860px){.menubtn{display:block}.langsel{margin-left:auto}.nav{display:none!important}.nav.open{display:flex!important;position:absolute;top:60px;right:12px;left:12px;flex-direction:column;align-items:stretch;gap:2px;background:#fff;border:1.5px solid #F3D9E2;border-radius:16px;padding:8px;box-shadow:0 18px 40px rgba(173,46,93,.18);z-index:80;margin-left:0}.nav.open a{padding:12px 14px;border-radius:10px;font-size:15.5px;text-decoration:none}.topin,header.top{position:relative}}

.page{max-width:760px;margin:26px auto 10px;padding:0 18px}
.page .card{background:#fff;border:1.5px solid var(--line);border-radius:20px;padding:30px 28px;box-shadow:0 10px 30px rgba(14,80,70,.07)}
.page h1{font-size:30px;line-height:1.25;margin-bottom:6px}
.page .lede{color:var(--mut);font-size:16.5px;margin-bottom:14px}
.page h2{font-size:20px;margin:22px 0 8px}
.page p{margin:9px 0;font-size:15.5px}
.page ul,.page ol{margin:9px 0 9px 22px;font-size:15.5px}
.page li{margin:5px 0}
.page a{color:var(--teal);font-weight:600}
.meta{color:var(--mut);font-size:13px;margin-bottom:8px}
.cta{display:inline-block;margin-top:16px;background:var(--teal);color:#fff!important;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:999px}
.postcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:16px}
.postcard{background:#fff;border:1.5px solid var(--line);border-radius:18px;padding:20px;text-decoration:none;color:var(--ink);display:block}
.postcard .pi{font-size:30px}
.postcard b{display:block;margin:9px 0 5px;font-size:15.5px;line-height:1.35}
.postcard p{color:var(--mut);font-size:13.5px;line-height:1.55}
.postcard .more{color:var(--teal);font-weight:700;font-size:13px;margin-top:9px;display:block}
footer{background:#4A1225;margin-top:40px;padding:30px 18px 36px;text-align:center;color:#A9AAC4;font-size:13px}
.footlinks{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 18px}
.footlinks a{color:#C9CAE0;text-decoration:none;font-size:13.5px;line-height:2}
.footlinks a:hover{color:#E8A62E;text-decoration:underline}
.wishbox{background:var(--bg2);border:1.5px dashed var(--teal);border-radius:14px;padding:14px 18px;margin:10px 0;font-size:15px}
@media(max-width:640px){.nav{display:none}.mypill{margin-left:auto}}
"""

def shell(title, desc, path, body):
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%s</title>
<meta name="description" content="%s">
<link rel="canonical" href="https://www.wishlink.pp.ua%s">
<meta property="og:type" content="website">
<meta property="og:site_name" content="WishLink">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:url" content="https://www.wishlink.pp.ua%s">
<meta property="og:image" content="https://www.wishlink.pp.ua/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFBF7">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/fonts/fonts.css">
<style>%s</style>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap" rel="stylesheet">
</head>
<body>
<header class="top">
  <a class="brand" href="/" style="text-decoration:none;color:inherit"><span class="brand-emoji">🎂</span> WishLink</a>
  <nav class="nav" id="wlNav">
    <a href="/">Home</a>
    <a href="/#maker">Make a page</a>
    <a href="/studio.html">Photo Studio</a>
    <a href="/my.html">Track My Pages</a>
    <a href="/blog.html">Blog</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
  </nav>
  <select id="wlLangSel" class="langsel" aria-label="Language"><option value="en">🌐 English</option><option value="roman">Roman Urdu</option><option value="ur">اردو</option><option value="hi">हिन्दी</option></select>
  <button id="wlMenuBtn" class="menubtn" aria-label="Menu">☰</button>
</header>
<p class="tagline">BIRTHDAY SURPRISE PAGES</p>
<main class="page"><div class="card">
%s
</div></main>
<footer>
  <p style="margin:0 0 6px"><b style="color:#E8A62E;font-family:'Newsreader',serif;font-size:18px">WishLink</b></p>
  <p class="footlinks"><a href="/">Maker</a><a href="/my.html">Track My Pages</a><a href="/studio.html">Photo Studio</a><a href="/blog.html">Blog</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/delete.html">Delete a page</a></p>
  <p style="margin-top:10px">© 2026 WishLink</p>
</footer>
<script>
/* WishLink analytics — our own counting system (visits + live visitors), stored on our own Firebase. No external service, no ads. */
(function(){
  try {
    var dev = localStorage.getItem('wl_device');
    if (!dev) { dev = 'dev-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); localStorage.setItem('wl_device', dev); }
    var page = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').replace(/\//g, '-') || 'home';
    if (!/^[a-z0-9-]{1,40}$/.test(page)) page = 'other';
    function send(t){ fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device: dev, page: page, type: t, ref: (document.referrer ? document.referrer.split('/')[2] : '') || '' }), keepalive: true }).catch(function(){}); }
    send('visit');
    setInterval(function(){ send('ping'); }, 30000);
  } catch (e) {}
})();
</script>
<script src="/i18n.js"></script>
</body>
</html>""" % (title, desc, path, title, desc, path, CSS, body)

ABOUT = """
<h1>About WishLink</h1>
<p class="lede">WishLink makes one thing, and makes it with love: little web pages that turn a birthday into a moment.</p>
<p>A birthday message on chat is easy to send — and just as easy to forget. A WishLink page is different. It arrives as a single link, locked with a secret PIN only the two of you know. Behind the PIN: music, confetti, a cake with candles to blow out, photos of your favourite moments sliding by, a hidden gift box, and a letter written just for them.</p>
<h2>How it works</h2>
<ol>
<li><b>You fill a tiny form</b> — their name, your name, a wish and a letter. Ready-made wishes and letters are built in if you are stuck for words.</li>
<li><b>You pick a design</b> — 15 themes, from Midnight Gold to Candy Pop, each with its own PIN screen, loading animation and colours.</li>
<li><b>You add photos</b> (optional) — up to 4, shown as an auto-sliding gallery.</li>
<li><b>You share one link</b> — on WhatsApp, Messenger, anywhere. They type the PIN, and the celebration begins.</li>
</ol>
<h2>What it costs</h2>
<p>Nothing. WishLink is free — no sign-up, no app to install, no watermarks on the moment itself (free pages carry one small “Made with WishLink” line). We are a small independent studio, and WishLink is supported by advertising and by the optional extras we are building for people who want even more.</p>
<h2>What is coming</h2>
<p>Birthday pages are just the beginning. The same little celebration is being made for anniversaries, weddings, new babies, Eid and New Year — every occasion where one person deserves to feel celebrated by another.</p>
<h2>Who makes WishLink?</h2>
<p>WishLink is built and run by a small independent team that loves friendly tools for the web. Questions, ideas or a page you need removed? <a href="/contact.html">Talk to us</a> — we read everything.</p>
<a class="cta" href="/">✨ Make a birthday page</a>
"""

PRIVACY = """
<h1>Privacy Policy</h1>
<p class="meta">Last updated: 15 November 2026</p>
<p>This policy explains what information WishLink (wishlink.pp.ua) collects, how it is used, and the choices you have. WishLink is operated by the WishLink team (“we”, “us”). By using the site you agree to this policy.</p>
<h2>1. Information you create</h2>
<p>When you create a surprise page, the content you enter — names, wish, letter, gift line, design choice and any photos you add — is stored securely on our servers (Google Firebase) so that your share link can open the page for the person you send it to. Photos are resized in your browser and stored in secure cloud storage at private, hard-to-guess addresses — they are not inside the page file. Your PIN is never stored as plain text: it is stored only as a salted cryptographic hash, and our server checks the PIN before any page content is released. We do not require an account, and we never ask for passwords, payment details or government IDs.</p>
<h2>2. Information collected automatically</h2>
<p>Our hosting provider (Vercel) and database provider (Google Firebase) may process standard technical information such as IP address, browser type and timestamps in server logs, which is necessary to operate and secure the service. WishLink pages load fonts from Google Fonts, which may receive your IP address as part of serving those fonts.</p>
<h2>3. Cookies and advertising</h2>
<p>WishLink itself does not set tracking cookies. Advertising never appears on birthday surprise pages. On our homepage and blog pages only, we may display advertising provided by Google AdSense. Google and its partners use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">Google Ads Settings</a>, and learn how Google uses data at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">policies.google.com</a>. If you are in the EEA/UK, ads may be served in non-personalised form where consent is required and not given.</p>
<h2>4. How content is used</h2>
<p>Page content is used only to display the page to people who have the link and the PIN. We do not sell personal information. We do not read your letters for marketing. Content may be removed if it violates our <a href="/terms.html">Terms of Use</a>.</p>
<h2>5. Sharing a link is your choice</h2>
<p>Anyone who has both the link and the PIN can open a page. Please share links and PINs only with the people you intend, and only add photos you have the right to share.</p>
<h2>6. Data retention and removal</h2>
<p>Pages and their photos are kept until the creator deletes them. If you created a page, you can delete it yourself at any time on the <a href="/delete.html">Delete a page</a> page using the private edit token you received when the page was created — the page and its photos are removed permanently. Every surprise page also has a “Report this page” button; pages reported repeatedly are reviewed and removed if they break our terms. You can also email us from the <a href="/contact.html">contact page</a>. If a page about you was created by someone else and you want it removed, contact us the same way.</p>
<h2>7. Children</h2>
<p>WishLink is a general-audience tool. It is not directed at children under 13, and we do not knowingly collect personal information from children under 13. Birthday pages are created by users; if you believe a page contains a child's personal information that should be removed, contact us.</p>
<h2>8. Security</h2>
<p>We use reputable providers and encrypted connections (HTTPS). No system is perfectly secure, so please do not put sensitive personal information (passwords, financial details, ID numbers) inside a page.</p>
<h2>9. Changes</h2>
<p>We may update this policy as the service grows. The “last updated” date above will change, and significant changes will be noted on this page.</p>
<h2>10. Contact</h2>
<p>Questions about privacy: <a href="/contact.html">contact us here</a>.</p>
"""

TERMS = """
<h1>Terms of Use</h1>
<p class="meta">Last updated: 15 November 2026</p>
<p>Welcome to WishLink. By using wishlink.pp.ua (the “Service”), you agree to these terms. If you do not agree, please do not use the Service.</p>
<h2>1. What WishLink is</h2>
<p>WishLink lets you create a small celebratory web page (currently for birthdays), protect it with a PIN, and share it by link or as a downloaded file. The Service is provided free of charge and “as is”.</p>
<h2>2. Your content</h2>
<p>You are responsible for the words and photos you put into a page. Only add content you have the right to use and share. Do not create pages that are abusive, harassing, deceptive, unlawful, or that infringe someone else's rights, and do not add photos of other people in a way that violates their privacy. We may remove pages that break these rules, without notice.</p>
<h2>3. PINs and links</h2>
<p>A page can be opened by anyone who has both its link and its PIN. Keep them as private as you want the page to be. We are not responsible for pages shared more widely than you intended.</p>
<h2>4. Acceptable use</h2>
<ul>
<li>Do not use the Service for spam, phishing, malware or fraud.</li>
<li>Do not attempt to access pages, data or systems you are not authorised to access, or to disrupt the Service.</li>
<li>Do not scrape or overload the Service with automated requests beyond normal use.</li>
</ul>
<h2>5. Intellectual property</h2>
<p>The WishLink name, design and software belong to WishLink. The words and photos you add to a page remain yours; you give us the permission needed to store and display them so your link works. You can delete your page and its photos at any time with your edit token on the <a href="/delete.html">Delete a page</a> page.</p>
<h2>6. Availability and changes</h2>
<p>We work hard to keep WishLink available, but we do not guarantee uninterrupted service. Features may change, and pages for occasions beyond birthdays are being added over time.</p>
<h2>7. Liability</h2>
<p>To the maximum extent allowed by law, the Service is provided without warranties of any kind, and WishLink is not liable for indirect or consequential losses arising from use of the Service.</p>
<h2>8. Contact</h2>
<p>Questions about these terms: <a href="/contact.html">contact us</a>.</p>
"""

DELETE_BODY = """
<h1>Delete a page</h1>
<p class="lede">Created a page and want it gone? You can delete it yourself — no need to contact us.</p>
<p>You need two things: the <b>page link</b> and the <b>edit token</b> you were given when the page was created (it is also kept on the device that created the page). Deleting removes the page and its photos permanently.</p>
<label style="display:block;font-weight:700;margin-top:16px">Page link</label>
<input id="dLink" type="text" placeholder="https://www.wishlink.pp.ua/name-…" style="width:100%;padding:12px;border:1.5px solid var(--line);border-radius:12px;font-size:15px;margin-top:6px">
<label style="display:block;font-weight:700;margin-top:14px">Edit token</label>
<input id="dToken" type="text" placeholder="Your private edit token" style="width:100%;padding:12px;border:1.5px solid var(--line);border-radius:12px;font-size:15px;margin-top:6px">
<button id="dBtn" class="cta" style="border:none;cursor:pointer;font-family:inherit;font-size:15.5px">🗑 Delete this page</button>
<p id="dMsg" style="font-weight:700;margin-top:12px"></p>
<p style="color:var(--mut);font-size:13.5px">Lost your token? <a href="/contact.html">Contact us</a> with the page link and we will help. Pages made before edit tokens existed can also be removed by contacting us.</p>
<script>
document.getElementById("dBtn").addEventListener("click", function(){
  var link = document.getElementById("dLink").value.trim();
  var token = document.getElementById("dToken").value.trim();
  var msg = document.getElementById("dMsg");
  var m = link.match(/wishlink\.pp\.ua\/([a-zA-Z0-9][a-zA-Z0-9\-]{2,48})/) || link.match(/^([a-zA-Z0-9][a-zA-Z0-9\-]{2,48});
  if(!m){ msg.style.color = "#c0392b"; msg.textContent = "That does not look like a WishLink page link."; return; }
  if(!token){ msg.style.color = "#c0392b"; msg.textContent = "Please paste the edit token."; return; }
  msg.style.color = "#173a34"; msg.textContent = "Deleting…";
  fetch("/api/delete", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ slug: m[1], token: token }) })
    .then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
    .then(function(x){
      if(x.ok){ msg.style.color = "#1e8e5a"; msg.textContent = "✓ Page deleted. The link will no longer open."; }
      else { msg.style.color = "#c0392b"; msg.textContent = "Could not delete: " + (x.j.error || "unknown error"); }
    })
    .catch(function(){ msg.style.color = "#c0392b"; msg.textContent = "Something went wrong — please try again."; });
});
</script>
"""

CONTACT = """
<h1>Contact us</h1>
<p class="lede">We are a small studio and we read every message ourselves.</p>
<h2>Email</h2>
<p>The fastest way to reach us is email:</p>
<div class="wishbox">📧 <b>hello@wishlink.pp.ua</b></div>
<h2>Send us a message</h2>
<p>Fill this in and press send — it opens your email app with the message ready to go:</p>
<label style="display:block;font-weight:700;margin-top:12px">Your name</label>
<input id="cName" type="text" style="width:100%;padding:12px;border:1.5px solid var(--line);border-radius:12px;font-size:15px;margin-top:6px">
<label style="display:block;font-weight:700;margin-top:12px">Your message</label>
<textarea id="cMsg" rows="4" style="width:100%;padding:12px;border:1.5px solid var(--line);border-radius:12px;font-size:15px;margin-top:6px"></textarea>
<button id="cBtn" class="cta" style="border:none;cursor:pointer;font-family:inherit;font-size:15.5px">✉️ Send message</button>
<script>
document.getElementById("cBtn").addEventListener("click", function(){
  var n = document.getElementById("cName").value.trim();
  var m = document.getElementById("cMsg").value.trim();
  var body = (n ? "From: " + n + "\n\n" : "") + m;
  location.href = "mailto:hello@wishlink.pp.ua?subject=" + encodeURIComponent("WishLink contact") + "&body=" + encodeURIComponent(body);
});
</script>
<h2>What to write about</h2>
<ul>
<li><b>Help with a page</b> — tell us what went wrong and, if you can, the page link.</li>
<li><b>Remove a page</b> — send the page link. If the page is about you and you did not create it, say so and we will remove it.</li>
<li><b>Ideas &amp; requests</b> — a design you wish existed, an occasion we should add (anniversary? wedding?) — we love these.</li>
<li><b>Business</b> — partnerships, advertising and everything else.</li>
</ul>
<h2>Response time</h2>
<p>We usually reply within 1–3 days. For quick questions, the <a href="/">homepage FAQ</a> may already have your answer — how pages work, PINs, photos and more.</p>
<a class="cta" href="/">✨ Back to the maker</a>
"""

POST1 = """
<p class="meta">WishLink Guide · 15 November 2026</p>
<h1>How to Make a Birthday Surprise Page Online (Free, in 2 Minutes)</h1>
<p class="lede">A chat message takes ten seconds — and is forgotten by lunch. A surprise page takes two minutes and gets remembered all year. Here is exactly how to make one.</p>
<h2>What you need</h2>
<p>Just a phone and a browser. No app, no account, no payment. You will write four small things: their name, your name, a birthday wish and a short letter. If words do not come easily, WishLink has 85+ ready wishes and letters built in — pick one and tweak a line or two so it sounds like you.</p>
<h2>Step 1 — Pick a design first</h2>
<p>Design sets the mood before a single word is read. WishLink has <b>15 designs</b>, and each one changes everything: the colours, the PIN screen, even the loading animation. Elegant and grown-up? Rose Royal or Emerald Royal. Fun and loud? Candy Pop. Soft and dreamy? Pastel Sky or Lavender Dream. Choose for <i>them</i>, not for you.</p>
<h2>Step 2 — Set a secret PIN</h2>
<p>The PIN is the little lock on the gift box. Use something only the two of you would guess — a shared joke, the year you met, their nickname in numbers. You will send the PIN with the link (“PIN: 1432 😉”), and that tiny moment of unlocking is what makes it feel like a present instead of a post.</p>
<h2>Step 3 — Write the wish (or steal one of ours)</h2>
<p>The wish is the headline of the page. Short and true beats long and flowery. “Another year of you — and the world is better for it” will land harder than three paragraphs of poetry that does not sound like you. Need inspiration? We collected <a href="/blog-birthday-wishes-for-best-friend.html">25 wishes for a best friend</a> you can copy.</p>
<h2>Step 4 — Add photos</h2>
<p>Up to 4 photos, shown as an auto-sliding gallery on the page. Pick moments, not portraits: the laughing one, the trip one, the terrible-haircut one. Photos are resized in your browser and saved inside the page. More tips in our <a href="/blog-add-photos-to-birthday-page.html">photo guide</a>.</p>
<h2>Step 5 — Hide something in the gift box</h2>
<p>Every page has a gift box that reveals one hidden line when tapped. Make it count: a promise, an inside joke, or the announcement of the real gift (“check your door at 6pm 👀”).</p>
<h2>Step 6 — Send one link</h2>
<p>Tap create and you get a short link with their name in it. Send it on WhatsApp a minute before midnight, first thing in the morning, or whenever the moment is right. Prefer a file? You can also download the page and send it as a document.</p>
<p>That is the whole recipe: design, PIN, wish, letter, photos, gift, link. Two minutes of effort, a whole day of them smiling at their phone.</p>
<a class="cta" href="/">✨ Make your page now</a>
"""

POST2 = """
<p class="meta">Wishes &amp; Words · 15 November 2026</p>
<h1>25 Heartfelt Birthday Wishes for Your Best Friend</h1>
<p class="lede">For the person who knows all your stories — and is in half of them. Copy any of these straight into your <a href="/">surprise page</a>, or mix two together.</p>
<h2>Sweet &amp; heartfelt</h2>
<div class="wishbox">1. Another year of you — and the world is better for it. Happy Birthday!</div>
<div class="wishbox">2. To the one who makes ordinary days feel like a celebration — happiest of birthdays.</div>
<div class="wishbox">3. Some people make the world softer just by being in it. You are one of them.</div>
<div class="wishbox">4. May this year give you back a fraction of the kindness you give everyone else.</div>
<div class="wishbox">5. Happy Birthday to my favourite chapter in every story.</div>
<h2>Short &amp; sweet</h2>
<div class="wishbox">6. Older? Yes. Wiser? Debatable. Loved? Completely.</div>
<div class="wishbox">7. You were born, and the group chat has never been the same. 🎉</div>
<div class="wishbox">8. Cake today, dreams all year. Happy Birthday!</div>
<div class="wishbox">9. Same time next year? I will bring the candles, you bring the wishes.</div>
<div class="wishbox">10. HBD to the human version of a Friday evening.</div>
<h2>Funny</h2>
<div class="wishbox">11. Congratulations on being one year closer to becoming the eccentric old person we always knew you would be.</div>
<div class="wishbox">12. I got you the best gift: my presence. You are welcome. 🎁</div>
<div class="wishbox">13. Age is just a number — in your case, a surprisingly large one.</div>
<div class="wishbox">14. Happy Birthday! Do not worry about getting older. I will always be younger than you.</div>
<div class="wishbox">15. You do not look a day over fabulous.</div>
<h2>For a long-distance bestie</h2>
<div class="wishbox">16. Miles apart, same team. Happy Birthday — I am celebrating you from here.</div>
<div class="wishbox">17. If I could, I would deliver this wish in person with cake. Until then, this page is me knocking on your screen.</div>
<div class="wishbox">18. Distance test: failed to keep us apart for another whole year. Happy Birthday!</div>
<div class="wishbox">19. Somewhere between your timezone and mine, it is always your birthday. Enjoy both.</div>
<div class="wishbox">20. Sending you a hug in link form. Open carefully — it is a big one.</div>
<h2>Make-it-count wishes</h2>
<div class="wishbox">21. May every dream you are quietly working on find its way to you this year.</div>
<div class="wishbox">22. This is your year. I have seen how hard you work when nobody is watching.</div>
<div class="wishbox">23. New year, new orbit. Fly higher than every wish you whispered last year.</div>
<div class="wishbox">24. Whatever this year brings, you will not face any of it alone. That is a promise, not a wish.</div>
<div class="wishbox">25. Happy Birthday. Thank you for being exactly who you are — please do not change a thing.</div>
<h2>One last tip</h2>
<p>The best wish is the one that could only be for them. Take any wish above and add one specific line — a memory, a nickname, a plan. Thirty seconds of editing turns a good wish into <i>their</i> wish. Then hide it behind a PIN in a <a href="/">surprise page</a> and watch it land.</p>
<a class="cta" href="/">✨ Put a wish in a page</a>
"""

POST3 = """
<p class="meta">Wishes &amp; Words · 15 November 2026</p>
<h1>Birthday Letter Ideas: What to Write in a Birthday Letter</h1>
<p class="lede">The wish is the headline — the letter is the part they re-read at 2am. Here is a simple structure that works for anyone, plus three ready examples.</p>
<h2>The 4-part structure that never fails</h2>
<ol>
<li><b>Open with today.</b> “Happy Birthday! Today is all about you, so let me say the things I never say out loud…”</li>
<li><b>One specific memory.</b> Not “you are a great friend” — the night, the trip, the joke. Specific is what makes people cry (the good kind).</li>
<li><b>What they mean to you.</b> One or two honest sentences. Keep it plain; plain is powerful.</li>
<li><b>A wish for their year.</b> Health, courage, the thing they are working toward. End with your name — a letter needs a signature.</li>
</ol>
<h2>Example 1 — Sweet &amp; simple</h2>
<div class="wishbox">Dear Sam,<br><br>Happy Birthday! I will keep this short and sweet: thank you for being exactly who you are. Your laugh has rescued more of my bad days than you will ever know.<br><br>May this year bring you good health, true happiness, and everything you wished for when the candles went out.<br><br>— Alex</div>
<h2>Example 2 — For a best friend</h2>
<div class="wishbox">Happy Birthday, partner in crime.<br><br>Another year of us: the plans that failed, the food that did not, and the 3am conversations that fixed everything. I do not say it enough — life is measurably better with you in it.<br><br>This year, I hope you get everything you have been quietly working for. I will be in the front row, embarrassing you with applause.<br><br>— Your favourite person (obviously)</div>
<h2>Example 3 — Short &amp; loving</h2>
<div class="wishbox">Dear Ammi,<br><br>Happy Birthday. Everything good in me started with you. I pray this year returns to you a little of the comfort you have given everyone else your whole life.<br><br>With all my love.</div>
<h2>Three mistakes to avoid</h2>
<ul>
<li><b>Copying a poem that does not sound like you.</b> They can tell. Simple and true wins.</li>
<li><b>Only jokes.</b> One laugh is great; a letter that is all jokes says nothing. Add one honest line.</li>
<li><b>Writing a novel.</b> 120–200 words is the sweet spot on a phone screen.</li>
</ul>
<p>Every WishLink page has a letter section with ready-made letters you can use and edit — pick the closest one, swap in your memory, sign your name. Done in a minute, remembered for a year.</p>
<a class="cta" href="/">💌 Write a letter in a page</a>
"""

POST4 = """
<p class="meta">Ideas · 15 November 2026</p>
<h1>10 Creative Ways to Surprise Someone on Their Birthday Online</h1>
<p class="lede">You cannot always be in the room. You can always be in the moment. Ten ways to make a birthday feel personal from any distance.</p>
<h2>1. The midnight link</h2>
<p>Make a <a href="/">surprise page</a>, and send the link at 11:59pm with the PIN as the only message: “1234 🔒”. They unlock it as the clock strikes twelve. First wish of the day: yours.</p>
<h2>2. The photo countdown</h2>
<p>Send one photo an hour — a memory each time — and the final message is the link to a page where all the photos live in a sliding gallery.</p>
<h2>3. The group letter</h2>
<p>Collect one line from every friend, then paste them into one letter on a single page. One link, everyone's love, zero chaotic group-call scheduling.</p>
<h2>4. The treasure hunt</h2>
<p>Hide the PIN somewhere they must find it: the last message of your chat history, a note in a shared photo album, the answer to a riddle. The unlocking becomes part of the gift.</p>
<h2>5. The fake-out</h2>
<p>Send a boring “hbd 👍” in the morning. Let them think that was it. Send the real surprise at dinner time. Contrast is a gift multiplier.</p>
<h2>6. The voice wish</h2>
<p>WishLink pages speak the birthday wish out loud in their name. For long-distance families, hearing “Happy Birthday, Ammi!” from a little page on their phone is unexpectedly moving.</p>
<h2>7. The cake they can blow</h2>
<p>A digital cake with candles they actually blow out (well — tap, and watch them go out) and cut. Silly? Yes. The screenshot they send you back says it worked.</p>
<h2>8. The gift-box announcement</h2>
<p>Hide the real plan inside the page's gift box: “A real gift is on its way”, “Check the porch at 6”, “Flight booked — pack a bag 🎒”. The page becomes the wrapping paper for the real surprise.</p>
<h2>9. The throwback page</h2>
<p>Use the photo gallery for old pictures only — school days, first jobs, questionable hairstyles. Nostalgia is the strongest birthday emotion there is.</p>
<h2>10. The yearly tradition</h2>
<p>Make a page every year, same design, new photos. By year three it is not a link any more — it is a ritual, and rituals are what people actually remember.</p>
<p>Every idea above starts the same way: two minutes, one form, one link.</p>
<a class="cta" href="/">🎉 Start a surprise</a>
"""

POST5 = """
<p class="meta">Guides · 15 November 2026</p>
<h1>What Is a Digital Birthday Card? (And Why Everyone Is Sending Them)</h1>
<p class="lede">Paper cards are lovely — and increasingly rare. Their digital grandchildren have taken over: interactive, personal, and delivered in one tap. Here is the honest comparison.</p>
<h2>From paper to post to… page</h2>
<p>Birthday greetings have moved three times: from paper cards, to wall posts and chat messages, to something new — a <b>dedicated page</b> made for one person. A chat message sits in a thread and scrolls away. A page is a place: it has their name on the door, a lock only they can open, and a whole little celebration inside.</p>
<h2>What a digital birthday page can do that a card cannot</h2>
<ul>
<li><b>Lock with a PIN</b> — a tiny ritual that makes opening it feel like unwrapping.</li>
<li><b>Play music and speak</b> — the birthday tune, and their name said out loud.</li>
<li><b>Show your photos</b> — sliding by like a little film of your favourite moments.</li>
<li><b>Be interactive</b> — candles to blow out, a cake to cut, a gift box hiding your real message.</li>
<li><b>Arrive anywhere, instantly</b> — one link on WhatsApp, no postage, no “the card is still in the mail”.</li>
</ul>
<h2>Digital vs paper: the honest table</h2>
<ul>
<li><b>Speed:</b> paper takes days; a page takes two minutes to make and one second to arrive.</li>
<li><b>Distance:</b> paper struggles across borders; a link does not know what a border is.</li>
<li><b>Personalisation:</b> paper gives you a blank inside cover; a page gives you photos, music, a letter and a hidden gift.</li>
<li><b>Keepsake:</b> paper wins on the shelf — but a link can be re-opened on every phone they ever own, and the page can also be downloaded as a file to keep.</li>
<li><b>Cost:</b> a good paper card plus postage costs more than zero. A WishLink page is free.</li>
</ul>
<h2>When paper is still better</h2>
<p>For a grandparent who treasures the mantelpiece row of cards, or a milestone birthday where the card itself is the keepsake — send paper, proudly. For everyone else, and especially for the people far away, the page wins on impact per minute spent.</p>
<p>The real answer most people land on: send the page at midnight, and if there is a paper card, let it arrive as the sequel.</p>
<a class="cta" href="/">🎂 Try a digital page</a>
"""

POST6 = """
<p class="meta">WishLink Guide · 15 November 2026</p>
<h1>How to Add Photos to a Birthday Page (and Choose Ones That Land)</h1>
<p class="lede">Words tell them you remembered. Photos prove it. Here is how photos work on a WishLink page, and how to pick four that do the heavy lifting.</p>
<h2>How it works</h2>
<p>In the maker, tap “Add photos” and choose up to 4 pictures. They are resized right in your browser — no uploads to social media, nothing public — and saved inside your page. When the birthday person opens it, the photos appear as a <b>gallery that slides on its own</b> every few seconds, with a gentle zoom as each one shows. They can also swipe through at their own pace, or tap the arrows.</p>
<h2>The 4-photo formula</h2>
<ol>
<li><b>The classic</b> — the two of you (or them) smiling, the “us” photo. Opens the show.</li>
<li><b>The laugh</b> — mid-laugh, unposed, slightly imperfect. This is the one they will screenshot.</li>
<li><b>The throwback</b> — the oldest one you have. Nostalgia is rocket fuel.</li>
<li><b>The recent one</b> — from this year, to land the story in the present: “and here we still are.”</li>
</ol>
<h2>Practical tips</h2>
<ul>
<li><b>Faces over places.</b> A famous landmark is nice; their face in front of it is the photo.</li>
<li><b>Bright beats dark.</b> Phone screens forgive a lot, but a bright photo always wins.</li>
<li><b>One person per story.</b> Group photos are great, but make sure they are findable in the frame.</li>
<li><b>Mind the crop.</b> The gallery shows photos in a wide frame — landscape photos fill it best; portraits still work, centred on the face.</li>
<li><b>Permission.</b> Only add photos you have the right to share, of people who would be happy to see them there.</li>
</ul>
<h2>No photos? No problem</h2>
<p>A page without photos still carries the full celebration — design, music, cake, gift and letter. Photos are the amplifier, not the message. But if you have even one good picture of them, add it: it is the difference between a lovely page and <i>their</i> page.</p>
<a class="cta" href="/">📸 Make a page with photos</a>
"""

POSTS = [
  ("blog-how-to-make-a-birthday-surprise-page.html", "How to Make a Birthday Surprise Page Online (Free) — WishLink Blog",
   "A step-by-step guide to creating a birthday surprise page: pick a design, set a PIN, write the wish, add photos and send one link.",
   "/blog-how-to-make-a-birthday-surprise-page.html", POST1),
  ("blog-birthday-wishes-for-best-friend.html", "25 Heartfelt Birthday Wishes for Your Best Friend — WishLink Blog",
   "25 copy-ready birthday wishes for your best friend: heartfelt, short, funny and long-distance — plus how to make any wish personal.",
   "/blog-birthday-wishes-for-best-friend.html", POST2),
  ("blog-birthday-letter-ideas.html", "Birthday Letter Ideas: What to Write in a Birthday Letter — WishLink Blog",
   "A simple 4-part structure for a birthday letter that lands, three ready examples, and the three mistakes to avoid.",
   "/blog-birthday-letter-ideas.html", POST3),
  ("blog-creative-online-birthday-surprises.html", "10 Creative Ways to Surprise Someone on Their Birthday Online — WishLink Blog",
   "Ten creative online birthday surprise ideas: the midnight link, photo countdown, group letter, PIN treasure hunt and more.",
   "/blog-creative-online-birthday-surprises.html", POST4),
  ("blog-what-is-a-digital-birthday-card.html", "What Is a Digital Birthday Card? — WishLink Blog",
   "What a digital birthday card (surprise page) is, what it can do that paper cannot, and an honest digital-vs-paper comparison.",
   "/blog-what-is-a-digital-birthday-card.html", POST5),
  ("blog-add-photos-to-birthday-page.html", "How to Add Photos to a Birthday Page — WishLink Blog",
   "How the auto-sliding photo gallery works on a birthday page, the 4-photo formula, and practical tips for choosing pictures.",
   "/blog-add-photos-to-birthday-page.html", POST6),
]

BLOG_INDEX_BODY = """
<h1>The WishLink Blog</h1>
<p class="lede">Guides, wishes and ideas for making birthdays unforgettable — especially from far away.</p>
<div class="postcards">
  <a class="postcard" href="/blog-how-to-make-a-birthday-surprise-page.html"><span class="pi">🎂</span><b>How to Make a Birthday Surprise Page Online (Free, in 2 Minutes)</b><p>Design, PIN, wish, photos, gift, link — the whole recipe, step by step.</p><span class="more">Read →</span></a>
  <a class="postcard" href="/blog-birthday-wishes-for-best-friend.html"><span class="pi">💖</span><b>25 Heartfelt Birthday Wishes for Your Best Friend</b><p>Heartfelt, short, funny and long-distance wishes you can copy today.</p><span class="more">Read →</span></a>
  <a class="postcard" href="/blog-birthday-letter-ideas.html"><span class="pi">💌</span><b>Birthday Letter Ideas: What to Write in a Birthday Letter</b><p>A 4-part structure, three examples, and the mistakes to avoid.</p><span class="more">Read →</span></a>
  <a class="postcard" href="/blog-creative-online-birthday-surprises.html"><span class="pi">🎉</span><b>10 Creative Ways to Surprise Someone on Their Birthday Online</b><p>The midnight link, the PIN treasure hunt, the group letter and more.</p><span class="more">Read →</span></a>
  <a class="postcard" href="/blog-what-is-a-digital-birthday-card.html"><span class="pi">💻</span><b>What Is a Digital Birthday Card?</b><p>What digital cards can do that paper cannot — an honest comparison.</p><span class="more">Read →</span></a>
  <a class="postcard" href="/blog-add-photos-to-birthday-page.html"><span class="pi">📸</span><b>How to Add Photos to a Birthday Page</b><p>The 4-photo formula for a gallery that makes them screenshot it.</p><span class="more">Read →</span></a>
</div>
<a class="cta" href="/">✨ Make a birthday page</a>
"""

THEME_INFO = {
    "classic": ("Midnight Gold", "The timeless classic", "9,800+"),
    "pastel": ("Pastel Sky", "Soft & dreamy", "5,200+"),
    "neon": ("Neon Galaxy", "Bold night glow", "5,900+"),
    "rose": ("Rose Royal", "Romantic roses", "6,400+"),
    "ocean": ("Ocean Breeze", "Fresh sea air", "2,900+"),
    "sunset": ("Sunset Peach", "Warm golden hour", "4,100+"),
    "lavender": ("Lavender Dream", "Calm & gentle", "2,600+"),
    "emerald": ("Emerald Royal", "Rich & elegant", "3,800+"),
    "candy": ("Candy Pop", "Sweet & playful", "4,700+"),
    "vintage": ("Vintage Paper", "Old-letter charm", "620+"),
    "noir": ("Cherry Noir", "Dark & dramatic", "1,400+"),
    "mint": ("Sky Mint", "Light & fresh", "1,800+"),
    "royal": ("Royal Purple", "Regal violet", "3,300+"),
    "honey": ("Golden Honey", "Warm & cosy", "2,200+"),
    "snow": ("Snow White", "Pure & minimal", "950+"),
}
PREMIUM_THEMES_PY = {"rose", "emerald", "royal", "noir", "honey"}

OCC_PAGES = [
    ("birthday.html", "birthday", "🎂", "Birthday Designs — 15 Surprise Page Designs",
     "All 15 WishLink birthday designs in one place. Tap any design to start making a birthday surprise page with it — free, with photos, a secret PIN and one simple link.",
     "Every design has its own colours, PIN screen, loading style, music and cake. Most are completely free — the ones marked 👑 PREMIUM unlock forever with credits, and then they are yours in every occasion.",
     ["classic", "pastel", "neon", "rose", "ocean", "sunset", "lavender", "emerald", "candy", "vintage", "noir", "mint", "royal", "honey", "snow"]),
    ("love.html", "love", "❤️", "Love Designs — Surprise Pages for Someone Special",
     "Six designs chosen for love pages: romantic colours, a heartfelt letter and your photos, locked with a secret PIN only the two of you know. Tap a design to start.",
     "Sweet, decent and from the heart — a love page carries your message, your photos, a gift box and a letter, all behind a secret PIN. Designs marked 👑 PREMIUM unlock forever with credits.",
     ["rose", "sunset", "lavender", "noir", "honey", "pastel"]),
    ("friendship.html", "friendship", "👯", "Best Friend Designs — Friendship Surprise Pages",
     "Six bright, playful designs for your partner in crime. Tap any design to start a friendship page with ready-made bestie wishes and letters built in.",
     "For the friend who laughs before the punchline: a page with your photos, a gift box, funny and heartfelt wishes, and a letter — locked with a secret PIN. Designs marked 👑 PREMIUM unlock forever with credits.",
     ["candy", "neon", "sunset", "mint", "pastel", "ocean"]),
    ("new-year.html", "newyear", "🎆", "New Year Designs — Happy New Year 2027 Pages",
     "Six designs for New Year pages: fireworks energy, a live feeling of celebration and hopeful wishes for 2027. Tap a design to start.",
     "Start their year with a bang — a New Year page with your photos, a gift box and a letter full of duas for 2027, locked with a secret PIN. Designs marked 👑 PREMIUM unlock forever with credits.",
     ["neon", "classic", "royal", "snow", "honey", "ocean"]),
    ("anniversary.html", "anniversary", "💍", "Anniversary Designs — Pages for the Happy Couple",
     "Six elegant designs for anniversary pages: the couple's names, their photos and a letter, all behind a secret PIN. Tap a design to start.",
     "Another year of love, still going strong — celebrate it with a page made just for the couple. Designs marked 👑 PREMIUM unlock forever with credits, and then they are yours in every occasion.",
     ["classic", "rose", "royal", "vintage", "honey", "lavender"]),
    ("invitation.html", "invitation", "💌", "Invitation Designs — A Prettier Way to Invite",
     "Six designs for invitation pages: the wording, the date, the venue and a little celebration, all in one link your guests open with a PIN. Tap a design to start.",
     "A prettier way to invite: ready-made invitation wordings (birthday party, get-together and formal) plus a details letter with space for the date, time and venue. Designs marked 👑 PREMIUM unlock forever with credits.",
     ["classic", "emerald", "royal", "vintage", "snow", "mint"]),
]

def occasion_body(occ_id, emoji, title, desc, intro, theme_ids):
    cards = []
    for tid in theme_ids:
        name, tag, used = THEME_INFO[tid]
        pill = '<span class="pill2">👑 PREMIUM</span>' if tid in PREMIUM_THEMES_PY else ''
        cards.append(
            '<a class="postcard" href="/?occ=%s&design=%s#maker">%s<img class="dimg" src="/thumbs/%s.jpg" alt="%s design preview" loading="lazy"><b>%s</b><p>%s</p><span class="more">👥 %s pages made · Start with this design →</span></a>'
            % (occ_id, tid, pill, tid, name, name, tag, used))
    return """
<style>
.dimg{width:100%%;border-radius:12px;display:block;margin-bottom:6px}
.pill2{display:inline-block;background:linear-gradient(120deg,#b8860b,#E8A62E);color:#fff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:999px;letter-spacing:.4px;margin-bottom:8px}
</style>
<h1>%s %s</h1>
<p class="lede">%s</p>
<p>%s</p>
<div class="postcards">%s</div>
<h2>How it works</h2>
<ol>
<li><b>Tap a design</b> — the maker opens with that design and this occasion already chosen.</li>
<li><b>Add the names</b> — the wish, letter and PIN are filled in for you; edit anything you like, and add up to 4 photos.</li>
<li><b>Share one link</b> — send it on WhatsApp. They type the secret PIN and the celebration begins.</li>
</ol>
<p>👑 <b>Premium designs</b> unlock once for 50 credits and stay yours forever, in every occasion. Earn credits free by watching ads in our Telegram Mini App, or top up in the <a href="/studio.html">Photo Studio</a>.</p>
""" % (emoji, title, desc, intro, "".join(cards))

CUSTOM_BODY = """
<h1>✨ Custom Design — Made To Order</h1>
<p class="lede">Want a page that is truly one of a kind? Tell us the occasion, the person and the feeling — and we will design a custom surprise page just for you.</p>
<p>A custom design can carry your own colours, your own style of celebration and wording written for your person alone. It is made by a human-guided design process (with a little help from Laila, our AI artist), not picked from a list.</p>
<h2>How to order</h2>
<ol>
<li><b>Message us on WhatsApp</b> with the occasion, their name, and anything you dream of — colours, theme, photos, a special line.</li>
<li><b>We confirm the price and time</b> before starting — no surprises, no obligation.</li>
<li><b>You receive your page link + PIN</b>, ready to share, with revisions until it feels right.</li>
</ol>
<p><a href="https://wa.me/923338739929?text=Assalamu%20Alaikum!%20I%20want%20a%20CUSTOM%20design%20page%20on%20WishLink." target="_blank" rel="noopener" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;padding:13px 22px;border-radius:12px;text-decoration:none">💬 Order a Custom Design on WhatsApp</a></p>
<p>Prefer to make it yourself right now? The <a href="/">free maker</a> has designs for birthday, love, friendship, New Year, anniversary and invitations.</p>
"""

def write_all(base="."):
    files = {
        "about.html": shell("About WishLink — Surprise Pages & Invitations", "What WishLink is, how birthday surprise pages work, what they cost, and who makes them.", "/about.html", ABOUT),
        "privacy.html": shell("Privacy Policy — WishLink", "How WishLink handles your information: page content, photos, cookies, advertising and your choices.", "/privacy.html", PRIVACY),
        "terms.html": shell("Terms of Use — WishLink", "The terms for using WishLink: your content, PINs and links, acceptable use and availability.", "/terms.html", TERMS),
        "contact.html": shell("Contact — WishLink", "Contact WishLink (MintNest Studio): help with a page, page removal, ideas and business enquiries.", "/contact.html", CONTACT),
        "delete.html": shell("Delete a Page — WishLink", "Delete a WishLink birthday page yourself with your edit token.", "/delete.html", DELETE_BODY).replace('<link rel="canonical"', '<meta name="robots" content="noindex"><link rel="canonical"'),
        "blog.html": shell("Blog — WishLink | Birthday Guides, Wishes & Ideas", "Birthday guides, wishes and surprise ideas from the WishLink blog.", "/blog.html", BLOG_INDEX_BODY),
        "custom-design.html": shell("Custom Design — WishLink | A Surprise Page Made To Order", "Order a one-of-a-kind custom surprise page design on WishLink — your occasion, your colours, your words. Order on WhatsApp.", "/custom-design.html", CUSTOM_BODY),
    }
    for fname, occ_id, emoji, title, desc, intro, theme_ids in OCC_PAGES:
        files[fname] = shell(title + " | WishLink", desc, "/" + fname, occasion_body(occ_id, emoji, title, desc, intro, theme_ids))
    for fname, title, desc, path, body in POSTS:
        files[fname] = shell(title, desc, path, body)
    urls = ["/", "/studio.html", "/blog.html", "/about.html", "/privacy.html", "/terms.html", "/contact.html", "/custom-design.html"] + ["/" + p[0] for p in OCC_PAGES] + [p[3] for p in POSTS]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append("<url><loc>https://www.wishlink.pp.ua%s</loc></url>" % u)
    sm.append("</urlset>")
    files["sitemap.xml"] = "\n".join(sm) + "\n"
    files["robots.txt"] = "User-agent: *\nAllow: /\nDisallow: /*-surprise-\nSitemap: https://www.wishlink.pp.ua/sitemap.xml\n"
    for name, content in files.items():
        io.open(os.path.join(base, name), "w", encoding="utf-8").write(content)
    return sorted(files.keys())

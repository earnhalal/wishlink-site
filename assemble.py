#!/usr/bin/env python3
# Assemble the WishLink Birthday website (single index.html)
import io

data_js = io.open('extract-data.js', encoding='utf-8').read()
build_js = io.open('extract-build.js', encoding='utf-8').read()
themes_js = io.open('extract-themes.js', encoding='utf-8').read()
dl_js = io.open('extract-dl.js', encoding='utf-8').read()
occ_js = io.open('extract-occasions.js', encoding='utf-8').read()

head = r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WishLink — Free Surprise Page Maker: Birthday, Love, Friendship, Anniversary & More (15 Designs, PIN Lock)</title>
<meta name="description" content="Create a beautiful surprise page in 2 minutes — free. Birthday, love, friendship, New Year, anniversary and invitation pages: choose a design, add photos, lock it with a secret PIN and share one simple link on WhatsApp.">
<link rel="canonical" href="https://www.wishlink.pp.ua/">
<meta name="monetag" content="bf6b55bf853f780ff9cce7bd26add33e">
<script>
/* Monetag ads (Vignette + In-Page Push) — CREATOR pages only.
   Surprise pages NEVER get ads: a slug link or a #p= hash link skips this completely. */
(function(){
  var surprise = /^\/[a-zA-Z0-9][a-zA-Z0-9\-]{2,48}$/.test(location.pathname) || /#p=[A-Za-z0-9\-_]+/.test(location.hash);
  if (surprise) return;
  (function(s){s.dataset.zone='12272506',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
  (function(s){s.dataset.zone='12272509',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
})();
</script>
<script>
/* WishLink analytics — our own counting system (visits + live visitors), stored on our own Firebase. No external service, no ads. */
(function(){
  try {
    var dev = localStorage.getItem('wl_device');
    if (!dev) { dev = 'dev-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); localStorage.setItem('wl_device', dev); }
    var page = (/^\/[a-zA-Z0-9][a-zA-Z0-9\-]{2,48}$/.test(location.pathname) || /#p=[A-Za-z0-9\-_]+/.test(location.hash)) ? 'surprise' : 'home';
    function send(t){ fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device: dev, page: page, type: t, ref: (document.referrer ? document.referrer.split('/')[2] : '') || '' }), keepalive: true }).catch(function(){}); }
    send('visit');
    setInterval(function(){ send('ping'); }, 30000);
  } catch (e) {}
})();
</script>
<meta name="google-site-verification" content="2u3NTcFwqrW1F72_D-L9Iao1uH3AAqlTPEAuZEJ-bzE">
<meta property="og:type" content="website">
<meta property="og:site_name" content="WishLink">
<meta property="og:title" content="WishLink — Free Birthday Surprise Page Maker">
<meta property="og:description" content="15 designs, photo gallery, secret PIN, cake, gift and a letter — one link, one unforgettable birthday surprise.">
<meta property="og:url" content="https://www.wishlink.pp.ua/">
<meta property="og:image" content="https://www.wishlink.pp.ua/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="WishLink — Free Birthday Surprise Page Maker">
<meta name="twitter:description" content="15 designs, photo gallery, secret PIN, cake, gift and a letter — one link, one unforgettable birthday surprise.">
<meta name="twitter:image" content="https://www.wishlink.pp.ua/og.png">
<meta name="theme-color" content="#FFFBF7">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/fonts/fonts.css">
<style>

:root{--teal:#AD2E5D;--teal-d:#7E1F45;--bg:#FFFBF7;--ink:#571F30;--mut:#886A75;--card:#ffffff;--line:#F3D9E2;--gold:#E8A62E;--coral:#E0608E;--tint:#FFF0F5;--ok:#1E8E5A;--err:#C0392B}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink);line-height:1.5;font-size:16px}
h1,h2,h3,.brand,.feature b,.step b{font-family:'Newsreader',Georgia,'Times New Roman',serif}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
a{color:var(--teal-d)}
header.top{display:flex;align-items:center;gap:10px;padding:14px 20px;max-width:1060px;margin:0 auto}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:800;font-size:22px}
.logo .mark{width:38px;height:38px;border-radius:11px;background:var(--teal);display:flex;align-items:center;justify-content:center}
.logo em{font-style:normal;color:var(--teal)}
.logo .tag{display:block;font-size:11px;font-weight:600;color:var(--mut);letter-spacing:.4px}
.demo-btn{display:inline-block;background:var(--teal);color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:8px 15px;border-radius:999px;box-shadow:0 4px 12px rgba(173,46,93,.28)}
.demo-btn:hover{background:var(--teal-d)}
.hero{text-align:center;padding:34px 18px 8px;max-width:760px;margin:0 auto}
.hero h1{font-size:clamp(28px,5.4vw,44px);line-height:1.15;font-weight:900}
.hero h1 span{color:var(--teal)}
.hero p{color:var(--mut);font-size:clamp(15px,2.6vw,18px);margin-top:12px}
.hero .free{display:inline-block;margin-top:16px;background:var(--tint);color:var(--teal-d);font-weight:700;font-size:13px;padding:6px 14px;border-radius:999px}
.wrap{max-width:1060px;margin:0 auto;padding:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:0 10px 30px rgba(173,46,93,.10)}
.card h2{font-size:21px;margin-bottom:4px}
.card .sub{color:var(--mut);font-size:14px;margin-bottom:16px}
label{display:block;font-weight:700;font-size:14px;margin:14px 0 6px}
label small{font-weight:500;color:var(--mut)}
input[type=text],select,textarea{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;background:#fff;color:var(--ink)}
textarea{min-height:96px;resize:vertical}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--teal)}
.genrow{display:flex;gap:8px}
.genrow select{flex:1}
.genbtn{white-space:nowrap;border:1.5px solid var(--teal);color:var(--teal-d);background:var(--tint);font-weight:700;border-radius:12px;padding:0 14px;cursor:pointer;font-size:14px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;font-weight:800;border-radius:999px;padding:14px 22px;font-size:16px;text-decoration:none;width:100%;min-height:52px}
.btn-main{background:linear-gradient(135deg,#F98BB0,#E0608E);color:#fff;margin-top:20px}
.btn-main:hover{background:var(--teal-d)}
.btn-wa{background:#22b358;color:#fff}
.btn-ghost{background:#fff;border:1.5px solid var(--line);color:var(--ink)}
.hidden{display:none!important}
#result{margin-top:22px}
.linkrow{display:flex;gap:8px;margin:10px 0 14px}
.linkrow input{flex:1;font-size:13.5px;background:#FAF8FE}
.copybtn{border:none;background:var(--ink);color:#fff;font-weight:700;border-radius:12px;padding:0 18px;cursor:pointer}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.theme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:9px;margin:6px 0 4px}
.theme-card{border:2px solid var(--line);border-radius:14px;padding:10px 9px;cursor:pointer;background:#fff;text-align:left;font-family:inherit}
.theme-card.sel{border-color:var(--teal);box-shadow:0 0 0 3px rgba(173,46,93,.18)}
.theme-card .dots{display:flex;gap:4px;margin-bottom:6px}
.theme-card .dots i{width:15px;height:15px;border-radius:50%;display:block;border:1px solid rgba(0,0,0,.12)}
.theme-card b{display:block;font-size:12.8px;color:var(--ink);line-height:1.25}
.theme-card span{display:block;font-size:10.8px;color:var(--mut);line-height:1.3;margin-top:2px}
.theme-card .hotb{font-style:normal;background:linear-gradient(120deg,#ff512f,#dd2476);color:#fff;font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:999px;vertical-align:2px;letter-spacing:.3px;white-space:nowrap}
.theme-card .trec{color:#b8860b;font-weight:800}
.theme-card .tused{font-weight:600}
.theme-card .tlock{font-weight:700;color:#b8860b}
.theme-card.locked{border-style:dashed}
.prembar{border:2px solid #E8A62E;background:#FFF8E6;border-radius:14px;padding:14px;margin-top:10px}
.prembar p{margin:0 0 8px;font-size:14px;color:var(--ink)}
.dcard{text-decoration:none;color:inherit}
.dcard .big{font-size:42px;display:block;line-height:1.15}
.dcard .pill.prem{background:linear-gradient(120deg,#b8860b,#E8A62E);color:#fff}
.thumbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.thumb{position:relative;width:64px;height:64px;border-radius:10px;overflow:hidden;border:2px solid #dcebe5}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.thumb button{position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;font-size:12px;cursor:pointer;line-height:1}
@media(max-width:560px){.grid2{grid-template-columns:1fr}}
.pin-note{background:#fff7e6;border:1px solid #ffe1a1;border-radius:12px;padding:10px 14px;font-size:14px;margin-bottom:14px}
#pvFrame{width:100%;height:560px;border:1px solid var(--line);border-radius:16px;margin-top:16px;background:#101013}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
@media(max-width:720px){.steps{grid-template-columns:1fr}}
.step{background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px}
.step b{font-size:15.5px}
.step p{color:var(--mut);font-size:14px;margin-top:4px}
.step .n{width:30px;height:30px;border-radius:50%;background:var(--teal);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
footer{background:#4A1225;text-align:center;color:#A9AAC4;font-size:13.5px;padding:34px 16px 42px;margin-top:44px}
footer b{color:var(--teal-d)}

.brand{font-weight:800;font-size:21px;display:flex;align-items:center;gap:8px}
.brand-emoji{font-size:25px}
.tagline{text-align:center;color:var(--mut);letter-spacing:2.5px;font-size:11px;font-weight:700;margin-top:2px}
.nav{display:flex;gap:20px;align-items:center;margin-left:18px}
.langsel{margin-left:12px;border:1.5px solid #F3D9E2;background:#fff;color:#AD2E5D;font:600 13.5px 'DM Sans',sans-serif;padding:8px 10px;border-radius:999px;cursor:pointer;max-width:150px}
.mypill{margin-left:auto;background:#AD2E5D;color:#fff!important;text-decoration:none;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 16px rgba(173,46,93,.25)}
.mypill:hover{background:#7E1F45}
.nav a{color:var(--ink);text-decoration:none;font-weight:600;font-size:14.5px}
.nav a:hover{color:var(--teal)}
.hero{text-align:center;padding:42px 16px 8px;max-width:760px;margin:0 auto}
.hero h1{font-size:clamp(30px,6vw,46px);line-height:1.15;color:var(--ink)}
.hero h1 em{font-style:normal;color:var(--teal)}
.hero p{color:var(--mut);font-size:17px;margin-top:12px;line-height:1.6}
.hero .cta{display:inline-block;margin-top:20px;background:var(--teal);color:#fff;text-decoration:none;font-weight:700;font-size:16.5px;padding:14px 32px;border-radius:999px;box-shadow:0 10px 24px rgba(173,46,93,.3)}
.hero .trust{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.hero .trust span{background:#fff;border:1.5px solid var(--line);color:var(--ink);font-size:12.5px;font-weight:700;padding:6px 13px;border-radius:999px}
.showcase{max-width:820px;margin:26px auto 0;padding:0 16px}
.showcase h3{text-align:center;font-size:15px;color:var(--mut);letter-spacing:.4px}
.chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px}
.chip{display:flex;align-items:center;gap:7px;background:#fff;border:1.5px solid #dcebe5;border-radius:999px;padding:6px 13px 6px 8px;font-size:12.8px;font-weight:700;color:#33524b}
.chip i{width:13px;height:13px;border-radius:50%;display:block;border:1px solid rgba(0,0,0,.12)}
.features{max-width:900px;margin:34px auto 0;padding:0 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.feature{background:#fff;border:1.5px solid var(--line);border-radius:18px;padding:20px}
.feature .fi{font-size:27px}
.feature b{display:block;margin:8px 0 5px;font-size:15.5px}
.feature p{color:var(--mut);font-size:13.8px;line-height:1.55}
.faq{max-width:760px;margin:36px auto 0;padding:0 16px}
.faq h2,.blogteaser h2{text-align:center;font-size:24px}
.faq details{background:#fff;border:1.5px solid #e2efe9;border-radius:14px;padding:15px 18px;margin-top:10px}
.faq summary{font-weight:700;cursor:pointer;font-size:15px}
.faq details p{color:var(--mut);font-size:14.3px;line-height:1.6;margin-top:8px}
.blogteaser{max-width:900px;margin:38px auto 0;padding:0 16px}
.postcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:16px}
.postcard{background:#fff;border:1.5px solid #e2efe9;border-radius:18px;padding:20px;text-decoration:none;color:var(--ink);display:block}
.postcard .pi{font-size:30px}
.postcard b{display:block;margin:9px 0 5px;font-size:15.5px;line-height:1.35}
.postcard p{color:var(--mut);font-size:13.5px;line-height:1.55}
.postcard .more{color:var(--teal);font-weight:700;font-size:13px;margin-top:9px;display:block}
.footlinks{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 18px}
.footlinks a{color:#C9CAE0;text-decoration:none;font-size:13.5px;line-height:2}
.footlinks a:hover{color:#E8A62E;text-decoration:underline}
.footcols a:hover{color:var(--teal)}
@media(max-width:640px){.nav{display:none}}
.mprog{margin-bottom:18px}
.mprog span{font-weight:700;font-size:13.5px;color:var(--mut)}
.mbar{height:8px;background:var(--tint);border-radius:99px;margin-top:7px;overflow:hidden}
.mbar i{display:block;height:100%;width:25%;background:var(--teal);border-radius:99px;transition:width .3s}
.mnav{display:flex;gap:10px;margin-top:20px}
.mnav .btn{flex:1}
.ferr{color:var(--err);font-size:13.5px;font-weight:600;margin-top:7px}
.genbtn.wide{width:100%;padding:12px;margin-top:9px}
.styledisc{border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:16px;background:#FBFAFE}
.styledisc summary{font-weight:700;cursor:pointer;font-size:14.5px}
.wachk{display:flex;gap:9px;align-items:center;font-weight:600;font-size:14.5px;margin:12px 0}
.wachk input{width:19px;height:19px;accent-color:var(--teal)}
.dlrow{margin-top:14px;font-size:14px;color:var(--mut)}
.delnote{background:var(--tint);border:1px solid var(--line);border-radius:12px;padding:11px 14px;font-size:13.8px;margin-top:12px;line-height:1.55}
.dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:12px;margin-top:14px}
.dcard{background:#fff;border:1.5px solid var(--line);border-radius:16px;padding:10px;cursor:pointer;text-align:left;font-family:inherit;box-shadow:0 8px 24px rgba(173,46,93,.06)}
.dcard:hover{border-color:var(--teal)}
.dcard img{width:100%;height:104px;object-fit:cover;border-radius:10px;display:block;background:var(--tint)}
.dcard b{display:block;font-size:14px;margin-top:8px;color:var(--ink);font-family:'DM Sans',sans-serif}
.dcard span{display:block;font-size:12px;color:var(--mut);margin-top:1px}
.dcard{position:relative}
.pill{position:absolute;left:16px;z-index:2;font-style:normal;font-size:10.5px;font-weight:800;letter-spacing:.4px;padding:4px 9px;border-radius:999px;color:#fff;box-shadow:0 4px 10px rgba(0,0,0,.25)}
.pill.hot{top:16px;background:linear-gradient(120deg,#ff512f,#dd2476)}
.pill.rec{top:43px;background:linear-gradient(120deg,#f5d67b,#e8b44b);color:#241a08}
.dcard .used{font-size:11.5px;font-weight:600}
.dsec{max-width:1060px;margin:32px auto 0;padding:0 18px}
.dsec h2{text-align:center;font-size:24px}
.dsec .dsub{text-align:center;color:var(--mut);font-size:14.5px;margin-top:5px}
.hero2{max-width:780px;margin:0 auto;padding:54px 18px 8px;text-align:center}
.demolink{margin-top:16px;font-size:14.5px;color:var(--mut)}
.demolink a{color:var(--teal);font-weight:700;text-decoration:none}
.demolink a:hover{text-decoration:underline}
.hero2 h1{font-size:clamp(30px,4.6vw,44px);line-height:1.14}
.hero2 h1 em{font-style:normal;color:var(--teal)}
.hero2 .txt p{color:var(--mut);font-size:16.5px;margin-top:12px;line-height:1.6}
.hero2 .cta{display:inline-block;margin-top:20px;background:linear-gradient(135deg,#F98BB0,#E0608E);color:#fff;text-decoration:none;font-weight:700;font-size:16.5px;padding:15px 32px;border-radius:999px;box-shadow:0 10px 24px rgba(173,46,93,.3)}
.hero2 .trust{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px;justify-content:center}
.hero2 .trust span{background:#fff;border:1.5px solid var(--line);color:var(--ink);font-size:12.5px;font-weight:700;padding:6px 13px;border-radius:999px}
.herodemo{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:26px 10px}
.demo-btn.ghostbig{background:#fff;color:var(--indigo);border:2px solid var(--indigo);font-size:16.5px;padding:13px 30px;min-height:54px;border-radius:999px}
.studiobtn{display:block;text-align:center;margin-top:10px;padding:13px 14px;border:2px dashed #EFC3D4;border-radius:12px;color:var(--indigo);font-weight:700;text-decoration:none;background:#fff}
.studiobtn:hover{border-color:var(--indigo)}
.demo-btn.big{font-size:19px;padding:17px 42px;min-height:62px;border-radius:999px}
.phonecap{text-align:center;color:var(--mut);font-size:13px;margin-top:9px}
@media(max-width:820px){.hero2{padding-top:36px}}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}

.menubtn{display:none;background:#fff;border:1.5px solid #F3D9E2;color:#AD2E5D;font-size:18px;line-height:1;padding:8px 13px;border-radius:999px;cursor:pointer;margin-left:10px}
@media(max-width:860px){.menubtn{display:block}.langsel{margin-left:auto}.nav{display:none!important}.nav.open{display:flex!important;position:absolute;top:60px;right:12px;left:12px;flex-direction:column;align-items:stretch;gap:2px;background:#fff;border:1.5px solid #F3D9E2;border-radius:16px;padding:8px;box-shadow:0 18px 40px rgba(173,46,93,.18);z-index:80;margin-left:0}.nav.open a{padding:12px 14px;border-radius:10px;font-size:15.5px;text-decoration:none}.topin,header.top{position:relative}}
</style>
<script>
/* Viewer mode: a shared link (#p=...) opens the birthday page itself */
(function(){
  var m = location.hash.match(/#p=([A-Za-z0-9\-_]+)/);
  if(!m) return;
  window.__WL_VIEW__ = m[1];
})();
</script>
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

<section class="hero2">
  <div class="txt">
    <h1>A birthday page they will <em>never forget</em> 🎂</h1>
    <p>WishLink turns a name, a wish and a few photos into a magical little web page — locked with a secret PIN, opened with one simple link.</p>
    <a class="cta" href="#maker">✨ Create your free page</a>
    <p class="demolink"><a href="/#p=eyJuIjoiQXllc2hhIiwiZiI6IlRlYW0gV2lzaExpbmsiLCJwIjoiZGVtbyIsIndjIjoiaGVhcnRmZWx0Iiwid2kiOjAsImxpIjowLCJnaSI6MCwiaW0iOlsiaHR0cHM6Ly93d3cud2lzaGxpbmsucHAudWEvZGVtby1hZnRlci5qcGciLCJodHRwczovL3d3dy53aXNobGluay5wcC51YS9kZW1vLWJlZm9yZS5qcGciXX0" target="_blank" rel="noopener">▶ See a live demo first</a> · PIN: <b>demo</b></p>
    <div class="trust"><span>✅ 100% free</span><span>🔒 Secret PIN lock</span><span>🚫 No app. No sign-up.</span></div>
  </div>
</section>



<div class="wrap">
  <div class="steps">
    <div class="step"><div class="n">1</div><b>Fill the little form</b><p>Their name, your name, a wish and a letter — ready-made wishes and letters are built in, edit them any way you like.</p></div>
    <div class="step"><div class="n">2</div><b>Get your link</b><p>One tap creates your page link. Send it on WhatsApp, Messenger — anywhere. Prefer a file? Download the page instead.</p></div>
    <div class="step"><div class="n">3</div><b>They open the surprise</b><p>They type the secret PIN and the celebration begins — confetti, cake, photos, gift and your letter.</p></div>
  </div>

  <div class="card" id="maker">
    <h2 id="makerTitle">🎂 Birthday Surprise Maker</h2>
    <p class="sub" id="makerSub">⏱ Takes about 30 seconds — the wish, letter and PIN are already filled in for you. Just add two names and tap Create.</p>
    <form id="makerForm" autocomplete="off">
      <div class="mprog"><span id="mStepLabel">Step 1 of 2 · Names & design</span><div class="mbar"><i id="mBar"></i></div></div>

      <div class="mstep" data-step="1">
        <label for="fName" id="nameLabel">Birthday person's name</label>
        <input type="text" id="fName" placeholder="e.g. Hamza" maxlength="40">
        <p class="ferr hidden" id="nameErr">Please write their name first — the whole page is built around it.</p>
        <label for="fFrom">Your name <small>(who is this surprise from?)</small></label>
        <input type="text" id="fFrom" placeholder="e.g. Waseem" maxlength="40">
        <label>Choose a design <small id="designNote">(15 designs — Midnight Gold is already picked for you; tap another only if you want)</small></label>
        <div class="theme-grid" id="themeGrid"></div>
        <button type="button" id="themeChange" class="genbtn wide hidden">🎨 Change design</button>
        <div id="premiumBar" class="prembar hidden">
          <p id="premiumText"></p>
          <button type="button" id="btnUnlock" class="genbtn wide">👑 Unlock this design — 50 credits</button>
          <p class="sub" id="premiumBal" style="margin-top:8px"></p>
          <p class="sub">No credits? Get them in the <a href="/studio.html">Photo Studio</a> (top-up) or earn free credits by watching ads in our <a href="https://t.me/WishLinkSurpriseBot" target="_blank" rel="noopener">Telegram app</a>.</p>
        </div>
        <div class="mnav"><button class="btn btn-main" id="btnNext1" type="button">Next: wish, photos &amp; PIN →</button></div>
      </div>

      <div class="mstep hidden" data-step="2">
        <label for="fWish" id="wishLabel">Birthday wish <small>(already filled in for you — shuffle for another, or write your own)</small></label>
        <textarea id="fWish" maxlength="600" placeholder="Your birthday wish will appear here…"></textarea>
        <button class="genbtn wide" id="btnGenWish" type="button">🔀 Shuffle — show me another wish</button>
        <label for="fLetter">Letter <small>(already filled in too — edit it any way you like)</small></label>
        <textarea id="fLetter" maxlength="1800" style="min-height:150px" placeholder="A letter for them will appear here…"></textarea>
        <details class="styledisc">
          <summary id="styleSummary">🎨 Change style — 11 wish styles · 5 letters</summary>
          <label for="fWishCat">Wish style</label>
          <select id="fWishCat">
          <option value="heartfelt">Heartfelt</option>
          <option value="funny">Funny</option>
          <option value="short">Short &amp; Sweet</option>
          <option value="brother">For Brother</option>
          <option value="sister">For Sister</option>
          <option value="friend">For Friend</option>
          <option value="mother">For Mother</option>
          <option value="father">For Father</option>
          <option value="girlfriend">For Girlfriend</option>
          <option value="boyfriend">For Boyfriend</option>
          <option value="bestie">For Bestie</option>
          </select>
          <label for="fLetterSel">Letter style</label>
          <div class="genrow">
            <select id="fLetterSel">
          <option value="0">Heartfelt Long</option>
          <option value="1" selected>Sweet &amp; Simple</option>
          <option value="2">Short &amp; Loving</option>
          <option value="3">Romantic &amp; Sweet</option>
          <option value="4">Bestie Fun</option>
            </select>
            <button class="genbtn" id="btnUseLetter" type="button">💌 Use this letter</button>
          </div>
        </details>
        <label for="fPhotos">Add photos <small>(optional — up to 4; they appear as an auto-sliding gallery on the page)</small></label>
        <input type="file" id="fPhotos" accept="image/*" multiple>
        <div class="thumbs" id="thumbs"></div>
<a class="studiobtn" href="/studio.html">📸 Photo Frame Studio — frame a photo, or get a 🤖 AI Edit by Laila ✨</a>
        <p class="sub" style="margin-top:6px">Photos are resized in your browser and stored securely with your page on our servers.</p>
        <label for="fGift">Gift-box surprise line <small>(revealed when they open the gift on the page)</small></label>
        <select id="fGift">
        <option value="0">A promise — I am in your corner, always</option>
        <option value="1">My time, my prayers &amp; my best advice, on demand</option>
        <option value="2">A hug, a smile — and a real gift on its way</option>
        <option value="3">A wish made just for you</option>
        <option value="custom">Write my own…</option>
        </select>
        <div class="hidden" id="fGiftCustomWrap">
          <label for="fGiftCustom">Your own gift line</label>
          <input type="text" id="fGiftCustom" placeholder="Write the line hidden inside the gift box…" maxlength="300">
        </div>
        <label for="fPin">Secret PIN <small>(4–8 numbers — they type this to open the surprise; we picked one for you, change it if you like)</small></label>
        <div class="genrow">
          <input type="text" id="fPin" inputmode="numeric" autocomplete="off" maxlength="8">
          <button class="genbtn" id="btnPinGen" type="button">🎲 New PIN</button>
        </div>
        <p class="ferr hidden" id="pinErr">The PIN must be 4 to 8 numbers (digits only) — it keeps the page safe.</p>
        <button class="btn btn-ghost" id="btnPreview" type="button" style="margin-top:18px">👁 Preview my page</button>
        <iframe id="pvFrame" class="hidden" title="Page preview"></iframe>
        <div class="mnav"><button class="btn btn-ghost" id="btnBack2" type="button">← Back</button><button class="btn btn-main" id="btnMake" type="button">✨ Create my page</button></div>
      </div>
    </form>

    <div id="result" class="hidden">
      <h2>🎉 Your page is ready!</h2>
      <p class="sub">Send the link to the birthday person — and share the PIN with them too.</p>
      <label>Your share link</label>
      <div class="linkrow">
        <input type="text" id="shareLink" readonly>
        <button class="copybtn" id="btnCopy" type="button">Copy</button>
      </div>
      <label>Secret PIN</label>
      <div class="linkrow">
        <input type="text" id="pinShow" readonly>
        <button class="copybtn" id="btnCopyPin" type="button">Copy PIN</button>
      </div>
      <label class="wachk"><input type="checkbox" id="waPin" checked> Include the PIN in the WhatsApp message</label>
      <a class="btn btn-wa" id="btnWa" href="#" target="_blank" rel="noopener">💬 Share on WhatsApp</a>
      <div class="grid2" style="margin-top:10px">
        <a class="btn btn-ghost" id="btnOpen" href="#" target="_blank" rel="noopener">👀 Open the page</a>
        <button class="btn btn-ghost" id="btnAgain" type="button">↺ Make another</button>
      </div>
      <p class="dlrow"><a href="#" id="btnDl">⬇ Download the page as an HTML file</a> — works offline, send it anywhere.</p>
      <div class="pin-note" id="pinNote"></div>
      <div class="delnote hidden" id="delNote"></div>
    </div>
  </div>

</div>



<section class="dsec">
  <h2>🎉 Pick an occasion — every occasion has its own designs</h2>
  <p class="dsub">Tap an occasion to see its designs and start with one. Birthday alone has 15 designs — and inside every occasion you will find a few 👑 Premium designs, unlockable with credits.</p>
  <div class="dgrid">
    <a class="dcard" href="/birthday.html"><span class="big">🎂</span><b>Birthday</b><span>The original surprise</span><span class="used">🎨 15 designs</span></a>
    <a class="dcard" href="/love.html"><i class="pill prem">👑 Premium inside</i><span class="big">❤️</span><b>Love</b><span>For someone special</span><span class="used">🎨 6 designs</span></a>
    <a class="dcard" href="/friendship.html"><span class="big">👯</span><b>Best Friend</b><span>For your partner in crime</span><span class="used">🎨 6 designs</span></a>
    <a class="dcard" href="/new-year.html"><span class="big">🎆</span><b>New Year</b><span>Start 2027 with a bang</span><span class="used">🎨 6 designs</span></a>
    <a class="dcard" href="/anniversary.html"><i class="pill prem">👑 Premium inside</i><span class="big">💍</span><b>Anniversary</b><span>Another year of love</span><span class="used">🎨 6 designs</span></a>
    <a class="dcard" href="/invitation.html"><i class="pill prem">👑 Premium inside</i><span class="big">💌</span><b>Invitation</b><span>A prettier way to invite</span><span class="used">🎨 6 designs</span></a>
    <a class="dcard" href="/custom-design.html"><span class="big">✨</span><b>Custom Design</b><span>Made to order, just for you</span><span class="used">💬 Order on WhatsApp</span></a>
  </div>
</section>

<section class="features">
  <div class="feature"><div class="fi">🔒</div><b>Secret PIN lock</b><p>Every page opens only with a PIN you choose — like a little locked gift box they unlock on their phone.</p></div>
  <div class="feature"><div class="fi">📸</div><b>Auto-sliding photo gallery</b><p>Add up to 4 photos. On the page they glide by on their own like a slideshow — and a swipe works too.</p></div>
  <div class="feature"><div class="fi">🎂</div><b>Blow &amp; cut the cake</b><p>A cake with real candles to blow out and cut — plus confetti, a hidden gift box and your personal letter.</p></div>
  <div class="feature"><div class="fi">🎵</div><b>Music &amp; a spoken wish</b><p>The birthday tune plays and the page says “Happy Birthday” out loud in their name. A mute button is always there.</p></div>
  <div class="feature"><div class="fi">💌</div><b>Wishes &amp; letters built in</b><p>85+ ready wishes and letters for friends, family and partners — pick one, tweak it, or write your own.</p></div>
  <div class="feature"><div class="fi">🔗</div><b>One short link</b><p>Your page gets a short, friendly link with their name in it — perfect for WhatsApp. Or download the page as a file.</p></div>
</section>

<section class="faq">
  <h2>Frequently asked questions</h2>
  <details><summary>Is WishLink really free?</summary><p>Yes. Creating and sharing birthday pages is completely free, with no sign-up and no app to install. Free pages carry a small “Made with WishLink” line at the bottom.</p></details>
  <details><summary>How does the person open my surprise?</summary><p>You send them one link (WhatsApp works best). The page asks for the secret PIN you chose — tell them the PIN in your message. Once it opens, the celebration starts: music, confetti, cake, your photos, a gift box and your letter.</p></details>
  <details><summary>Can I add our photos?</summary><p>Yes — up to 4 photos. They are resized in your browser and stored securely with your page on our servers, then shown as an auto-sliding gallery the birthday person can also swipe through.</p></details>
  <details><summary>Do I need to install an app or create an account?</summary><p>No. WishLink works entirely in the browser, on any phone or computer. There are no accounts and no passwords to remember — just the PIN on each page.</p></details>
  <details><summary>What occasions does WishLink support?</summary><p>Birthday (15 designs), Love, Best Friend, New Year, Anniversary and Invitation pages are all live — tap an occasion above to see its designs. Most designs are free; a few 👑 Premium designs unlock forever with credits. And if you want something fully personal, order a Custom Design on WhatsApp.</p></details>
</section>

<section class="blogteaser">
  <h2>From the WishLink blog</h2>
  <div class="postcards">
    <a class="postcard" href="/blog-how-to-make-a-birthday-surprise-page.html"><span class="pi">🎂</span><b>How to Make a Birthday Surprise Page Online (Free, in 2 Minutes)</b><p>A step-by-step guide: pick a design, write the wish, add photos, lock it with a PIN and send one link.</p><span class="more">Read the guide →</span></a>
    <a class="postcard" href="/blog-birthday-wishes-for-best-friend.html"><span class="pi">💖</span><b>25 Heartfelt Birthday Wishes for Your Best Friend</b><p>Short, sweet and funny wishes you can copy straight into your surprise page — for every kind of bestie.</p><span class="more">See the wishes →</span></a>
    <a class="postcard" href="/blog-creative-online-birthday-surprises.html"><span class="pi">🎉</span><b>10 Creative Ways to Surprise Someone on Their Birthday Online</b><p>Distance does not have to mean dull. Ten ideas that make a birthday feel personal, even from far away.</p><span class="more">Get inspired →</span></a>
  </div>
</section>

<footer>
  <p style="margin:0 0 6px"><b style="color:#E8A62E;font-family:'Newsreader',serif;font-size:18px">WishLink</b></p>
  <p class="footlinks"><a href="/">Maker</a><a href="/my.html">Track My Pages</a><a href="/studio.html">Photo Studio</a><a href="/blog.html">Blog</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/delete.html">Delete a page</a></p>
  <p style="margin-top:10px">© 2026 WishLink</p>
</footer>
'''

wiring = r'''
<script>
/* ================= WishLink website wiring ================= */
function $(id){ return document.getElementById(id); }
var fName=$("fName"), fFrom=$("fFrom"), fPin=$("fPin"), fWish=$("fWish"), fWishCat=$("fWishCat"),
    fLetter=$("fLetter"), fLetterSel=$("fLetterSel"), fGift=$("fGift"), fGiftCustom=$("fGiftCustom");

function curLib(){ return occLib(typeof WL_OCC !== "undefined" ? WL_OCC : "birthday"); }
function pickWish(){
  var L = curLib();
  var arr = L.wishes[fWishCat.value] || L.wishes[Object.keys(L.wishes)[0]];
  fWish.value = arr[Math.floor(Math.random()*arr.length)];
}
function useLetter(){ var L = curLib(); var Lt = L.letters[parseInt(fLetterSel.value,10)] || L.letters[0]; fLetter.value = (Lt && Lt.body) ? Lt.body : ""; }
$("btnGenWish").addEventListener("click", pickWish);
$("btnUseLetter").addEventListener("click", useLetter);
fGift.addEventListener("change", function(){
  $("fGiftCustomWrap").classList.toggle("hidden", fGift.value !== "custom");
});
pickWish(); useLetter();
if(!fPin.value){ fPin.value = String(Math.floor(1000 + Math.random()*9000)); }

/* ---- design picker ---- */
var WL_THEME = "classic";
var WL_DESIGN = {classic:{u:"9,800+",h:1,r:1},pastel:{u:"5,200+"},neon:{u:"5,900+",h:1},rose:{u:"6,400+",h:1},ocean:{u:"2,900+"},sunset:{u:"4,100+"},lavender:{u:"2,600+"},emerald:{u:"3,800+",h:1},candy:{u:"4,700+"},vintage:{u:"620+"},noir:{u:"1,400+"},mint:{u:"1,800+"},royal:{u:"3,300+"},honey:{u:"2,200+"},snow:{u:"950+"}};
var THEME_META = [{ id:"classic", name:"Midnight Gold", tag:"The original dark & gold", colors:["#14100a","#e8b44b","#f5e9c9"] }]
  .concat(THEME_ORDER.map(function(id){ var th = THEMES[id]; return { id:id, name:th.name, tag:th.tag, colors:[th.acc, th.acc2, th.dark ? "#141428" : "#ffffff"] }; }));
var themeGrid = $("themeGrid");
THEME_META.forEach(function(m){
  var b = document.createElement("button");
  b.type = "button"; b.className = "theme-card" + (m.id === "classic" ? " sel" : "");
  b.setAttribute("data-tid", m.id);
  var dz = WL_DESIGN[m.id] || {};
  b.innerHTML = '<span class="dots">' + m.colors.map(function(c){ return '<i style="background:' + c + '"></i>'; }).join("") + '</span><b>' + m.name + (dz.h ? ' <em class="hotb">🔥 HOT</em>' : '') + '</b>' + (dz.r ? '<span class="trec">★ Recommended</span>' : '') + '<span>' + m.tag + '</span>' + (dz.u ? '<span class="tused">👥 ' + dz.u + ' pages made</span>' : '') + '<span class="tlock"></span>';
  b.addEventListener("click", function(){
    WL_THEME = m.id;
    themeGrid.querySelectorAll(".theme-card").forEach(function(x){ x.classList.remove("sel"); });
    b.classList.add("sel");
    saveDraft();
    updatePremiumBar();
    if(!isLockedPremium()) collapseThemes();
  });
  themeGrid.appendChild(b);
});


/* Once a design is chosen, the picker folds down to just that design —
   the full list comes back with the Change button. */
var themeChange = $("themeChange");
function collapseThemes(){
  themeGrid.querySelectorAll(".theme-card").forEach(function(x){ if(!x.classList.contains("sel")) x.style.display = "none"; });
  if(themeChange) themeChange.classList.remove("hidden");
}
function expandThemes(){
  var O = OCCASIONS[typeof WL_OCC !== "undefined" ? WL_OCC : "birthday"] || OCCASIONS.birthday;
  themeGrid.querySelectorAll(".theme-card").forEach(function(x){ x.style.display = (O.themes.indexOf(x.getAttribute("data-tid")) >= 0) ? "" : "none"; });
  if(themeChange) themeChange.classList.add("hidden");
}
if(themeChange) themeChange.addEventListener("click", expandThemes);

/* ---- occasions + premium designs ---- */
var WL_OCC = "birthday";
var WL_UNLOCKED = {};
var WL_BALANCE = null;
function themeNameOf(id){ for(var i=0;i<THEME_META.length;i++) if(THEME_META[i].id===id) return THEME_META[i].name; return id; }
function isLockedPremium(){ return !!PREMIUM_THEMES[WL_THEME] && !WL_UNLOCKED[WL_THEME]; }
function renderPremiumStates(){
  themeGrid.querySelectorAll(".theme-card").forEach(function(c){
    var id = c.getAttribute("data-tid"); var s = c.querySelector(".tlock"); if(!s) return;
    if(!PREMIUM_THEMES[id]){ s.textContent = ""; c.classList.remove("locked"); return; }
    if(WL_UNLOCKED[id]){ s.textContent = "👑 Premium · Unlocked ✓"; c.classList.remove("locked"); }
    else { s.textContent = "👑 Premium · " + PREMIUM_PRICE + " credits"; c.classList.add("locked"); }
  });
}
function updatePremiumBar(){
  var bar = $("premiumBar"); if(!bar) return;
  if(PREMIUM_THEMES[WL_THEME] && !WL_UNLOCKED[WL_THEME]){
    bar.classList.remove("hidden");
    $("premiumText").innerHTML = "👑 <b>" + themeNameOf(WL_THEME) + "</b> is a Premium design. Unlock it <b>forever</b> for <b>" + PREMIUM_PRICE + " credits</b> — then use it in every occasion, as many times as you like.";
    $("premiumBal").textContent = (WL_BALANCE === null) ? "Checking your credits balance…" :
      ("Your balance: " + WL_BALANCE + " credits" + (WL_BALANCE >= PREMIUM_PRICE ? " — enough to unlock it right now." : " — you need " + (PREMIUM_PRICE - WL_BALANCE) + " more."));
  } else bar.classList.add("hidden");
}
function catLabel(c){
  return { heartfelt:"Heartfelt", funny:"Funny", short:"Short & Sweet", brother:"For Brother", sister:"For Sister", friend:"For Friend", mother:"For Mother", father:"For Father", girlfriend:"For Girlfriend", boyfriend:"For Boyfriend", bestie:"For Bestie", romantic:"Romantic", birthday:"Birthday Party", party:"Party / Get-together", formal:"Formal" }[c] || c;
}
function rebuildTextPickers(){
  var L = curLib();
  var wc = fWishCat.value;
  fWishCat.innerHTML = "";
  Object.keys(L.wishes).forEach(function(c){
    var o = document.createElement("option"); o.value = c; o.textContent = catLabel(c); fWishCat.appendChild(o);
  });
  if(L.wishes[wc]) fWishCat.value = wc;
  fLetterSel.innerHTML = "";
  L.letters.forEach(function(Lt, i){ var o = document.createElement("option"); o.value = i; o.textContent = Lt.label; fLetterSel.appendChild(o); });
  fLetterSel.value = (WL_OCC === "birthday" && L.letters.length > 1) ? "1" : "0";
  var sc = $("styleSummary");
  if(sc) sc.textContent = "🎨 Change style — " + Object.keys(L.wishes).length + " wish styles · " + L.letters.length + " letters";
  pickWish(); useLetter();
}
function setOccasion(occ, design){
  if(!OCCASIONS[occ]) occ = "birthday";
  WL_OCC = occ;
  var O = OCCASIONS[occ];
  $("makerTitle").textContent = O.makerTitle;
  $("makerSub").textContent = "⏱ Takes about 30 seconds — the wish, letter and PIN are already filled in for you. Just add the names and tap Create.";
  $("nameLabel").textContent = O.nameLabel;
  fName.placeholder = O.namePh;
  $("wishLabel").innerHTML = O.wishLabel + " <small>(already filled in for you — shuffle for another, or write your own)</small>";
  fWish.placeholder = O.wishPh;
  $("designNote").textContent = "(" + O.themes.length + " designs for " + O.name + (occ === "birthday" ? " — Midnight Gold is already picked for you; tap another only if you want" : " — tap one to pick it") + ")";
  expandThemes();
  var want = design || (O.themes.indexOf(WL_THEME) >= 0 ? WL_THEME : O.themes[0]);
  WL_THEME = want;
  themeGrid.querySelectorAll(".theme-card").forEach(function(x){ x.classList.toggle("sel", x.getAttribute("data-tid") === want); });
  if(design) collapseThemes();
  rebuildTextPickers();
  renderPremiumStates();
  updatePremiumBar();
  saveDraft();
}
/* device fingerprint (same recipe as the Photo Studio) so the wallet —
   and with it the premium unlocks — follows the person, not the browser */
var _fpPromise = null;
function wlFp(){
  if(_fpPromise) return _fpPromise;
  _fpPromise = (async function(){
    try{
      var nav = navigator, scr = window.screen || {};
      var w = Math.min(scr.width || 0, scr.height || 0), h = Math.max(scr.width || 0, scr.height || 0);
      var gpu = "";
      try{
        var gc = document.createElement("canvas");
        var gl = gc.getContext("webgl") || gc.getContext("experimental-webgl");
        if(gl){
          var ext = gl.getExtension("WEBGL_debug_renderer_info");
          var r = String((ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) || "");
          var gm = /(Adreno|Mali|PowerVR|Immortalis|Apple GPU)[^\s,)]*(?:\s*\d+)?/i.exec(r);
          gpu = gm ? gm[0].replace(/\(TM\)/gi, "").replace(/\s+/g, "").toLowerCase() : r.slice(0, 32).toLowerCase();
        }
      }catch(e){}
      var parts = [w + "x" + h, scr.colorDepth || "", window.devicePixelRatio || "", nav.maxTouchPoints || 0, nav.hardwareConcurrency || "", (window.Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "") || "", nav.language || "", gpu];
      var s = parts.join("|");
      if(window.crypto && crypto.subtle && crypto.subtle.digest){
        var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
        return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ("0" + b.toString(16)).slice(-2); }).join("");
      }
      return "";
    }catch(e){ return ""; }
  })();
  return _fpPromise;
}
function loadWalletState(){
  wlFp().then(function(fp){
    return fetch("/api/studio-wallet?device=" + encodeURIComponent(wlDeviceId()) + "&fp=" + encodeURIComponent(fp || ""));
  }).then(function(r){ return r.json(); }).then(function(j){
    if(j && j.device && j.device !== wlDeviceId()){ try{ localStorage.setItem("wl_device", j.device); }catch(e){} }
    if(j && j.designs && j.designs.unlocked) j.designs.unlocked.forEach(function(t){ WL_UNLOCKED[t] = 1; });
    if(j && typeof j.total === "number") WL_BALANCE = j.total;
    renderPremiumStates(); updatePremiumBar();
  }).catch(function(){});
}
loadWalletState();
$("btnUnlock").addEventListener("click", function(){
  var btn = this;
  btn.disabled = true; btn.textContent = "⏳ Unlocking…";
  wlFp().then(function(fp){
    return fetch("/api/studio-buydesign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ device: wlDeviceId(), fp: fp || "", theme: WL_THEME }) });
  }).then(function(r){ return r.json().then(function(j){ return { code: r.status, j: j }; }); })
  .then(function(x){
    btn.disabled = false; btn.textContent = "👑 Unlock this design — " + PREMIUM_PRICE + " credits";
    if(x.code === 200 && x.j && x.j.ok){
      (x.j.unlocked || [WL_THEME]).forEach(function(t){ WL_UNLOCKED[t] = 1; });
      if(typeof x.j.total === "number") WL_BALANCE = x.j.total;
      renderPremiumStates(); updatePremiumBar(); collapseThemes();
    } else if(x.j && x.j.error === "need_credits"){
      if(typeof x.j.total === "number") WL_BALANCE = x.j.total;
      updatePremiumBar();
      alert("Not enough credits yet — you have " + (x.j.total || 0) + " and this design needs " + PREMIUM_PRICE + ". Top up in the Photo Studio, or earn free credits by watching ads in the Telegram Mini App.");
    } else alert("Unlock failed — please try again.");
  }).catch(function(){
    btn.disabled = false; btn.textContent = "👑 Unlock this design — " + PREMIUM_PRICE + " credits";
    alert("Network problem — please try again.");
  });
});

/* ---- 4-step maker, draft autosave, preview, design grid ---- */
var STEP_LABELS = {1:"Step 1 of 2 · Names & design", 2:"Step 2 of 2 · Wish, photos & PIN"};
function goStep(n){
  document.querySelectorAll(".mstep").forEach(function(st){ st.classList.toggle("hidden", parseInt(st.getAttribute("data-step"),10) !== n); });
  $("mBar").style.width = (n*50) + "%";
  $("mStepLabel").textContent = (window.WL_T ? WL_T(STEP_LABELS[n]) : STEP_LABELS[n]);
  var anchor = document.querySelector(".mprog") || document.getElementById("maker");
  if (anchor) { var y = anchor.getBoundingClientRect().top + window.pageYOffset - 76; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); }
}
function saveDraft(){
  try{ localStorage.setItem("wl_draft", JSON.stringify({ n:fName.value, f:fFrom.value, pin:fPin.value, wc:fWishCat.value, w:fWish.value, ls:fLetterSel.value, l:fLetter.value, g:fGift.value, gc:fGiftCustom.value, t:WL_THEME, o:WL_OCC })); }catch(e){}
}
$("btnNext1").addEventListener("click", function(){
  if(!fName.value.trim()){ $("nameErr").classList.remove("hidden"); fName.focus(); return; }
  $("nameErr").classList.add("hidden"); goStep(2);
});
$("btnBack2").addEventListener("click", function(){ goStep(1); });
$("btnPinGen").addEventListener("click", function(){ fPin.value = String(Math.floor(1000 + Math.random()*9000)); $("pinErr").classList.add("hidden"); saveDraft(); });
$("makerForm").addEventListener("input", saveDraft);
$("makerForm").addEventListener("change", saveDraft);
(function restoreDraft(){
  var d = null;
  try{ d = JSON.parse(localStorage.getItem("wl_draft") || "null"); }catch(e){}
  if(!d) return;
  if(d.o && OCCASIONS[d.o] && d.o !== "birthday") setOccasion(d.o, d.t || null);
  if(d.n) fName.value = d.n;
  if(d.f) fFrom.value = d.f;
  if(d.pin) fPin.value = d.pin;
  if(d.wc && fWishCat.querySelector('option[value="' + d.wc + '"]')) fWishCat.value = d.wc;
  if(d.w) fWish.value = d.w;
  if(d.ls !== undefined && d.ls !== null && fLetterSel.querySelector('option[value="' + d.ls + '"]')) fLetterSel.value = d.ls;
  if(d.l) fLetter.value = d.l;
  if(d.g && fGift.querySelector('option[value="' + d.g + '"]')){ fGift.value = d.g; $("fGiftCustomWrap").classList.toggle("hidden", d.g !== "custom"); }
  if(d.gc) fGiftCustom.value = d.gc;
  if(d.t && d.t !== "classic" && !(d.o && OCCASIONS[d.o] && d.o !== "birthday")){
    var idx = THEME_META.map(function(m){ return m.id; }).indexOf(d.t);
    if(idx > 0 && themeGrid.children[idx]) themeGrid.children[idx].click();
  }
  if(d.t && !(d.o && OCCASIONS[d.o] && d.o !== "birthday")) collapseThemes();
})();
/* Arriving from an occasion page: /?occ=love&design=rose#maker */
(function(){
  try{
    var q = new URLSearchParams(location.search);
    var occ = q.get("occ"), des = q.get("design");
    if(occ && OCCASIONS[occ]) setOccasion(occ, des || null);
    else if(des && THEME_META.some(function(m){ return m.id === des; })){
      WL_THEME = des;
      themeGrid.querySelectorAll(".theme-card").forEach(function(x){ x.classList.toggle("sel", x.getAttribute("data-tid") === des); });
      updatePremiumBar();
      collapseThemes();
    }
  }catch(e){}
})();
$("btnPreview").addEventListener("click", function(){
  var d = collect();
  if(!d.name){ goStep(1); $("nameErr").classList.remove("hidden"); fName.focus(); return; }
  if(isLockedPremium()){ goStep(1); updatePremiumBar(); $("premiumBar").scrollIntoView({ behavior:"smooth", block:"center" }); return; }
  lastHtml = withSiteLink(renderPage(d));
  var pv = $("pvFrame"); pv.srcdoc = lastHtml; pv.classList.remove("hidden");
  pv.scrollIntoView({behavior:"smooth", block:"nearest"});
});
document.querySelectorAll(".dcard").forEach(function(c){
  c.addEventListener("click", function(){
    var idx = THEME_META.map(function(m){ return m.id; }).indexOf(c.getAttribute("data-theme"));
    if(idx >= 0 && themeGrid.children[idx]) themeGrid.children[idx].click();
    goStep(1);
    $("maker").scrollIntoView({behavior:"smooth"});
  });
});

/* ---- photo upload: resize in the browser, keep up to 4 ---- */
var WL_IMAGES = [];
function renderThumbs(){
  var box = $("thumbs"); box.innerHTML = "";
  WL_IMAGES.forEach(function(src, i){
    var d = document.createElement("div"); d.className = "thumb";
    d.innerHTML = '<img src="' + src + '" alt="Photo ' + (i+1) + '"><button type="button" title="Remove">✕</button>';
    d.querySelector("button").addEventListener("click", function(){ WL_IMAGES.splice(i, 1); renderThumbs(); });
    box.appendChild(d);
  });
}
$("fPhotos").addEventListener("change", function(){
  var files = Array.prototype.slice.call(this.files || []);
  this.value = "";
  files.forEach(function(file){
    if(WL_IMAGES.length >= 4) return;
    if(!/^image\//.test(file.type)) return;
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function(){
      URL.revokeObjectURL(url);
      var max = 880, w = img.naturalWidth, h = img.naturalHeight;
      var sc = Math.min(1, max / Math.max(w, h));
      var cv = document.createElement("canvas");
      cv.width = Math.round(w * sc); cv.height = Math.round(h * sc);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      WL_IMAGES.push(cv.toDataURL("image/jpeg", 0.72));
      renderThumbs();
    };
    img.src = url;
  });
});

try {
  var sp = localStorage.getItem('wl_studio_photo');
  if (sp) { localStorage.removeItem('wl_studio_photo'); WL_IMAGES.unshift(sp); if (WL_IMAGES.length > 4) WL_IMAGES.length = 4; renderThumbs(); }
} catch (e) {}

function collect(){
  var name=fName.value.trim(), from=fFrom.value.trim(), pin=fPin.value.trim().toLowerCase();
  if(!pin){ pin=((name.split(/\s+/)[0]||"surprise").toLowerCase().replace(/[^a-z0-9]/g,"")||"surprise"); }
  var LG = curLib().gifts;
  var gift=(fGift.value==="custom") ? fGiftCustom.value.trim() : (LG[parseInt(fGift.value,10)]||LG[0]);
  return { occ: WL_OCC, name:name, from:from, pin:pin, t: WL_THEME, im: WL_IMAGES.slice(),
    wish: fillTokens(fWish.value.trim(), name, from),
    letter: fillTokens(fLetter.value.trim(), name, from),
    gift: fillTokens(gift, name, from) };
}
function withSiteLink(html){
  return html.replace("✦ Made with WishLink</span>",
    "✦ Made with <a href=\"https://wishlink.pp.ua\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline\">WishLink</a></span>");
}
function encData(d){
  return btoa(unescape(encodeURIComponent(JSON.stringify(d)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decData(s){
  return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/")))));
}

function matchWish(text, name, from){
  var W = curLib().wishes;
  for(var c in W){ var arr = W[c];
    for(var i=0;i<arr.length;i++){ if(fillTokens(arr[i], name, from) === text) return {c:c, i:i}; } }
  return null;
}
function matchLetter(text, name, from){
  var L = curLib().letters;
  for(var i=0;i<L.length;i++){ if(fillTokens(L[i].body, name, from) === text) return i; }
  return -1;
}
function matchGift(text, name, from){
  var G = curLib().gifts;
  for(var i=0;i<G.length;i++){ if(fillTokens(G[i], name, from) === text) return i; }
  return -1;
}
/* Short payload: ready-made texts travel as template numbers, not full text */
function linkPayload(d){
  var p = { n: d.name, f: d.from, p: d.pin };
  var mw = matchWish(d.wish, d.name, d.from);
  if(mw){ p.wc = mw.c; p.wi = mw.i; } else { p.w = d.wish; }
  var ml = matchLetter(d.letter, d.name, d.from);
  if(ml >= 0){ p.li = ml; } else { p.l = d.letter; }
  var mg = matchGift(d.gift, d.name, d.from);
  if(mg >= 0){ p.gi = mg; } else { p.g = d.gift; }
  if(d.t && d.t !== "classic"){ p.t = d.t; }
  if(d.occ && d.occ !== "birthday"){ p.o = d.occ; }
  if(d.im && d.im.length){ p.im = d.im; }
  return p;
}
function payloadToData(p){
  if(p.name !== undefined) return p; /* legacy full-text link */
  var occ = (p.o && OCCASIONS[p.o]) ? p.o : "birthday";
  var L = occLib(occ);
  var d = { occ: occ, name: p.n || "", from: p.f || "", pin: p.p || "surprise" };
  d.wish = (p.w !== undefined) ? p.w : fillTokens((L.wishes[p.wc] || L.wishes[Object.keys(L.wishes)[0]])[p.wi || 0], d.name, d.from);
  d.letter = (p.l !== undefined) ? p.l : fillTokens(L.letters[p.li || 0].body, d.name, d.from);
  d.gift = (p.g !== undefined) ? p.g : fillTokens(L.gifts[p.gi || 0], d.name, d.from);
  d.t = p.t || "classic";
  d.im = p.im || [];
  return d;
}

var WL_DB = "https://wishlink-e9752-default-rtdb.asia-southeast1.firebasedatabase.app";
var WL_BASE = "https://www.wishlink.pp.ua";
function makeSlug(name){
  var s = String(name || "friend").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 18) || "friend";
  s = s + "-surprise";
  var chars = "abcdefghjkmnpqrstuvwxyz23456789", r = "";
  for(var i=0;i<10;i++) r += chars[Math.floor(Math.random()*chars.length)];
  return s + "-" + r;
}
function storePayload(slug, payload){
  var ctl = ("AbortController" in window) ? new AbortController() : null;
  var to = ctl ? setTimeout(function(){ ctl.abort(); }, 6000) : null;
  return fetch(WL_DB + "/pages/" + slug + ".json", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined })
    .then(function(r){ if(to) clearTimeout(to); return r.ok; })
    .catch(function(){ if(to) clearTimeout(to); return false; });
}

var lastD=null, lastHtml="";
var lastLink = "", lastPin = "";
function updateWa(){
  var msg;
  if(typeof WL_OCC !== "undefined" && WL_OCC !== "birthday" && OCCASIONS[WL_OCC]){
    var t = OCCASIONS[WL_OCC].share;
    if($("waPin").checked) msg = t.split("{link}").join(lastLink).split("{pin}").join(lastPin);
    else msg = t.split("{link}").join(lastLink).replace(/ PIN: \{pin\}$/, "");
  } else {
    msg = (window.WL_T ? WL_T("wa_msg") : "I made a birthday surprise for you 🎁 Open it here: ") + lastLink;
    if($("waPin").checked) msg += " PIN: " + lastPin;
  }
  $("btnWa").href = "https://wa.me/?text=" + encodeURIComponent(msg);
}
function showResult(link, d){
  lastLink = link; lastPin = d.pin;
  $("shareLink").value = link;
  $("pinShow").value = d.pin;
  updateWa();
  $("btnOpen").href = link;
  $("pinNote").innerHTML = (window.WL_T ? WL_T("pin_note") : "🔑 The page opens with the PIN: <b>{pin}</b> — share it only with the person it is made for.").replace("{pin}", d.pin);
  var pv = $("pvFrame"); pv.srcdoc = lastHtml; pv.classList.remove("hidden");
  var dn = $("delNote");
  if(window.__WL_TOKEN__){
    dn.innerHTML = "🧾 <b>Your delete code:</b> " + window.__WL_TOKEN__ + " — it is saved on this device too. Delete this page any time at <a href=\"/delete.html\">wishlink.pp.ua/delete.html</a>.";
    dn.classList.remove("hidden");
  } else { dn.classList.add("hidden"); }
  $("result").classList.remove("hidden");
  $("result").scrollIntoView({behavior:"smooth", block:"start"});
}
$("waPin").addEventListener("change", updateWa);
function wlDeviceId(){
  try{
    var d = localStorage.getItem("wl_device");
    if(!d){ d = "dev-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); localStorage.setItem("wl_device", d); }
    return d;
  }catch(e){ return "dev-anon0000"; }
}
function saveMyPage(slug, name, pin){
  try{
    var ps = JSON.parse(localStorage.getItem("wl_pages") || "[]");
    ps = ps.filter(function(p){ return p.slug !== slug; });
    ps.unshift({ slug: slug, n: name, pin: pin, ts: Date.now() });
    localStorage.setItem("wl_pages", JSON.stringify(ps.slice(0, 50)));
  }catch(e){}
}
function saveToken(slug, token){
  try{ var tk = JSON.parse(localStorage.getItem("wl_tokens") || "{}"); tk[slug] = token; localStorage.setItem("wl_tokens", JSON.stringify(tk)); }catch(e){}
}
function apiCreate(d){
  var body = { n:d.name, f:d.from, pin:d.pin, w:d.wish, l:d.letter, g:d.gift, t:d.t || "classic", images:d.im || [], device: wlDeviceId() };
  if(d.occ && d.occ !== "birthday") body.o = d.occ;
  return fetch("/api/create", { method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body) })
    .then(function(r){
      if(!r.ok) return r.json().catch(function(){ return {}; }).then(function(j){ var e = new Error("api"); e.wlError = j.error || ""; throw e; });
      return r.json();
    });
}
$("btnMake").addEventListener("click", function(){
  var d = collect();
  if(!d.name){ goStep(1); $("nameErr").classList.remove("hidden"); fName.focus(); return; }
  if(isLockedPremium()){ goStep(1); updatePremiumBar(); $("premiumBar").scrollIntoView({ behavior:"smooth", block:"center" }); return; }
  if(!/^[0-9]{4,8}$/.test(d.pin)){ $("pinErr").classList.remove("hidden"); fPin.focus(); return; }
  $("pinErr").classList.add("hidden");
  lastD = d;
  lastHtml = withSiteLink(renderPage(d));
  var btn = $("btnMake");
  btn.textContent = "⏳ Creating your link…"; btn.disabled = true;
  apiCreate(d).then(function(res){
    btn.textContent = "✨ Create my page"; btn.disabled = false;
    saveToken(res.slug, res.editToken);
    saveMyPage(res.slug, d.name, d.pin);
    window.__WL_TOKEN__ = res.editToken;
    showResult(WL_BASE + "/" + res.slug, d);
  }).catch(function(err){
    if((err && err.wlError === "premium_locked") || isLockedPremium()){
      btn.textContent = "✨ Create my page"; btn.disabled = false;
      goStep(1); updatePremiumBar();
      $("premiumBar").scrollIntoView({ behavior:"smooth", block:"center" });
      return;
    }
    /* fallback: previous storage route, then a self-contained hash link */
    var payload = linkPayload(d);
    var slug = makeSlug(d.name);
    storePayload(slug, payload).then(function(ok){
      btn.textContent = "✨ Create my page"; btn.disabled = false;
      window.__WL_TOKEN__ = "";
      showResult(ok ? (WL_BASE + "/" + slug) : (WL_BASE + "/#p=" + encData(payload)), d);
    });
  });
});
$("btnCopy").addEventListener("click", function(){
  var i=$("shareLink"); i.select(); i.setSelectionRange(0, 99999);
  function done(){ $("btnCopy").textContent="Copied ✓"; setTimeout(function(){ $("btnCopy").textContent="Copy"; }, 1800); }
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(i.value).then(done, done); }
  else { try{ document.execCommand("copy"); }catch(e){} done(); }
});
$("btnCopyPin").addEventListener("click", function(){
  var i=$("pinShow"); i.select(); i.setSelectionRange(0, 99999);
  function done(){ $("btnCopyPin").textContent="Copied ✓"; setTimeout(function(){ $("btnCopyPin").textContent="Copy PIN"; }, 1800); }
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(i.value).then(done, done); }
  else { try{ document.execCommand("copy"); }catch(e){} done(); }
});
$("btnDl").addEventListener("click", function(e){
  e.preventDefault();
  if(lastD){ downloadHtml(lastHtml, (lastD.occ || "birthday") + "-page-for-" + slugOf(lastD.name) + ".html"); }
});
$("btnAgain").addEventListener("click", function(){
  $("result").classList.add("hidden");
  goStep(1);
  $("maker").scrollIntoView({behavior:"smooth"});
});

/* Viewer: open the shared page full-screen (after parsing — document.open is a no-op mid-parse) */
function runViewer(){
  if(!window.__WL_VIEW__) return;
  try{
    var vd = payloadToData(decData(window.__WL_VIEW__));
    var vh = withSiteLink(renderPage(vd));
    document.open(); document.write(vh); document.close();
  }catch(e){ window.__WL_ERR__ = e.message; }
}
if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", runViewer); }
else { runViewer(); }

/* Pretty link: /<name-slug> — the page content stays on the server until
   the correct PIN is entered (POST /api/unlock). Nothing private is in this page. */
(function(){
  if(window.__WL_VIEW__) return;
  var m = location.pathname.match(/^\/([a-zA-Z0-9][a-zA-Z0-9\-]{2,48})$/);
  if(!m) return;
  var slug = m[1];
  var overlay = document.createElement("div");
  overlay.setAttribute("style", "position:fixed;inset:0;z-index:99;background:#14101f;display:flex;align-items:center;justify-content:center;padding:18px;font-family:'DM Sans',system-ui,sans-serif");
  overlay.innerHTML = '<div id="wlCard" style="background:#1d1430;border:1px solid rgba(232,184,75,.45);border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.45);max-width:360px;width:100%;padding:30px 26px;text-align:center">' +
    '<div style="font-size:46px">🔒</div>' +
    '<div id="wlTitle" style="font-weight:800;font-size:21px;color:#fdf6e3;margin-top:8px">A surprise is locked for you</div>' +
    '<p id="wlSub" style="color:#cbbf9f;font-size:14.5px;margin-top:7px;line-height:1.55">Someone made a birthday page for you.<br>Type the secret PIN to open it.</p>' +
    '<div style="position:relative;width:216px;margin:16px auto 0">' +
    '<input id="wlPin" type="password" inputmode="numeric" autocomplete="off" placeholder="\u2022\u2022\u2022\u2022" style="width:100%;box-sizing:border-box;padding:13px 44px 13px 13px;border-radius:14px;border:2px solid #e8b84b;background:rgba(255,255,255,.06);color:#fdf6e3;font-size:19px;text-align:center;letter-spacing:6px;font-weight:700;outline:none">' +
    '<button id="wlEye" type="button" aria-label="Show PIN" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:20px;cursor:pointer;padding:6px;line-height:1">👁️</button>' +
    '</div>' +
    '<br><button id="wlUnlock" style="margin-top:10px;background:linear-gradient(160deg,#f5d67b,#e8b84b);color:#241a08;border:none;font-weight:800;font-size:16px;padding:13px 32px;border-radius:999px;cursor:pointer;font-family:inherit">Unlock my surprise 🔓</button>' +
    '<div id="wlErr" style="color:#ff9c9c;font-size:13.5px;font-weight:700;min-height:19px;margin-top:10px"></div></div>';
  function lum(hex){
    var h = String(hex || "").replace("#", "");
    if(h.length !== 6) return 0;
    return 0.2126 * parseInt(h.substr(0, 2), 16) / 255 + 0.7152 * parseInt(h.substr(2, 2), 16) / 255 + 0.0722 * parseInt(h.substr(4, 2), 16) / 255;
  }
  /* Paint the gate in the PAGE's own theme (classic = Midnight Gold).
     Only the theme id comes from the server — the content stays locked. */
  function applyTheme(t){
    try{
      var card = document.getElementById("wlCard"), title = document.getElementById("wlTitle"),
          sub = document.getElementById("wlSub"), pin = document.getElementById("wlPin"),
          btn = document.getElementById("wlUnlock");
      if(!card || !t || t === "classic" || !window.THEMES || !THEMES[t]) return;
      var th = THEMES[t];
      overlay.style.background = th.bg;
      overlay.style.fontFamily = th.fb;
      card.style.background = th.card;
      card.style.border = "1px solid " + th.acc + "66";
      card.style.borderRadius = th.rad;
      title.style.color = th.ink; title.style.fontFamily = th.fd;
      sub.style.color = th.mut;
      pin.style.borderColor = th.acc; pin.style.color = th.ink;
      pin.style.background = th.dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.75)";
      btn.style.background = th.acc; btn.style.color = lum(th.acc) > 0.55 ? "#571F30" : "#ffffff";
      if(window.fontUrl && !document.getElementById("wlGateFont")){
        var lk = document.createElement("link");
        lk.id = "wlGateFont"; lk.rel = "stylesheet"; lk.href = fontUrl(th);
        document.head.appendChild(lk);
      }
    }catch(e){}
  }
  function openWith(pin, resp){
    try{
      var vd = payloadToData(resp);
      vd.pin = pin; vd.unlocked = true;
      window.__WL_SLUG__ = slug; window.__WL_UNLOCKED__ = true;
      var vh = withSiteLink(renderPage(vd));
      document.open(); document.write(vh); document.close();
    }catch(e){ window.__WL_ERR__ = e.message; }
  }
  function legacyOpen(){
    fetch(WL_DB + "/pages/" + slug + ".json")
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(p){
        if(!p){ document.querySelector("#wlErr").textContent = "This page could not be found."; return; }
        var vd = payloadToData(p);
        vd.unlocked = false;
        window.__WL_SLUG__ = slug;
        var vh = withSiteLink(renderPage(vd));
        document.open(); document.write(vh); document.close();
      })
      .catch(function(){ document.querySelector("#wlErr").textContent = "Something went wrong — please try again."; });
  }
  function wlIsOwner(){
    try{
      var tk = JSON.parse(localStorage.getItem("wl_tokens") || "{}");
      if(tk[slug]) return true;
      var ps = JSON.parse(localStorage.getItem("wl_pages") || "[]");
      for(var i=0;i<ps.length;i++) if(ps[i].slug === slug) return true;
    }catch(e){}
    return false;
  }
  function go(){
    document.body.appendChild(overlay);
    try{ fetch("/api/seen", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ slug: slug }) }); }catch(e){}
    var pinEl = document.getElementById("wlPin");
    var errEl = document.getElementById("wlErr");
    var eyeEl = document.getElementById("wlEye");
    if(eyeEl) eyeEl.addEventListener("click", function(){
      var hidden = pinEl.type === "password";
      pinEl.type = hidden ? "text" : "password";
      eyeEl.textContent = hidden ? "🙈" : "👁️";
      eyeEl.setAttribute("aria-label", hidden ? "Hide PIN" : "Show PIN");
      pinEl.focus();
    });
    fetch("/api/gate?slug=" + encodeURIComponent(slug))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if(j && j.t) applyTheme(j.t);
        if(j && j.o && j.o !== "birthday"){
          var names = { love: "love", friendship: "friendship", newyear: "New Year", anniversary: "anniversary", invitation: "invitation", wedding: "wedding", baby: "new-baby", eid: "Eid" };
          var el = document.getElementById("wlSub");
          if(el && names[j.o]) el.innerHTML = "Someone made a " + names[j.o] + " page for you.<br>Type the secret PIN to open it.";
        }
      })
      .catch(function(){});
    pinEl.focus();
    function submit(){
      var pin = pinEl.value.trim();
      if(!pin){ errEl.textContent = "Please type the PIN first."; return; }
      errEl.textContent = "Checking…";
      fetch("/api/unlock", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ slug: slug, pin: pin, owner: wlIsOwner() }) })
        .then(function(r){
          if(r.status === 200) return r.json().then(function(resp){ openWith(pin, resp); });
          if(r.status === 401){ errEl.textContent = "Wrong PIN — try again 💛"; return null; }
          if(r.status === 429){ errEl.textContent = "Too many tries — please wait a few minutes."; return null; }
          if(r.status === 404){ errEl.textContent = "This page could not be found."; return null; }
          legacyOpen(); return null;
        })
        .catch(function(){ legacyOpen(); });
    }
    document.getElementById("wlUnlock").addEventListener("click", submit);
    pinEl.addEventListener("keydown", function(e){ if(e.key === "Enter") submit(); });
  }
  if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", go); }
  else { go(); }
})();
</script>
<script src="/i18n.js"></script>
</body>
</html>
'''

out = head + "\n<script>\n" + data_js + "\n" + occ_js + "\n" + build_js + "\n" + themes_js + "\n" + dl_js + "\n</script>\n" + wiring
io.open('index.html', 'w', encoding='utf-8').write(out)
print("index.html written:", len(out), "bytes")
import sitepages
written = sitepages.write_all('.')
print("extra pages written:", ", ".join(written))

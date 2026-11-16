/* ================= WishLink themed pages (buildPage2) =================
   14 themes. Every theme changes: colours, fonts, PIN style, loading style,
   decorations and cake colours. Reading first: strong contrast, big text.
   pin: dots | orbs | hearts | line | balloon
   load: bar | rings | hearts | candles | type | balloon                */
var THEMES = {
  pastel:  { name:"Pastel Sky",    tag:"Soft pink & lavender dream", dark:false, bg:"linear-gradient(160deg,#ffe9f3,#e3e9ff 55%,#d8f3ff)", card:"rgba(255,255,255,.82)", ink:"#3d2c4e", mut:"#655384", acc:"#ff5e8a", acc2:"#8b5cf6", fd:"'Dancing Script',cursive", fb:"'Quicksand',sans-serif", pin:"balloon", load:"balloon", deco:"balloons", cake:["#f9a8d4","#c4b5fd","#7dd3fc"], rad:"26px", script:true },
  neon:    { name:"Neon Galaxy",   tag:"Deep space neon glow", dark:true, bg:"radial-gradient(900px 500px at 85% -5%,rgba(244,113,181,.20),transparent 60%),linear-gradient(180deg,#05050f,#12082b)", card:"rgba(19,16,48,.85)", ink:"#eef2ff", mut:"#9aa7d0", acc:"#22d3ee", acc2:"#f471b5", fd:"'Quicksand',sans-serif", fb:"'Quicksand',sans-serif", pin:"orbs", load:"rings", deco:"stars", cake:["#ec4899","#8b5cf6","#0ea5e9"], rad:"24px", script:true },
  rose:    { name:"Rose Royal",    tag:"Deep rose & gold elegance", dark:true, bg:"linear-gradient(165deg,#2b0a14,#4a0e22 60%,#5c1230)", card:"rgba(74,14,34,.72)", ink:"#fdf3e7", mut:"#e5b8c4", acc:"#e8b44b", acc2:"#fb7185", fd:"'Playfair Display',serif", fb:"'Lora',serif", pin:"dots", load:"bar", deco:"petals", cake:["#fb7185","#e11d48","#881337"], rad:"18px", script:false },
  ocean:   { name:"Ocean Breeze",  tag:"Fresh aqua & white air", dark:false, bg:"linear-gradient(165deg,#e0f7fa,#e8f6ff 55%,#dbeafe)", card:"rgba(255,255,255,.88)", ink:"#0c3b4c", mut:"#5b8296", acc:"#0891b2", acc2:"#2563eb", fd:"'Poppins',sans-serif", fb:"'Poppins',sans-serif", pin:"dots", load:"bar", deco:"bubbles", cake:["#67e8f9","#38bdf8","#2563eb"], rad:"22px", script:false },
  sunset:  { name:"Sunset Peach",  tag:"Warm coral golden hour", dark:false, bg:"linear-gradient(160deg,#fff3e0,#ffe4e0 55%,#ffd9ec)", card:"rgba(255,255,255,.85)", ink:"#4a2410", mut:"#96684a", acc:"#ea580c", acc2:"#db2777", fd:"'Dancing Script',cursive", fb:"'Quicksand',sans-serif", pin:"hearts", load:"hearts", deco:"sparkles", cake:["#fdba74","#fb923c","#f43f5e"], rad:"26px", script:true },
  lavender:{ name:"Lavender Dream",tag:"Soft lilac calm", dark:false, bg:"linear-gradient(160deg,#f3e8ff,#ede9fe 55%,#e0e7ff)", card:"rgba(255,255,255,.86)", ink:"#33235c", mut:"#7c6aa8", acc:"#7c3aed", acc2:"#db2777", fd:"'Dancing Script',cursive", fb:"'Poppins',sans-serif", pin:"dots", load:"type", deco:"stars", cake:["#d8b4fe","#a78bfa","#7c3aed"], rad:"24px", script:true },
  emerald: { name:"Emerald Royal", tag:"Deep green & gold luxury", dark:true, bg:"linear-gradient(165deg,#04150d,#0a2e1c 60%,#0d3a24)", card:"rgba(10,46,28,.78)", ink:"#f5efdd", mut:"#a7c4b0", acc:"#e8b44b", acc2:"#34d399", fd:"'Playfair Display',serif", fb:"'Lora',serif", pin:"dots", load:"bar", deco:"sparkles", cake:["#6ee7b7","#10b981","#065f46"], rad:"18px", script:false },
  candy:   { name:"Candy Pop",     tag:"Bright, chunky & playful", dark:false, bg:"linear-gradient(160deg,#fff0f6,#fff7d6 55%,#e6f9ff)", card:"rgba(255,255,255,.9)", ink:"#571c47", mut:"#7c4f70", acc:"#ec4899", acc2:"#f59e0b", fd:"'Fredoka',sans-serif", fb:"'Fredoka',sans-serif", pin:"balloon", load:"hearts", deco:"balloons", cake:["#f9a8d4","#fbbf24","#38bdf8"], rad:"30px", script:false },
  vintage: { name:"Vintage Paper", tag:"Classic book-page charm", dark:false, bg:"linear-gradient(170deg,#faf3e3,#f3e8d2)", card:"#fffaf0", ink:"#3e2f1c", mut:"#6f5a41", acc:"#b45309", acc2:"#92400e", fd:"'Playfair Display',serif", fb:"'Lora',serif", pin:"line", load:"type", deco:"none", cake:["#e7c07f","#c98f3d","#8a5a1d"], rad:"10px", script:false },
  noir:    { name:"Cherry Noir",   tag:"Bold black & cherry red", dark:true, bg:"linear-gradient(170deg,#0a0a0a,#17060a 60%,#22060d)", card:"rgba(30,8,14,.88)", ink:"#fdf2f4", mut:"#c09aa2", acc:"#e11d48", acc2:"#f59e0b", fd:"'Bebas Neue',sans-serif", fb:"'Poppins',sans-serif", pin:"orbs", load:"bar", deco:"dots", cake:["#fda4af","#e11d48","#7f1d2e"], rad:"14px", script:false },
  mint:    { name:"Sky Mint",      tag:"Fresh mint & sky freshness", dark:false, bg:"linear-gradient(160deg,#e6fff5,#e0f7ec 55%,#e0f2fe)", card:"rgba(255,255,255,.88)", ink:"#0d3a2a", mut:"#5d8a76", acc:"#059669", acc2:"#0284c7", fd:"'Quicksand',sans-serif", fb:"'Quicksand',sans-serif", pin:"dots", load:"balloon", deco:"leaves", cake:["#6ee7b7","#34d399","#0ea5e9"], rad:"24px", script:true },
  royal:   { name:"Royal Purple",  tag:"Regal violet & silver", dark:true, bg:"linear-gradient(165deg,#150826,#2a1152 60%,#341763)", card:"rgba(42,17,82,.8)", ink:"#f3efff", mut:"#b3a6d9", acc:"#c0c8e8", acc2:"#a78bfa", fd:"'Cinzel',serif", fb:"'Lora',serif", pin:"orbs", load:"rings", deco:"stars", cake:["#c4b5fd","#8b5cf6","#5b21b6"], rad:"16px", script:false },
  honey:   { name:"Golden Honey",  tag:"Warm amber candlelight", dark:true, bg:"linear-gradient(165deg,#1c1206,#33200a 60%,#42290c)", card:"rgba(51,32,10,.82)", ink:"#fdf6e3", mut:"#d9bd8a", acc:"#f59e0b", acc2:"#ef4444", fd:"'Dancing Script',cursive", fb:"'Lora',serif", pin:"hearts", load:"candles", deco:"sparkles", cake:["#fcd34d","#f59e0b","#b45309"], rad:"22px", script:true },
  snow:    { name:"Snow White",    tag:"Clean white & ice blue", dark:false, bg:"linear-gradient(170deg,#ffffff,#eef6fd 60%,#e3f0fc)", card:"#ffffff", ink:"#17334f", mut:"#4d6a86", acc:"#0284c7", acc2:"#7c3aed", fd:"'Poppins',sans-serif", fb:"'Poppins',sans-serif", pin:"line", load:"bar", deco:"snow", cake:["#bae6fd","#7dd3fc","#38bdf8"], rad:"20px", script:false }
};
var THEME_ORDER = ["pastel","neon","rose","ocean","sunset","lavender","emerald","candy","vintage","noir","mint","royal","honey","snow"];
var DECO_EMOJI = { balloons:["🎈","🎈","🎉","🎈","✨"], stars:["✦","⭐","✦","✧","⭐"], petals:["🌸","🌹","🌸","✿","🌸"], bubbles:["🫧","🫧","💧","🫧","🫧"], sparkles:["✨","⭐","✨","💫","✨"], leaves:["🍃","🌿","🍃","🌱","🍃"], dots:["•","•","•","•","•"], snow:["❄","❅","❄","❆","❄"], none:[] };

function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function paras(t){ return String(t || "").split(/\n\s*\n|\n/).map(function(x){ return x.trim(); }).filter(Boolean); }

function fontUrl(th){
  function fam(f){ return f.split(",")[0].replace(/['"]/g,"").trim().replace(/\s+/g,"+"); }
  var a = fam(th.fd), b = fam(th.fb), set = {};
  set[a] = 1; set[b] = 1;
  var parts = Object.keys(set).map(function(f){ return "family=" + f + ":wght@500;600;700"; });
  return "https://fonts.googleapis.com/css2?" + parts.join("&") + "&display=swap";
}

var OCC2 = {
  birthday:    { title: "Happy Birthday", headline: "Happy Birthday", script: "happy birthday to you", speak: "Happy Birthday, ", type: "Happy Birthday!", emoji: "🎂", hero: "🎂 🎉 🎈" },
  love:        { title: "With All My Love", headline: "With All My Love", script: "for the one i love", speak: "For you, ", type: "With All My Love…", emoji: "❤️", hero: "❤️ 🎉 ❤️" },
  friendship:  { title: "Happy Friendship Day", headline: "Happy Friendship Day", script: "best friends forever", speak: "Happy Friendship Day, ", type: "Best Friends Forever!", emoji: "👯", hero: "👯 🎉 🎈" },
  newyear:     { title: "Happy New Year", headline: "Happy New Year 2027", script: "happy new year", speak: "Happy New Year, ", type: "Happy New Year!", emoji: "🎆", hero: "🎆 🎉 🎇" },
  anniversary: { title: "Happy Anniversary", headline: "Happy Anniversary", script: "happy anniversary", speak: "Happy Anniversary, ", type: "Happy Anniversary!", emoji: "💍", hero: "💍 🎉 💛" },
  invitation:  { title: "You're Invited", headline: "You're Invited", script: "you are invited", speak: "You are invited, ", type: "You're Invited!", emoji: "💌", hero: "💌 🎉 💌" },
  wedding:     { title: "The Wedding", headline: "The Wedding Of", script: "with joyful hearts", speak: "Mubarak, ", type: "Mubarak!", emoji: "💍", hero: "💍 🎉 💛" },
  baby:        { title: "Welcome, Little One", headline: "Welcome To The World", script: "welcome, little one", speak: "Welcome, ", type: "Welcome!", emoji: "👶", hero: "👶 🎉 🍼" },
  eid:         { title: "Eid Mubarak", headline: "Eid Mubarak", script: "eid mubarak", speak: "Eid Mubarak, ", type: "Eid Mubarak!", emoji: "🌙", hero: "🌙 🎉 ✨" }
};

function buildPage2(d, th){
  var O2 = OCC2[d.occ] || OCC2.birthday;
  var name = d.name || "Friend", from = d.from || "Someone who loves you";
  var decoArr = DECO_EMOJI[th.deco] || [];
  var decoHtml = "";
  if(decoArr.length){
    var pos = [4, 16, 30, 47, 63, 78, 90, 12, 55, 84];
    for(var i = 0; i < 10; i++){
      decoHtml += '<span class="deco" style="left:' + pos[i] + '%;animation-duration:' + (9 + (i % 5) * 2.4) + 's;animation-delay:' + (-i * 1.7) + 's;font-size:' + (15 + (i % 3) * 6) + 'px">' + decoArr[i % decoArr.length] + '</span>';
    }
  }
  /* PIN widget per style */
  var pinDots = "";
  if(th.pin === "dots" || th.pin === "orbs" || th.pin === "balloon"){
    pinDots = '<div class="pdots" id="pdots"><span></span><span></span><span></span><span></span></div>';
  } else if(th.pin === "hearts"){
    pinDots = '<div class="pdots hearts" id="pdots"><span>♡</span><span>♡</span><span>♡</span><span>♡</span></div>';
  }
  var gateBalloon = (th.pin === "balloon") ? '<div id="gateBalloon">🎈</div>' : '';
  /* Loader body per style */
  var loadInner = "";
  if(th.load === "bar"){ loadInner = '<div class="lbar"><i id="lFill"></i></div>'; }
  else if(th.load === "rings"){ loadInner = '<div class="lrings"><i></i><i></i><i></i></div>'; }
  else if(th.load === "hearts"){ loadInner = '<div class="lhearts"><span>💖</span><span>💗</span><span>💖</span><span>💗</span><span>💖</span></div>'; }
  else if(th.load === "candles"){ loadInner = '<div class="lcandles">' + '<div class="lc"><i></i></div>'.repeat(5) + '</div>'; }
  else if(th.load === "type"){ loadInner = '<div id="typeTxt"></div>'; }
  else if(th.load === "balloon"){ loadInner = '<div id="loadBalloon">🎈</div>'; }
  /* Gallery */
  var galHtml = "";
  if(d.im && d.im.length){
    var slides = "", dots = "";
    d.im.forEach(function(src, i){
      slides += '<div class="slide' + (i === 0 ? " active" : "") + '"><img src="' + src + '" alt="Photo ' + (i + 1) + '"></div>';
      dots += '<span class="gdot' + (i === 0 ? " on" : "") + '"></span>';
    });
    galHtml =
      '<section class="card rv"><h2>📸 Moments</h2>' +
      '<div class="gal" id="gal">' + slides +
      '<button class="gnav prev" id="gPrev" type="button" aria-label="Previous photo">‹</button>' +
      '<button class="gnav next" id="gNext" type="button" aria-label="Next photo">›</button></div>' +
      '<div class="gdots">' + dots + '</div>' +
      '<p class="ghint">Photos slide on their own — or swipe them</p></section>';
  }
  var wishParas = paras(d.wish).map(function(p){ return "<p>" + esc(p) + "</p>"; }).join("");
  var letterParas = paras(d.letter).map(function(p){ return "<p>" + esc(p) + "</p>"; }).join("");

  var css = [
    ":root{--card:" + th.card + ";--ink:" + th.ink + ";--mut:" + th.mut + ";--acc:" + th.acc + ";--acc2:" + th.acc2 + ";--rad:" + th.rad + "}",
    "*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}",
    "body{font-family:" + th.fb + ";color:var(--ink);background:" + th.bg + ";background-attachment:fixed;min-height:100vh;overflow-x:hidden}",
    ".hidden{display:none!important}",
    ".deco{position:fixed;bottom:-40px;z-index:0;pointer-events:none;opacity:.55;animation:floatUp linear infinite}",
    "@keyframes floatUp{to{transform:translateY(-112vh) rotate(40deg);opacity:.1}}",
    ".card{background:var(--card);border:1.5px solid " + (th.dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.07)") + ";border-radius:var(--rad);box-shadow:0 18px 44px rgba(0,0,0," + (th.dark ? ".42" : ".13") + ");padding:26px 22px;margin-top:18px;position:relative;z-index:2}",
    ".card h2{font-size:19.5px;margin-bottom:10px}",
    ".card p{font-size:16px;line-height:1.7;color:var(--ink)}",
    ".rv{opacity:0;transform:translateY(26px);transition:opacity .65s ease,transform .65s ease}",
    ".rv.in{opacity:1;transform:none}",
    /* gate */
    "#gate{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}",
    ".gcard{width:min(400px,94vw);text-align:center;padding:34px 26px 28px}",
    ".gcard .gico{font-size:52px;animation:bob 2.6s ease-in-out infinite}",
    "@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}",
    ".gcard h1{font-family:" + th.fd + ";font-size:29px;margin-top:10px;line-height:1.25}",
    ".gcard .gsub{color:var(--mut);font-size:15px;margin-top:7px;line-height:1.55}",
    ".pdots{display:flex;gap:12px;justify-content:center;margin:22px 0 4px}",
    ".pdots span{width:15px;height:15px;border-radius:50%;border:2px solid var(--acc);transition:all .18s}",
    ".pdots span.on{background:var(--acc);transform:scale(1.2)}",
    ".pdots.hearts span{width:auto;height:auto;border:none;font-size:22px;color:var(--acc2);line-height:1}",
    ".pdots.hearts span.on{transform:scale(1.3)}",
    "body[data-pin='orbs'] .pdots span{border-color:var(--acc2)}",
    "body[data-pin='orbs'] .pdots span.on{background:radial-gradient(circle at 35% 35%,#fff,var(--acc) 55%," + th.acc2 + ");box-shadow:0 0 13px var(--acc);border-color:transparent}",
    "#gateBalloon{font-size:40px;margin-top:10px;transition:transform .25s ease;display:inline-block}",
    ".pdots.err span{border-color:#e11d48!important;background:rgba(225,29,72,.3)!important}",
    ".pin-field{margin:12px auto 4px;width:215px;padding:13px;border-radius:14px;border:2px solid var(--acc);background:" + (th.dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.75)") + ";font-size:19px;text-align:center;letter-spacing:6px;font-family:inherit;font-weight:700;color:var(--ink);outline:none;display:block}",
    "body[data-pin='line'] .pin-field{border:none;border-bottom:3px solid var(--acc);border-radius:0;background:transparent}",
    ".bigbtn{margin-top:16px;padding:13px 34px;font-size:16.5px;background:linear-gradient(92deg,var(--acc),var(--acc2));color:#fff;border:none;font-family:inherit;font-weight:700;cursor:pointer;border-radius:999px;box-shadow:0 10px 26px rgba(0,0,0,.25)}",
    ".bigbtn:active{transform:scale(.96)}",
    ".ghostbtn{padding:11px 22px;font-size:14.5px;background:transparent;color:var(--acc);border:1.5px solid var(--acc);font-family:inherit;font-weight:700;cursor:pointer;border-radius:999px}",
    ".gerr{color:#fb4d6d;font-size:13.5px;font-weight:700;min-height:19px;margin-top:9px}",
    ".shake{animation:shake .45s}@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}",
    /* loader */
    "#loader{position:fixed;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;background:" + th.bg + ";padding:20px;text-align:center}",
    "#loadPct{font-family:" + th.fd + ";font-size:40px;font-weight:700;color:var(--acc)}",
    "#loadMsg{color:var(--mut);font-weight:600;margin-top:12px;min-height:22px}",
    ".lbar{width:min(280px,80vw);height:10px;border-radius:99px;background:rgba(127,127,127,.25);margin-top:16px;overflow:hidden}",
    ".lbar i{display:block;height:100%;width:0%;background:linear-gradient(92deg,var(--acc),var(--acc2));transition:width .18s}",
    ".lrings{position:relative;width:120px;height:120px;margin-bottom:8px}",
    ".lrings i{position:absolute;inset:0;border-radius:50%;border:3px solid transparent;border-top-color:var(--acc);animation:spin 1.1s linear infinite}",
    ".lrings i:nth-child(2){inset:16px;border-top-color:var(--acc2);animation-duration:1.6s;animation-direction:reverse}",
    ".lrings i:nth-child(3){inset:32px;border-top-color:var(--acc);animation-duration:.8s}",
    "@keyframes spin{to{transform:rotate(360deg)}}",
    ".lhearts span{font-size:30px;display:inline-block;margin:0 4px;animation:bob 1s ease-in-out infinite}",
    ".lhearts span:nth-child(2){animation-delay:.15s}.lhearts span:nth-child(3){animation-delay:.3s}.lhearts span:nth-child(4){animation-delay:.45s}.lhearts span:nth-child(5){animation-delay:.6s}",
    ".lcandles{display:flex;gap:16px}",
    ".lc{width:9px;height:42px;border-radius:3px;background:repeating-linear-gradient(45deg,#fff 0 5px,var(--acc2) 5px 10px);position:relative}",
    ".lc i{position:absolute;left:50%;top:-19px;transform:translateX(-50%) scale(0);width:14px;height:20px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 78%,#fff6b7 0 22%,#ffd166 42%,#ff8c42 78%,#ff5e3a 100%);transition:transform .3s}",
    ".lc i.lit{transform:translateX(-50%) scale(1)}",
    "#typeTxt{font-family:" + th.fd + ";font-size:30px;font-weight:700;color:var(--acc);min-height:40px}",
    "#loadBalloon{font-size:34px;transition:transform .2s ease;display:inline-block}",
    /* page */
    "#page{max-width:540px;margin:0 auto;padding:26px 16px 50px;position:relative;z-index:2}",
    ".hero{text-align:center;padding:32px 22px 28px}",
    ".hero .script{font-family:'Dancing Script',cursive;font-size:27px;color:var(--acc2)}",
    ".hero .bname{font-family:" + th.fd + ";font-size:clamp(36px,10vw,52px);font-weight:700;line-height:1.12;color:var(--ink);margin-top:2px}",
    ".hero .fromline{color:var(--mut);font-weight:600;margin-top:12px;line-height:1.6}",
    /* gallery */
    ".gal{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3.4;background:rgba(127,127,127,.15)}",
    ".gal .slide{position:absolute;inset:0;opacity:0;transition:opacity .8s ease}",
    ".gal .slide.active{opacity:1}",
    ".gal img{width:100%;height:100%;object-fit:cover;display:block}",
    ".gal .slide.active img{animation:kb 6s ease forwards}",
    "@keyframes kb{from{transform:scale(1)}to{transform:scale(1.07)}}",
    ".gnav{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;border:none;background:rgba(0,0,0,.45);color:#fff;font-size:23px;cursor:pointer;z-index:3;line-height:1}",
    ".gnav.prev{left:9px}.gnav.next{right:9px}",
    ".gdots{display:flex;gap:7px;justify-content:center;margin-top:11px}",
    ".gdot{width:8px;height:8px;border-radius:50%;background:rgba(127,127,127,.4);transition:all .25s}",
    ".gdot.on{background:var(--acc);transform:scale(1.3)}",
    ".ghint{color:var(--mut);font-size:12.5px;font-weight:600;text-align:center;margin-top:7px}",
    /* cake */
    ".candles{display:flex;justify-content:center;gap:22px}",
    ".candle{width:7px;height:36px;border-radius:3px;background:repeating-linear-gradient(45deg,#fff 0 5px,var(--acc2) 5px 10px);position:relative}",
    ".flame{position:absolute;left:50%;top:-17px;transform:translateX(-50%);width:13px;height:18px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 78%,#fff6b7 0 22%,#ffd166 42%,#ff8c42 78%,#ff5e3a 100%);animation:flick .28s ease-in-out infinite alternate;transform-origin:bottom center}",
    "@keyframes flick{from{transform:translateX(-50%) scale(1) rotate(-2.5deg)}to{transform:translateX(-50%) scale(1.1,1.18) rotate(2.5deg)}}",
    ".flame.out{animation:smokeOut .5s ease forwards}",
    "@keyframes smokeOut{to{transform:translateX(-50%) translateY(-13px) scale(.3);opacity:0}}",
    ".clayer{margin:5px auto 0;border-radius:12px;position:relative}",
    ".clayer::before{content:'';position:absolute;top:0;left:0;right:0;height:12px;border-radius:12px 12px 8px 8px;background:rgba(255,255,255,.3)}",
    ".cl1{width:116px;height:40px;background:" + th.cake[0] + "}",
    ".cl2{width:166px;height:46px;background:" + th.cake[1] + "}",
    ".cl3{width:214px;height:52px;background:" + th.cake[2] + "}",
    ".plate{width:248px;height:18px;margin:8px auto 0;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.4),rgba(127,127,127,.12) 70%);box-shadow:0 12px 22px rgba(0,0,0,.28)}",
    "#slice{font-size:36px;opacity:0;transform:translateX(-14px);transition:all .55s ease;display:inline-block}",
    "#slice.show{opacity:1;transform:none}",
    ".btnrow{display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap}",
    "#cakeMsg{margin-top:11px;font-weight:700;color:var(--acc2);text-align:center;min-height:22px}",
    /* gift + letter */
    ".giftbtn{width:104px;height:104px;border-radius:50%;border:2px dashed var(--acc);background:transparent;font-size:50px;cursor:pointer;animation:bob 2.2s ease-in-out infinite}",
    "#giftMsg{max-height:0;overflow:hidden;transition:max-height .7s ease,margin .7s}",
    "#giftMsg.show{max-height:600px;margin-top:14px}",
    ".lettercard{background:" + (th.dark ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.65)") + ";border:1.5px dashed var(--acc2);border-radius:14px;padding:20px 18px}",
    ".lettercard p{margin-bottom:10px}",
    ".sig{font-family:'Dancing Script',cursive;font-size:24px;color:var(--acc2);margin-top:8px}",
    ".badge2{display:inline-block;margin-top:26px;background:var(--card);border:1.5px solid var(--acc);padding:7px 16px;border-radius:999px;font-size:12.5px;font-weight:700;color:var(--mut)}",
    ".center{text-align:center}",
    "#confetti{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60}",
    "#sndBtn{position:fixed;top:14px;right:14px;z-index:9;width:44px;height:44px;border-radius:50%;border:1.5px solid var(--acc);background:var(--card);font-size:19px;cursor:pointer}",
    "#partyBtn{position:fixed;right:16px;bottom:20px;z-index:7;width:58px;height:58px;border-radius:50%;border:none;font-size:27px;cursor:pointer;background:linear-gradient(135deg,var(--acc),var(--acc2));box-shadow:0 12px 26px rgba(0,0,0,.3);animation:bob 2.2s ease-in-out infinite}",
    "#partyBanner{position:fixed;left:50%;top:16px;transform:translate(-50%,-90px);z-index:8;background:linear-gradient(92deg,var(--acc),var(--acc2));color:#fff;font-weight:700;font-size:16.5px;padding:12px 22px;border-radius:999px;box-shadow:0 14px 30px rgba(0,0,0,.3);transition:transform .55s cubic-bezier(.2,1.4,.4,1);max-width:92vw;text-align:center}",
    "#partyBanner.show{transform:translate(-50%,0)}"
  , "@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}"
].join("\n");

  var gateIcon = decoArr.length ? decoArr[0] : "🎂";
  var html =
'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<meta name="robots" content="noindex,nofollow">' +
'<title>' + O2.title + ' ' + esc(name) + ' ' + O2.emoji + '</title>' +
'<link rel="preconnect" href="https://fonts.googleapis.com">' +
'<link href="' + fontUrl(th) + '" rel="stylesheet">' +
'<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">' +
'<style>' + css + '</style></head>' +
'<body data-pin="' + th.pin + '">' +
decoHtml +
'<canvas id="confetti" aria-hidden="true"></canvas>' +
/* gate */
'<section id="gate"><div class="card gcard" id="gcard">' +
'<div class="gico">' + gateIcon + '</div>' +
'<h1>A surprise is waiting for ' + esc(name) + '</h1>' +
'<p class="gsub">This little page was made only for you.<br>Enter the secret PIN to open it.</p>' +
gateBalloon + pinDots +
'<input class="pin-field" id="pinField" type="tel" inputmode="numeric" maxlength="4" placeholder="••••" autocomplete="off">' +
'<br><button class="bigbtn" id="unlockBtn">Unlock my surprise 🔓</button>' +
'<div class="gerr" id="gerr"></div>' +
'</div></section>' +
/* loader */
'<section id="loader" class="hidden">' + loadInner +
'<div id="loadPct">0%</div><p id="loadMsg">Getting your surprise ready…</p></section>' +
/* page */
'<main id="page" class="hidden">' +
'<div class="card hero rv">' +
'<div style="font-size:30px;letter-spacing:7px">' + O2.hero + '</div>' +
(th.script ? '<div class="script">' + O2.script + '</div>' : '') +
'<div class="bname">' + O2.headline + '<br>' + esc(name) + '!</div>' +
'<p class="fromline">With love and a hundred good wishes,<br>from <b>' + esc(from) + '</b> 💌</p>' +
'</div>' +
galHtml +
'<section class="card rv"><h2>💖 A wish for you</h2>' + wishParas + '</section>' +
'<section class="card rv"><h2 class="center">🎂 Make a wish…</h2>' +
'<div style="height:16px"></div><div class="candles">' +
'<div class="candle"><span class="flame"></span></div>'.repeat(5) +
'</div>' +
'<div class="clayer cl1"></div><div class="clayer cl2"></div><div class="clayer cl3"></div><div class="plate"></div>' +
'<div class="center"><span id="slice">🍰</span></div>' +
'<div class="btnrow"><button class="bigbtn" id="blowBtn" style="margin-top:0">💨 Blow All</button>' +
'<button class="ghostbtn" id="cutBtn">🔪 Cut the Cake</button></div>' +
'<p id="cakeMsg"></p></section>' +
'<section class="card center rv"><h2>🎁 A gift box for you</h2>' +
'<button class="giftbtn" id="giftBtn" type="button">🎁</button>' +
'<p style="color:var(--mut);font-weight:600">Tap the box to open it</p>' +
'<div id="giftMsg"><p style="text-align:left">' + esc(d.gift) + '</p></div></section>' +
'<section class="card rv"><h2>💌 A letter for you</h2><div class="lettercard">' + letterParas +
'<div class="sig">— ' + esc(from) + '</div></div></section>' +
'<div class="center rv"><span class="badge2">✦ Made with WishLink</span><br><button id="wlReport" type="button" style="margin-top:12px;background:none;border:1.5px solid var(--acc);color:var(--mut);font-size:12px;font-weight:700;padding:7px 14px;border-radius:999px;cursor:pointer;font-family:inherit">🚩 Report this page</button></div>' +
'</main>' +
'<button id="sndBtn" title="Sound on/off">🔊</button>' +
'<button id="partyBtn" class="hidden" title="Party!">🎉</button>' +
'<div id="partyBanner">🎉 ' + O2.headline + ' ' + esc(name) + '! ' + O2.emoji + '</div>' +
'<script>var D = ' + JSON.stringify({ name: name, pin: String(d.pin || "surprise"), load: th.load, pinStyle: th.pin, unlocked: !!d.unlocked }) + ';\n' +
pageScript2(O2.speak, O2.type) +
'</scr' + 'ipt></body></html>';
  return html;
}

function pageScript2(speakPrefix, typeText){
  return `
/* ===== sound (synthesized, no files) ===== */
var AC = null, soundOn = true;
function ac(){ if(!soundOn) return null; if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(AC.state==='suspended') AC.resume(); return AC; }
function tone(f, dl, dur, type, vol){ var c = ac(); if(!c) return; var t0 = c.currentTime + (dl||0); var o = c.createOscillator(), g = c.createGain(); o.type = type||'sine'; o.frequency.setValueAtTime(f, t0); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(vol||.15, t0+.02); g.gain.exponentialRampToValueAtTime(.0001, t0+dur); o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0+dur+.05); }
function noiseBurst(dur, freq, vol){ var c = ac(); if(!c) return; var len = Math.floor(c.sampleRate*dur); var buf = c.createBuffer(1, len, c.sampleRate); var ch = buf.getChannelData(0); for(var i=0;i<len;i++) ch[i] = (Math.random()*2-1)*(1-i/len); var s = c.createBufferSource(); s.buffer = buf; var f = c.createBiquadFilter(); f.type='bandpass'; f.frequency.value = freq||700; var g = c.createGain(); g.gain.value = vol||.4; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); }
function popSnd(){ tone(340, 0, .16, 'square', .12, 0); noiseBurst(.08, 1400, .35); }
function chimeSnd(){ tone(1318,0,.35,'sine',.12); tone(1975,.09,.45,'sine',.1); }
function whooshSnd(){ noiseBurst(.6, 480, .28); }
function tadaSnd(){ [523,659,784,1046].forEach(function(f,i){ tone(f, i*.09, .4, 'triangle', .14); }); }
var MELODY = [[392,.75],[392,.25],[440,1],[392,1],[523,1],[494,1.75],[0,.25],[392,.75],[392,.25],[440,1],[392,1],[587,1],[523,2]];
function playMelody(){ var beat = .30, at = .05; MELODY.forEach(function(n){ if(n[0]>0){ tone(n[0], at, n[1]*beat*.96, 'triangle', .15); tone(n[0]/2, at, n[1]*beat*.96, 'sine', .05); } at += n[1]*beat; }); }
function speakWish(){ if(!soundOn || !('speechSynthesis' in window)) return; try{ speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(${JSON.stringify(speakPrefix || "Happy Birthday, ")} + D.name + '!'); u.rate = .96; u.pitch = 1.12; var vs = speechSynthesis.getVoices(); var en = vs.filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf('en')===0; }); if(en.length) u.voice = en[0]; speechSynthesis.speak(u); }catch(e){} }
document.getElementById('sndBtn').addEventListener('click', function(){ soundOn = !soundOn; this.textContent = soundOn ? '🔊' : '🔇'; if(soundOn){ ac(); chimeSnd(); } else if('speechSynthesis' in window){ speechSynthesis.cancel(); } });

/* ===== confetti (canvas, burst only) ===== */
var canvas = document.getElementById('confetti'), ctx = canvas.getContext('2d'), pieces = [], raf = null;
function sizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
sizeCanvas(); addEventListener('resize', sizeCanvas);
var COLORS = ['#ff5e8a','#ffb703','#4cc9f0','#80ed99','#b388ff','#ff8c42'];
function burst(n){
  for(var i=0;i<n;i++){ pieces.push({ x: innerWidth/2 + (Math.random()-.5)*innerWidth*.7, y: -20 - Math.random()*innerHeight*.25, w: 5+Math.random()*6, h: 8+Math.random()*8, vy: 2.2+Math.random()*2.6, vx: (Math.random()-.5)*1.6, r: Math.random()*Math.PI, vr: (Math.random()-.5)*.25, c: COLORS[Math.floor(Math.random()*COLORS.length)] }); }
  if(!raf) loop();
}
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces = pieces.filter(function(p){ return p.y < innerHeight + 30; });
  pieces.forEach(function(p){ p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore(); });
  if(pieces.length){ raf = requestAnimationFrame(loop); } else { ctx.clearRect(0,0,canvas.width,canvas.height); raf = null; }
}

/* ===== PIN gate ===== */
var pinField = document.getElementById('pinField');
var pdots = document.querySelectorAll('#pdots span');
function syncPinUI(){
  var v = pinField.value;
  pdots.forEach(function(s, i){
    if(D.pinStyle === 'hearts'){ s.textContent = i < v.length ? '❤' : '♡'; s.classList.toggle('on', i < v.length); }
    else { s.classList.toggle('on', i < v.length); }
  });
  var gb = document.getElementById('gateBalloon');
  if(gb) gb.style.transform = 'scale(' + (1 + v.length * .22) + ')';
  var lf = document.getElementById('lFill'); if(lf && D.load === 'bar') lf.style.width = '0%';
}
pinField.addEventListener('input', function(){
  pinField.value = pinField.value.replace(/[^0-9]/g,'').slice(0,4);
  document.getElementById('gerr').textContent = '';
  var pd = document.getElementById('pdots'); if(pd) pd.classList.remove('err');
  syncPinUI();
});
pinField.focus();
document.getElementById('unlockBtn').addEventListener('click', function(){
  if(pinField.value === String(D.pin)){
    chimeSnd(); burst(60);
    if('speechSynthesis' in window){ speechSynthesis.getVoices(); }
    setTimeout(startLoading, 500);
  } else {
    document.getElementById('gerr').textContent = 'That is not the right PIN — try again 💛';
    var pd = document.getElementById('pdots'); if(pd) pd.classList.add('err');
    var gc = document.getElementById('gcard'); gc.classList.remove('shake'); void gc.offsetWidth; gc.classList.add('shake');
  }
});

/* ===== loader (style per theme) ===== */
var LOAD_MSGS = ['Getting your surprise ready…','Adding a little magic…','Lighting the candles…','Almost there…'];
function startLoading(){
  document.getElementById('gate').classList.add('hidden');
  var loader = document.getElementById('loader'); loader.classList.remove('hidden');
  var pct = 0, mi = 0;
  var typeFull = ${JSON.stringify(typeText || "Happy Birthday!")};
  var msgIv = setInterval(function(){ mi = Math.min(mi+1, LOAD_MSGS.length-1); document.getElementById('loadMsg').textContent = LOAD_MSGS[mi]; }, 620);
  var iv = setInterval(function(){
    pct += Math.ceil(Math.random()*7) + 2;
    if(pct >= 100){
      pct = 100; clearInterval(iv); clearInterval(msgIv);
      if(D.load === 'balloon') popSnd();
      setTimeout(showPage, 380);
    }
    document.getElementById('loadPct').textContent = pct + '%';
    if(D.load === 'bar'){ var f = document.getElementById('lFill'); if(f) f.style.width = pct + '%'; }
    if(D.load === 'candles'){ document.querySelectorAll('.lc i').forEach(function(fl, i){ fl.classList.toggle('lit', pct >= (i+1)*20); }); }
    if(D.load === 'type'){ var tt = document.getElementById('typeTxt'); if(tt) tt.textContent = typeFull.slice(0, Math.ceil(typeFull.length * pct / 100)); }
    if(D.load === 'balloon'){ var lb = document.getElementById('loadBalloon'); if(lb) lb.style.transform = 'scale(' + (0.6 + pct/100 * 1.9) + ')'; }
  }, 110);
}
function showPage(){
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('page').classList.remove('hidden');
  document.getElementById('partyBtn').classList.remove('hidden');
  window.scrollTo(0,0);
  burst(50);
  initReveal(); initGallery();
  playMelody(); speakWish();
}

/* ===== reveal ===== */
function initReveal(){
  var io = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, {threshold:.08});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
}

/* ===== gallery: auto-slide + swipe ===== */
var gIdx = 0, gTimer = null, gHoldUntil = 0;
function gGo(n){
  var slides = document.querySelectorAll('#gal .slide'); if(!slides.length) return;
  gIdx = ((n % slides.length) + slides.length) % slides.length;
  slides.forEach(function(s, i){ s.classList.toggle('active', i === gIdx); });
  document.querySelectorAll('.gdot').forEach(function(dd, i){ dd.classList.toggle('on', i === gIdx); });
}
function initGallery(){
  var gal = document.getElementById('gal'); if(!gal) return;
  var slides = gal.querySelectorAll('.slide'); if(slides.length < 2) return;
  gTimer = setInterval(function(){ if(!document.hidden && Date.now() > gHoldUntil) gGo(gIdx + 1); }, 3000);
  function hold(){ gHoldUntil = Date.now() + 6000; }
  var nx = document.getElementById('gNext'), pv = document.getElementById('gPrev');
  if(nx) nx.addEventListener('click', function(){ hold(); gGo(gIdx + 1); });
  if(pv) pv.addEventListener('click', function(){ hold(); gGo(gIdx - 1); });
  var sx = null;
  gal.addEventListener('pointerdown', function(e){ sx = e.clientX; });
  gal.addEventListener('pointerup', function(e){
    if(sx === null) return;
    var dx = e.clientX - sx; sx = null;
    if(Math.abs(dx) > 38){ hold(); gGo(gIdx + (dx < 0 ? 1 : -1)); }
  });
}

/* ===== cake ===== */
var blown = false;
document.getElementById('blowBtn').addEventListener('click', function(){
  document.querySelectorAll('.flame').forEach(function(f, i){ setTimeout(function(){ f.classList.add('out'); }, i*110); });
  blown = true; whooshSnd();
  document.getElementById('cakeMsg').textContent = 'Candles out! Your wish is on its way to the stars ✨';
});
document.getElementById('cutBtn').addEventListener('click', function(){
  if(!blown){ document.getElementById('cakeMsg').textContent = 'First blow the candles out — tap Blow All 💨'; return; }
  document.getElementById('slice').classList.add('show');
  document.getElementById('cakeMsg').textContent = 'Cake cut! The first slice is yours 🍰';
  tadaSnd(); burst(40);
});

/* ===== gift ===== */
var gOpened = false;
document.getElementById('giftBtn').addEventListener('click', function(){
  if(gOpened) return; gOpened = true;
  tadaSnd(); burst(36);
  document.getElementById('giftMsg').classList.add('show');
  this.textContent = '💝';
});

/* ===== report ===== */
var wlRb2 = document.getElementById('wlReport');
if(wlRb2){ wlRb2.addEventListener('click', function(){
  if(!window.__WL_SLUG__){ wlRb2.textContent = '🚩 Reports work on shared links'; return; }
  wlRb2.disabled = true; wlRb2.textContent = 'Reporting…';
  fetch('/api/report', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug: window.__WL_SLUG__ }) })
    .then(function(r){ wlRb2.textContent = r.ok ? '🚩 Reported — thank you ✓' : '🚩 Could not report'; })
    .catch(function(){ wlRb2.textContent = '🚩 Could not report'; });
}); }

/* ===== server-unlocked: skip the gate, go straight to the celebration ===== */
if(D.unlocked){ var gEl = document.getElementById('gate'); if(gEl) gEl.classList.add('hidden'); startLoading(); }

/* ===== party ===== */
document.getElementById('partyBtn').addEventListener('click', function(){
  burst(70); tadaSnd();
  var bn = document.getElementById('partyBanner');
  bn.classList.add('show');
  setTimeout(function(){ bn.classList.remove('show'); }, 2600);
});
`;
}

function renderPage(d){
  if(d && d.t && d.t !== "classic" && THEMES[d.t]) return buildPage2(d, THEMES[d.t]);
  return buildPage(d, "free");
}

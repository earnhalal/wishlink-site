/* WishLink language switcher — English (source) / Roman Urdu / اردو / हिन्दी.
   Translates visible UI text in place: every text node whose trimmed text
   matches a dictionary key is swapped; originals are remembered so switching
   back to English restores the page exactly. Choice persists in
   localStorage "wl_lang". WL_T(key) serves the few strings the page's own
   scripts build at runtime (step label, WhatsApp message, PIN note). */
(function () {
  var DICT = {
    /* ---- header / footer / shell ---- */
    "Home": { r: "Home", u: "ہوم", h: "होम" },
    "Make a page": { r: "Page banao", u: "پیج بنائیں", h: "पेज बनाएं" },
    "Designs": { r: "Designs", u: "ڈیزائن", h: "डिज़ाइन" },
    "Track My Pages": { r: "Mere Pages ki Tracking", u: "میرے پیجز کی ٹریکنگ", h: "मेरे पेजों की ट्रैकिंग" },
    "📊 Track My Pages": { r: "📊 Mere Pages ki Tracking", u: "📊 میرے پیجز کی ٹریکنگ", h: "📊 मेरे पेजों की ट्रैकिंग" },
    "Blog": { r: "Blog", u: "بلاگ", h: "ब्लॉग" },
    "About": { r: "Hamare bare mein", u: "ہمارے بارے میں", h: "हमारे बारे में" },
    "Contact": { r: "Rabta", u: "رابطہ", h: "संपर्क" },
    "Privacy": { r: "Privacy", u: "پرائیویسی", h: "प्राइवेसी" },
    "Terms": { r: "Sharait", u: "شرائط", h: "शर्तें" },
    "Maker": { r: "Maker", u: "میکر", h: "मेकर" },
    "Photo Studio": { r: "Photo Studio", u: "فوٹو اسٹوڈیو", h: "फोटो स्टूडियो" },
    "Delete a page": { r: "Page delete karo", u: "پیج ڈیلیٹ کریں", h: "पेज डिलीट करें" },
    "BIRTHDAY SURPRISE PAGES": { r: "BIRTHDAY SURPRISE PAGES", u: "برتھ ڈے سرپرائز پیجز", h: "बर्थडे सरप्राइज़ पेज" },
    "© 2026 WishLink — made with 💛 for birthdays.": { r: "© 2026 WishLink — birthdays ke liye 💛 ke sath banaya gaya.", u: "© 2026 WishLink — برتھ ڈے کے لیے 💛 کے ساتھ بنایا گیا۔", h: "© 2026 WishLink — बर्थडे के लिए 💛 के साथ बनाया गया।" },
    /* ---- hero ---- */
    "A birthday page they will": { r: "Ek birthday page jo wo", u: "ایک برتھ ڈے پیج جو وہ", h: "एक बर्थडे पेज जो वे" },
    "never forget": { r: "kabhi nahi bhoolein ge", u: "کبھی نہیں بھولیں گے", h: "कभी नहीं भूलेंगे" },
    "WishLink turns a name, a wish and a few photos into a magical little web page — locked with a secret PIN, opened with one simple link.": { r: "WishLink ek naam, ek wish aur chand photos ko ek jadooi chhote se web page mein badal deta hai — khufiya PIN ke sath band, ek asan link se khulta hai.", u: "WishLink ایک نام، ایک وش اور چند فوٹوز کو ایک جادوئی چھوٹے سے ویب پیج میں بدل دیتا ہے — خفیہ پن کے ساتھ بند، ایک آسان لنک سے کھلتا ہے۔", h: "WishLink एक नाम, एक विश और कुछ फोटो को एक जादुई छोटे वेब पेज में बदल देता है — गुप्त PIN के साथ बंद, एक आसान लिंक से खुलता है।" },
    "✨ Create your free page": { r: "✨ Apna muft page banao", u: "✨ اپنا مفت پیج بنائیں", h: "✨ अपना मुफ़्त पेज बनाएं" },
    "✅ 100% free": { r: "✅ 100% muft", u: "✅ 100% مفت", h: "✅ 100% मुफ़्त" },
    "🔒 Secret PIN lock": { r: "🔒 Khufiya PIN lock", u: "🔒 خفیہ پن لاک", h: "🔒 गुप्त PIN लॉक" },
    "📸 Photo gallery": { r: "📸 Photo gallery", u: "📸 فوٹو گیلری", h: "📸 फोटो गैलरी" },
    "🎨 15 designs": { r: "🎨 15 designs", u: "🎨 15 ڈیزائن", h: "🎨 15 डिज़ाइन" },
    "🚫 No app. No sign-up.": { r: "🚫 Na app. Na sign-up.", u: "🚫 نہ ایپ، نہ سائن اپ۔", h: "🚫 न ऐप, न साइन-अप।" },
    "▶ Live Demo": { r: "▶ Live Demo", u: "▶ لائیو ڈیمو", h: "▶ लाइव डेमो" },
    "📸 Photo Frame Studio": { r: "📸 Photo Frame Studio", u: "📸 فوٹو فریم اسٹوڈیو", h: "📸 फोटो फ्रेम स्टूडियो" },
    "📊 Track My Pages — see who opened your surprise": { r: "📊 Mere Pages ki Tracking — dekho kis ne surprise khola", u: "📊 میرے پیجز کی ٹریکنگ — دیکھیں کس نے سرپرائز کھولا", h: "📊 मेरे पेजों की ट्रैकिंग — देखें किसने सरप्राइज़ खोला" },
    "See a real surprise page, exactly as your friend will open it.": { r: "Ek asal surprise page dekho, bilkul waisa jaisa tumhara dost khole ga.", u: "ایک اصل سرپرائز پیج دیکھیں، بالکل ویسا جیسا آپ کا دوست کھولے گا۔", h: "एक असली सरप्राइज़ पेज देखें, बिल्कुल वैसा जैसा आपका दोस्त खोलेगा।" },
    /* ---- designs section ---- */
    "🎨 15 designs — tap one to start with it": { r: "🎨 15 designs — kisi ek par tap karke shuru karo", u: "🎨 15 ڈیزائن — کسی ایک پر ٹیپ کر کے شروع کریں", h: "🎨 15 डिज़ाइन — किसी एक पर टैप करके शुरू करें" },
    "Every design has its own colours, PIN screen, loading style, music and cake.": { r: "Har design ke apne rang, PIN screen, loading style, music aur cake hai.", u: "ہر ڈیزائن کے اپنے رنگ، پن اسکرین، لوڈنگ اسٹائل، میوزک اور کیک ہے۔", h: "हर डिज़ाइन के अपने रंग, PIN स्क्रीन, लोडिंग स्टाइल, संगीत और केक हैं।" },
    "Midnight Gold": { r: "Midnight Gold", u: "مڈ نائٹ گولڈ", h: "मिडनाइट गोल्ड" },
    "The timeless classic": { r: "Hamesha ka classic", u: "ہمیشہ کا کلاسک", h: "हमेशा का क्लासिक" },
    "Pastel Sky": { r: "Pastel Sky", u: "پیسٹل اسکائی", h: "पेस्टल स्काई" },
    "Soft & dreamy": { r: "Narm aur khwabon jaisa", u: "نرم اور خوابوں جیسا", h: "नरम और सपनों जैसा" },
    "Neon Galaxy": { r: "Neon Galaxy", u: "نیون گیلیکسی", h: "नियॉन गैलेक्सी" },
    "Bold night glow": { r: "Raat ki tez roshni", u: "رات کی تیز روشنی", h: "रात की तेज़ चमक" },
    "Rose Royal": { r: "Rose Royal", u: "روز رائل", h: "रोज़ रॉयल" },
    "Romantic roses": { r: "Romantic gulab", u: "رومانٹک گلاب", h: "रोमांटिक गुलाब" },
    "Ocean Breeze": { r: "Ocean Breeze", u: "اوشن بریز", h: "ओशन ब्रीज़" },
    "Fresh sea air": { r: "Samandar ki taza hawa", u: "سمندر کی تازہ ہوا", h: "समंदर की ताज़ा हवा" },
    "Sunset Peach": { r: "Sunset Peach", u: "سن سیٹ پیچ", h: "सनसेट पीच" },
    "Warm golden hour": { r: "Garam sunehri shaam", u: "گرم سنہری شام", h: "गरम सुनहरी शाम" },
    "Lavender Dream": { r: "Lavender Dream", u: "لیونڈر ڈریم", h: "लैवेंडर ड्रीम" },
    "Calm & gentle": { r: "Sukoon aur narmi", u: "سکون اور نرمی", h: "सुकून और नरमी" },
    "Emerald Royal": { r: "Emerald Royal", u: "ایمرالڈ رائل", h: "एमराल्ड रॉयल" },
    "Rich & elegant": { r: "Shaandar aur purwaqar", u: "شاندار اور پروقار", h: "शानदार और भव्य" },
    "Candy Pop": { r: "Candy Pop", u: "کینڈی پاپ", h: "कैंडी पॉप" },
    "Sweet & playful": { r: "Meetha aur shararti", u: "میٹھا اور شرارتی", h: "मीठा और शरारती" },
    "Vintage Paper": { r: "Vintage Paper", u: "ونٹیج پیپر", h: "विंटेज पेपर" },
    "Old-letter charm": { r: "Purane khat ki khushboo", u: "پرانے خط کی خوشبو", h: "पुराने पत्र का आकर्षण" },
    "Cherry Noir": { r: "Cherry Noir", u: "چیری نوار", h: "चेरी नॉयर" },
    "Dark & dramatic": { r: "Gehra aur dramatic", u: "گہرا اور ڈرامائی", h: "गहरा और ड्रामाटिक" },
    "Sky Mint": { r: "Sky Mint", u: "اسکائی منٹ", h: "स्काई मिंट" },
    "Light & fresh": { r: "Halka aur taza", u: "ہلکا اور تازہ", h: "हल्का और ताज़ा" },
    "Royal Purple": { r: "Royal Purple", u: "رائل پرپل", h: "रॉयल पर्पल" },
    "Regal violet": { r: "Shahi jamni", u: "شاہی جامنی", h: "शाही बैंगनी" },
    "Golden Honey": { r: "Golden Honey", u: "گولڈن ہنی", h: "गोल्डन हनी" },
    "Warm & cosy": { r: "Garam aur pur-sukoon", u: "گرم اور پرسکون", h: "गरम और आरामदायक" },
    "Snow White": { r: "Snow White", u: "اسنو وائٹ", h: "स्नो व्हाइट" },
    "Pure & minimal": { r: "Saaf aur sada", u: "صاف اور سادہ", h: "साफ़ और सादा" },
    "🔥 HOT": { r: "🔥 HOT", u: "🔥 ہاٹ", h: "🔥 हॉट" },
    "★ RECOMMENDED": { r: "★ RECOMMENDED", u: "★ تجویز کردہ", h: "★ अनुशंसित" },
    /* ---- steps cards ---- */
    "Fill the little form": { r: "Chhota sa form bharo", u: "چھوٹا سا فارم بھریں", h: "छोटा सा फॉर्म भरें" },
    "Their name, your name, a wish and a letter — ready-made wishes and letters are built in, edit them any way you like.": { r: "Un ka naam, tumhara naam, ek wish aur ek letter — tayyar wishes aur letters andar mojood hain, jaise chaho badal lo.", u: "ان کا نام، آپ کا نام، ایک وش اور ایک خط — تیار وشز اور خطوط اندر موجود ہیں، جیسے چاہیں بدل لیں۔", h: "उनका नाम, आपका नाम, एक विश और एक पत्र — तैयार विश और पत्र अंदर मौजूद हैं, जैसे चाहें बदल लें।" },
    "Get your link": { r: "Apna link lo", u: "اپنا لنک لیں", h: "अपना लिंक लें" },
    "One tap creates your page link. Send it on WhatsApp, Messenger — anywhere. Prefer a file? Download the page instead.": { r: "Ek tap se tumhare page ka link ban jata hai. WhatsApp, Messenger — kahin bhi bhej do. File chahiye? Page download bhi kar sakte ho.", u: "ایک ٹیپ سے آپ کے پیج کا لنک بن جاتا ہے۔ واٹس ایپ، میسنجر — کہیں بھی بھیج دیں۔ فائل چاہیے؟ پیج ڈاؤن لوڈ بھی کر سکتے ہیں۔", h: "एक टैप से आपके पेज का लिंक बन जाता है। WhatsApp, Messenger — कहीं भी भेज दें। फ़ाइल चाहिए? पेज डाउनलोड भी कर सकते हैं।" },
    "They open the surprise": { r: "Wo surprise kholein ge", u: "وہ سرپرائز کھولیں گے", h: "वे सरप्राइज़ खोलेंगे" },
    "They type the secret PIN and the celebration begins — confetti, cake, photos, gift and your letter.": { r: "Wo khufiya PIN dalein ge aur jashn shuru — confetti, cake, photos, gift aur tumhara letter.", u: "وہ خفیہ پن ڈالیں گے اور جشن شروع — کنفیٹی، کیک، فوٹوز، گفٹ اور آپ کا خط۔", h: "वे गुप्त PIN डालेंगे और जश्न शुरू — कंफ़ेटी, केक, फोटो, गिफ़्ट और आपका पत्र।" }
  };
  var DICT2 = {
    /* ---- maker ---- */
    "🎂 Birthday Surprise Maker": { r: "🎂 Birthday Surprise Maker", u: "🎂 برتھ ڈے سرپرائز میکر", h: "🎂 बर्थडे सरप्राइज़ मेकर" },
    "⏱ Takes about 30 seconds — the wish, letter and PIN are already filled in for you. Just add two names and tap Create.": { r: "⏱ Sirf 30 second lagte hain — wish, letter aur PIN pehle se bhare hue hain. Bas do naam likho aur Create dabao.", u: "⏱ صرف 30 سیکنڈ لگتے ہیں — وش، خط اور پن پہلے سے بھرے ہوئے ہیں۔ بس دو نام لکھیں اور Create دبائیں۔", h: "⏱ सिर्फ़ 30 सेकंड लगते हैं — विश, पत्र और PIN पहले से भरे हुए हैं। बस दो नाम लिखें और Create दबाएं।" },
    "Step 1 of 2 · Names & design": { r: "Step 1 of 2 · Naam aur design", u: "مرحلہ 1 از 2 · نام اور ڈیزائن", h: "चरण 1 / 2 · नाम और डिज़ाइन" },
    "Step 2 of 2 · Wish, photos & PIN": { r: "Step 2 of 2 · Wish, photos aur PIN", u: "مرحلہ 2 از 2 · وش، فوٹوز اور پن", h: "चरण 2 / 2 · विश, फोटो और PIN" },
    "Birthday person's name": { r: "Jis ki birthday hai us ka naam", u: "جس کی برتھ ڈے ہے اس کا نام", h: "जिसका बर्थडे है उसका नाम" },
    "Please write their name first — the whole page is built around it.": { r: "Pehle un ka naam likho — pura page isi naam par banta hai.", u: "پہلے ان کا نام لکھیں — پورا پیج اسی نام پر بنتا ہے۔", h: "पहले उनका नाम लिखें — पूरा पेज इसी नाम पर बनता है।" },
    "Your name": { r: "Tumhara naam", u: "آپ کا نام", h: "आपका नाम" },
    "(who is this surprise from?)": { r: "(ye surprise kis ki taraf se hai?)", u: "(یہ سرپرائز کس کی طرف سے ہے؟)", h: "(यह सरप्राइज़ किसकी तरफ़ से है?)" },
    "Choose a design": { r: "Design chuno", u: "ڈیزائن چنیں", h: "डिज़ाइन चुनें" },
    "(15 designs — Midnight Gold is already picked for you; tap another only if you want)": { r: "(15 designs hain — Midnight Gold tumhare liye pehle se chuna hua hai; koi aur chahiye to bas us par tap kar do)", u: "(15 ڈیزائن ہیں — مڈ نائٹ گولڈ آپ کے لیے پہلے سے چنا ہوا ہے؛ کوئی اور چاہیے تو بس اس پر ٹیپ کر دیں)", h: "(15 डिज़ाइन हैं — मिडनाइट गोल्ड आपके लिए पहले से चुना हुआ है; कोई और चाहिए तो बस उस पर टैप कर दें)" },
    "🎨 Change design": { r: "🎨 Design badlo", u: "🎨 ڈیزائن بدلیں", h: "🎨 डिज़ाइन बदलें" },
    "Next: wish, photos & PIN →": { r: "Agla: wish, photos aur PIN →", u: "اگلا: وش، فوٹوز اور پن ←", h: "अगला: विश, फोटो और PIN →" },
    "Birthday wish": { r: "Birthday wish", u: "برتھ ڈے وش", h: "बर्थडे विश" },
    "(already filled in for you — shuffle for another, or write your own)": { r: "(tumhare liye pehle se bhari hui hai — dusri chahiye to Shuffle dabao, ya apni likho)", u: "(آپ کے لیے پہلے سے بھری ہوئی ہے — دوسری چاہیے تو شفل دبائیں، یا اپنی لکھیں)", h: "(आपके लिए पहले से भरी हुई है — दूसरी चाहिए तो Shuffle दबाएं, या अपनी लिखें)" },
    "🔀 Shuffle — show me another wish": { r: "🔀 Shuffle — koi aur wish dikhao", u: "🔀 شفل — کوئی اور وش دکھائیں", h: "🔀 Shuffle — कोई और विश दिखाएं" },
    "Letter": { r: "Letter (khat)", u: "خط", h: "पत्र" },
    "(already filled in too — edit it any way you like)": { r: "(ye bhi bhara hua hai — jaise chaho badal lo)", u: "(یہ بھی بھرا ہوا ہے — جیسے چاہیں بدل لیں)", h: "(यह भी भरा हुआ है — जैसे चाहें बदल लें)" },
    "🎨 Change style — 11 wish styles · 5 letters": { r: "🎨 Style badlo — 11 wish styles · 5 letters", u: "🎨 اسٹائل بدلیں — 11 وش اسٹائل · 5 خطوط", h: "🎨 स्टाइल बदलें — 11 विश स्टाइल · 5 पत्र" },
    "Wish style": { r: "Wish ka style", u: "وش کا اسٹائل", h: "विश का स्टाइल" },
    "Heartfelt": { r: "Dil se", u: "دل سے", h: "दिल से" },
    "Funny": { r: "Funny", u: "مزاحیہ", h: "मज़ेदार" },
    "Short & Sweet": { r: "Chhoti aur pyaari", u: "چھوٹی اور پیاری", h: "छोटी और प्यारी" },
    "For Brother": { r: "Bhai ke liye", u: "بھائی کے لیے", h: "भाई के लिए" },
    "For Sister": { r: "Behen ke liye", u: "بہن کے لیے", h: "बहन के लिए" },
    "For Friend": { r: "Dost ke liye", u: "دوست کے لیے", h: "दोस्त के लिए" },
    "For Mother": { r: "Ammi ke liye", u: "امی کے لیے", h: "माँ के लिए" },
    "For Father": { r: "Abbu ke liye", u: "ابو کے لیے", h: "पिता के लिए" },
    "For Girlfriend": { r: "Girlfriend ke liye", u: "گرل فرینڈ کے لیے", h: "गर्लफ्रेंड के लिए" },
    "For Boyfriend": { r: "Boyfriend ke liye", u: "بوائے فرینڈ کے لیے", h: "बॉयफ्रेंड के लिए" },
    "For Bestie": { r: "Bestie ke liye", u: "بیسٹی کے لیے", h: "बेस्टी के लिए" },
    "Letter style": { r: "Letter ka style", u: "خط کا اسٹائل", h: "पत्र का स्टाइल" },
    "Heartfelt Long": { r: "Dil se — lamba", u: "دل سے — لمبا", h: "दिल से — लंबा" },
    "Sweet & Simple": { r: "Pyaara aur sada", u: "پیارا اور سادہ", h: "प्यारा और सादा" },
    "Short & Loving": { r: "Chhota aur mohabbat bhara", u: "چھوٹا اور محبت بھرا", h: "छोटा और प्यार भरा" },
    "Romantic & Sweet": { r: "Romantic aur pyaara", u: "رومانٹک اور پیارا", h: "रोमांटिक और प्यारा" },
    "Bestie Fun": { r: "Bestie fun", u: "بیسٹی فن", h: "बेस्टी फ़न" },
    "💌 Use this letter": { r: "💌 Yehi letter rakho", u: "💌 یہی خط رکھیں", h: "💌 यही पत्र रखें" },
    "Add photos": { r: "Photos lagao", u: "فوٹوز لگائیں", h: "फोटो लगाएं" },
    "(optional — up to 4; they appear as an auto-sliding gallery on the page)": { r: "(marzi hai — zyada se zyada 4; page par khud chalti hui gallery mein nazar ayein gi)", u: "(مرضی ہے — زیادہ سے زیادہ 4؛ پیج پر خود چلتی ہوئی گیلری میں نظر آئیں گی)", h: "(इच्छा हो तो — ज़्यादा से ज़्यादा 4; पेज पर खुद चलती गैलरी में दिखेंगी)" },
    "📸 Photo Frame Studio — frame a photo, or get a 🤖 AI Edit by Laila ✨": { r: "📸 Photo Frame Studio — photo par frame lagao, ya Laila se 🤖 AI Edit karwao ✨", u: "📸 فوٹو فریم اسٹوڈیو — فوٹو پر فریم لگائیں، یا لیلہ سے 🤖 AI ایڈٹ کروائیں ✨", h: "📸 फोटो फ्रेम स्टूडियो — फोटो पर फ्रेम लगाएं, या लैला से 🤖 AI एडिट करवाएं ✨" },
    "Photos are resized in your browser and stored securely with your page on our servers.": { r: "Photos tumhare browser mein hi chhoti hoti hain aur page ke sath hamare server par mehfooz rehti hain.", u: "فوٹوز آپ کے براؤزر میں ہی چھوٹی ہوتی ہیں اور پیج کے ساتھ ہمارے سرور پر محفوظ رہتی ہیں۔", h: "फोटो आपके ब्राउज़र में ही छोटी होती हैं और पेज के साथ हमारे सर्वर पर सुरक्षित रहती हैं।" },
    "Gift-box surprise line": { r: "Gift box ke andar wali line", u: "گفٹ باکس کے اندر والی لائن", h: "गिफ़्ट बॉक्स के अंदर वाली लाइन" },
    "(revealed when they open the gift on the page)": { r: "(jab wo page par gift kholein ge to ye nazar aye gi)", u: "(جب وہ پیج پر گفٹ کھولیں گے تو یہ نظر آئے گی)", h: "(जब वे पेज पर गिफ़्ट खोलेंगे तो यह दिखेगी)" },
    "A promise — I am in your corner, always": { r: "Ek wada — main hamesha tumhare sath hoon", u: "ایک وعدہ — میں ہمیشہ آپ کے ساتھ ہوں", h: "एक वादा — मैं हमेशा आपके साथ हूँ" },
    "My time, my prayers & my best advice, on demand": { r: "Mera waqt, meri duayein aur mera behtareen mashwara — jab chaho", u: "میرا وقت، میری دعائیں اور میرا بہترین مشورہ — جب چاہیں", h: "मेरा समय, मेरी दुआएं और मेरी बेहतरीन सलाह — जब चाहें" },
    "A hug, a smile — and a real gift on its way": { r: "Ek jhappi, ek muskurahat — aur ek asal gift raste mein hai", u: "ایک جھپی، ایک مسکراہٹ — اور ایک اصل گفٹ راستے میں ہے", h: "एक झप्पी, एक मुस्कान — और एक असली गिफ़्ट रास्ते में है" },
    "A wish made just for you": { r: "Ek wish sirf tumhare liye", u: "ایک وش صرف آپ کے لیے", h: "एक विश सिर्फ़ आपके लिए" },
    "Write my own…": { r: "Apni khud likho…", u: "اپنی خود لکھیں…", h: "अपनी खुद लिखें…" },
    "Your own gift line": { r: "Tumhari apni gift line", u: "آپ کی اپنی گفٹ لائن", h: "आपकी अपनी गिफ़्ट लाइन" },
    "Secret PIN": { r: "Khufiya PIN", u: "خفیہ پن", h: "गुप्त PIN" },
    "(4–8 numbers — they type this to open the surprise; we picked one for you, change it if you like)": { r: "(4–8 number — surprise kholne ke liye wo yehi dalein ge; hum ne ek chun diya hai, chaho to badal lo)", u: "(4–8 نمبر — سرپرائز کھولنے کے لیے وہ یہی ڈالیں گے؛ ہم نے ایک چن دیا ہے، چاہیں تو بدل لیں)", h: "(4–8 नंबर — सरप्राइज़ खोलने के लिए वे यही डालेंगे; हमने एक चुन दिया है, चाहें तो बदल लें)" },
    "🎲 New PIN": { r: "🎲 Naya PIN", u: "🎲 نیا پن", h: "🎲 नया PIN" },
    "The PIN must be 4 to 8 numbers (digits only) — it keeps the page safe.": { r: "PIN 4 se 8 number ka hona chahiye (sirf digits) — yehi page ko mehfooz rakhta hai.", u: "پن 4 سے 8 نمبر کا ہونا چاہیے (صرف ہندسے) — یہی پیج کو محفوظ رکھتا ہے۔", h: "PIN 4 से 8 नंबर का होना चाहिए (सिर्फ़ अंक) — यही पेज को सुरक्षित रखता है।" },
    "👁 Preview my page": { r: "👁 Mera page pehle dekho", u: "👁 میرا پیج پہلے دیکھیں", h: "👁 मेरा पेज पहले देखें" },
    "← Back": { r: "← Peeche", u: "پیچھے →", h: "← पीछे" },
    "✨ Create my page": { r: "✨ Mera page banao", u: "✨ میرا پیج بنائیں", h: "✨ मेरा पेज बनाएं" },
    /* ---- result screen ---- */
    "🎉 Your page is ready!": { r: "🎉 Tumhara page tayyar hai!", u: "🎉 آپ کا پیج تیار ہے!", h: "🎉 आपका पेज तैयार है!" },
    "Send the link to the birthday person — and share the PIN with them too.": { r: "Link birthday wale ko bhejo — aur PIN bhi sath bata do.", u: "لنک برتھ ڈے والے کو بھیجیں — اور پن بھی ساتھ بتا دیں۔", h: "लिंक बर्थडे वाले को भेजें — और PIN भी साथ बता दें।" },
    "Your share link": { r: "Tumhara share link", u: "آپ کا شیئر لنک", h: "आपका शेयर लिंक" },
    "Copy": { r: "Copy", u: "کاپی", h: "कॉपी" },
    "Copy PIN": { r: "PIN Copy", u: "پن کاپی", h: "PIN कॉपी" },
    "Include the PIN in the WhatsApp message": { r: "WhatsApp message mein PIN bhi shamil karo", u: "واٹس ایپ پیغام میں پن بھی شامل کریں", h: "WhatsApp संदेश में PIN भी शामिल करें" },
    "💬 Share on WhatsApp": { r: "💬 WhatsApp par share karo", u: "💬 واٹس ایپ پر شیئر کریں", h: "💬 WhatsApp पर शेयर करें" },
    "👀 Open the page": { r: "👀 Page kholo", u: "👀 پیج کھولیں", h: "👀 पेज खोलें" },
    "↺ Make another": { r: "↺ Ek aur banao", u: "↺ ایک اور بنائیں", h: "↺ एक और बनाएं" },
    "⬇ Download the page as an HTML file": { r: "⬇ Page ko HTML file mein download karo", u: "⬇ پیج کو HTML فائل میں ڈاؤن لوڈ کریں", h: "⬇ पेज को HTML फ़ाइल में डाउनलोड करें" },
    "— works offline, send it anywhere.": { r: "— internet ke baghair bhi chalta hai, kahin bhi bhej do.", u: "— انٹرنیٹ کے بغیر بھی چلتا ہے، کہیں بھی بھیج دیں۔", h: "— इंटरनेट के बिना भी चलता है, कहीं भी भेज दें।" },
    "wa_msg": { r: "Maine tumhare liye ek birthday surprise banaya hai 🎁 Yahan kholo: ", u: "میں نے آپ کے لیے ایک برتھ ڈے سرپرائز بنایا ہے 🎁 یہاں کھولیں: ", h: "मैंने आपके लिए एक बर्थडे सरप्राइज़ बनाया है 🎁 यहाँ खोलें: " },
    "pin_note": { r: "🔑 Page is PIN se khulta hai: <b>{pin}</b> — ye sirf birthday wale ko batana.", u: "🔑 پیج اس پن سے کھلتا ہے: <b>{pin}</b> — یہ صرف برتھ ڈے والے کو بتائیں۔", h: "🔑 पेज इस PIN से खुलता है: <b>{pin}</b> — यह सिर्फ़ बर्थडे वाले को बताएं।" },
    /* ---- features ---- */
    "Secret PIN lock": { r: "Khufiya PIN lock", u: "خفیہ پن لاک", h: "गुप्त PIN लॉक" },
    "Every page opens only with a PIN you choose — like a little locked gift box they unlock on their phone.": { r: "Har page sirf usi PIN se khulta hai jo tum chunte ho — bilkul ek chhote band gift box ki tarah, jo wo apne phone par kholein ge.", u: "ہر پیج صرف اسی پن سے کھلتا ہے جو آپ چنتے ہیں — بالکل ایک چھوٹے بند گفٹ باکس کی طرح، جو وہ اپنے فون پر کھولیں گے۔", h: "हर पेज सिर्फ़ उसी PIN से खुलता है जो आप चुनते हैं — बिल्कुल एक छोटे बंद गिफ़्ट बॉक्स की तरह, जो वे अपने फोन पर खोलेंगे।" },
    "Auto-sliding photo gallery": { r: "Khud chalti photo gallery", u: "خود چلتی فوٹو گیلری", h: "खुद चलती फोटो गैलरी" },
    "Add up to 4 photos. On the page they glide by on their own like a slideshow — and a swipe works too.": { r: "4 tak photos lagao. Page par wo khud slideshow ki tarah chalti hain — aur swipe bhi chalta hai.", u: "4 تک فوٹوز لگائیں۔ پیج پر وہ خود سلائیڈ شو کی طرح چلتی ہیں — اور سوائپ بھی چلتا ہے۔", h: "4 तक फोटो लगाएं। पेज पर वे खुद स्लाइडशो की तरह चलती हैं — और स्वाइप भी चलता है।" },
    "Blow & cut the cake": { r: "Cake ki candles bujhao aur cake kato", u: "کیک کی کینڈلز بجھائیں اور کیک کاٹیں", h: "केक की कैंडल बुझाएं और केक काटें" },
    "A cake with real candles to blow out and cut — plus confetti, a hidden gift box and your personal letter.": { r: "Ek cake asal jaisi candles ke sath — bujhana bhi hai, kaatna bhi — sath confetti, chhupa hua gift box aur tumhara letter.", u: "ایک کیک اصل جیسی کینڈلز کے ساتھ — بجھانا بھی ہے، کاٹنا بھی — ساتھ کنفیٹی، چھپا ہوا گفٹ باکس اور آپ کا خط۔", h: "एक केक असली जैसी कैंडल के साथ — बुझाना भी है, काटना भी — साथ कंफ़ेटी, छिपा गिफ़्ट बॉक्स और आपका पत्र।" },
    "Music & a spoken wish": { r: "Music aur boli hui wish", u: "میوزک اور بولی ہوئی وش", h: "संगीत और बोली हुई विश" },
    "The birthday tune plays and the page says “Happy Birthday” out loud in their name. A mute button is always there.": { r: "Birthday wali dhun bajti hai aur page un ke naam ke sath “Happy Birthday” bol kar sunata hai. Mute button hamesha mojood hai.", u: "برتھ ڈے والی دھن بجتی ہے اور پیج ان کے نام کے ساتھ “Happy Birthday” بول کر سناتا ہے۔ میوٹ بٹن ہمیشہ موجود ہے۔", h: "बर्थडे वाली धुन बजती है और पेज उनके नाम के साथ “Happy Birthday” बोलकर सुनाता है। म्यूट बटन हमेशा मौजूद है।" },
    "Wishes & letters built in": { r: "Wishes aur letters andar mojood", u: "وشز اور خطوط اندر موجود", h: "विश और पत्र अंदर मौजूद" },
    "85+ ready wishes and letters for friends, family and partners — pick one, tweak it, or write your own.": { r: "Doston, ghar walon aur partners ke liye 85+ tayyar wishes aur letters — ek chuno, thora badlo, ya apni likho.", u: "دوستوں، گھر والوں اور پارٹنرز کے لیے 85+ تیار وشز اور خطوط — ایک چنیں، تھوڑا بدلیں، یا اپنی لکھیں۔", h: "दोस्तों, घर वालों और पार्टनर्स के लिए 85+ तैयार विश और पत्र — एक चुनें, थोड़ा बदलें, या अपनी लिखें।" },
    "One short link": { r: "Ek chhota link", u: "ایک چھوٹا لنک", h: "एक छोटा लिंक" },
    "Your page gets a short, friendly link with their name in it — perfect for WhatsApp. Or download the page as a file.": { r: "Tumhare page ko ek chhota pyara sa link milta hai jis mein un ka naam hota hai — WhatsApp ke liye behtareen. Ya page ko file mein download kar lo.", u: "آپ کے پیج کو ایک چھوٹا پیارا سا لنک ملتا ہے جس میں ان کا نام ہوتا ہے — واٹس ایپ کے لیے بہترین۔ یا پیج کو فائل میں ڈاؤن لوڈ کر لیں۔", h: "आपके पेज को एक छोटा प्यारा सा लिंक मिलता है जिसमें उनका नाम होता है — WhatsApp के लिए बेहतरीन। या पेज को फ़ाइल में डाउनलोड कर लें।" },
    /* ---- FAQ ---- */
    "Frequently asked questions": { r: "Aksar puche jane wale sawal", u: "اکثر پوچھے جانے والے سوال", h: "अक्सर पूछे जाने वाले सवाल" },
    "Is WishLink really free?": { r: "Kya WishLink waqai muft hai?", u: "کیا WishLink واقعی مفت ہے؟", h: "क्या WishLink सच में मुफ़्त है?" },
    "Yes. Creating and sharing birthday pages is completely free, with no sign-up and no app to install. Free pages carry a small “Made with WishLink” line at the bottom.": { r: "Ji haan. Birthday pages banana aur share karna bilkul muft hai — na sign-up, na app install karna. Muft pages ke neeche ek chhoti si “Made with WishLink” line ati hai.", u: "جی ہاں۔ برتھ ڈے پیجز بنانا اور شیئر کرنا بالکل مفت ہے — نہ سائن اپ، نہ ایپ انسٹال کرنا۔ مفت پیجز کے نیچے ایک چھوٹی سی “Made with WishLink” لائن آتی ہے۔", h: "जी हाँ। बर्थडे पेज बनाना और शेयर करना बिल्कुल मुफ़्त है — न साइन-अप, न ऐप इंस्टॉल करना। मुफ़्त पेजों के नीचे एक छोटी सी “Made with WishLink” लाइन आती है।" },
    "How does the person open my surprise?": { r: "Wo mera surprise kaise khole ga?", u: "وہ میرا سرپرائز کیسے کھولے گا؟", h: "वे मेरा सरप्राइज़ कैसे खोलेंगे?" },
    "You send them one link (WhatsApp works best). The page asks for the secret PIN you chose — tell them the PIN in your message. Once it opens, the celebration starts: music, confetti, cake, your photos, a gift box and your letter.": { r: "Tum unhein ek link bhejte ho (WhatsApp sab se best hai). Page tumhara chuna hua khufiya PIN mange ga — message mein PIN bhi bata do. Khulte hi jashn shuru: music, confetti, cake, tumhari photos, gift box aur tumhara letter.", u: "آپ انہیں ایک لنک بھیجتے ہیں (واٹس ایپ سب سے بہترین ہے)۔ پیج آپ کا چنا ہوا خفیہ پن مانگے گا — پیغام میں پن بھی بتا دیں۔ کھلتے ہی جشن شروع: میوزک، کنفیٹی، کیک، آپ کی فوٹوز، گفٹ باکس اور آپ کا خط۔", h: "आप उन्हें एक लिंक भेजते हैं (WhatsApp सबसे बेहतरीन है)। पेज आपका चुना गुप्त PIN मांगेगा — संदेश में PIN भी बता दें। खुलते ही जश्न शुरू: संगीत, कंफ़ेटी, केक, आपकी फोटो, गिफ़्ट बॉक्स और आपका पत्र।" },
    "Can I add our photos?": { r: "Kya main hamari photos laga sakta hoon?", u: "کیا میں ہماری فوٹوز لگا سکتا ہوں؟", h: "क्या मैं हमारी फोटो लगा सकता हूँ?" },
    "Yes — up to 4 photos. They are resized in your browser and stored securely with your page on our servers, then shown as an auto-sliding gallery the birthday person can also swipe through.": { r: "Ji haan — 4 tak photos. Wo tumhare browser mein chhoti hoti hain aur page ke sath hamare server par mehfooz rehti hain, phir khud chalti gallery mein nazar ati hain jise birthday wala swipe bhi kar sakta hai.", u: "جی ہاں — 4 تک فوٹوز۔ وہ آپ کے براؤزر میں چھوٹی ہوتی ہیں اور پیج کے ساتھ ہمارے سرور پر محفوظ رہتی ہیں، پھر خود چلتی گیلری میں نظر آتی ہیں جسے برتھ ڈے والا سوائپ بھی کر سکتا ہے۔", h: "जी हाँ — 4 तक फोटो। वे आपके ब्राउज़र में छोटी होती हैं और पेज के साथ हमारे सर्वर पर सुरक्षित रहती हैं, फिर खुद चलती गैलरी में दिखती हैं जिसे बर्थडे वाला स्वाइप भी कर सकता है।" },
    "Do I need to install an app or create an account?": { r: "Kya app install karna ya account banana pare ga?", u: "کیا ایپ انسٹال کرنا یا اکاؤنٹ بنانا پڑے گا؟", h: "क्या ऐप इंस्टॉल करना या अकाउंट बनाना पड़ेगा?" },
    "No. WishLink works entirely in the browser, on any phone or computer. There are no accounts and no passwords to remember — just the PIN on each page.": { r: "Nahi. WishLink pura browser mein chalta hai, kisi bhi phone ya computer par. Na account hain, na yaad rakhne wale password — bas har page ka PIN hai.", u: "نہیں۔ WishLink پورا براؤزر میں چلتا ہے، کسی بھی فون یا کمپیوٹر پر۔ نہ اکاؤنٹ ہیں، نہ یاد رکھنے والے پاس ورڈ — بس ہر پیج کا پن ہے۔", h: "नहीं। WishLink पूरा ब्राउज़र में चलता है, किसी भी फोन या कंप्यूटर पर। न अकाउंट हैं, न याद रखने वाले पासवर्ड — बस हर पेज का PIN है।" },
    "What occasions does WishLink support?": { r: "WishLink kin moqon ke liye hai?", u: "WishLink کن موقعوں کے لیے ہے؟", h: "WishLink किन अवसरों के लिए है?" },
    "Birthday pages are live now with 15 designs. Anniversary, wedding, baby, Eid and New Year pages are in the works — the same idea, made for each celebration.": { r: "Birthday pages abhi 15 designs ke sath live hain. Anniversary, wedding, baby, Eid aur New Year pages ban rahe hain — wahi khayal, har jashn ke liye.", u: "برتھ ڈے پیجز ابھی 15 ڈیزائن کے ساتھ لائیو ہیں۔ سالگرہ، شادی، بچے، عید اور نئے سال کے پیجز بن رہے ہیں — وہی خیال، ہر جشن کے لیے۔", h: "बर्थडे पेज अभी 15 डिज़ाइन के साथ लाइव हैं। एनिवर्सरी, शादी, बच्चे, ईद और नए साल के पेज बन रहे हैं — वही ख़याल, हर जश्न के लिए।" },
    /* ---- blog teaser ---- */
    "From the WishLink blog": { r: "WishLink blog se", u: "WishLink بلاگ سے", h: "WishLink ब्लॉग से" },
    "Read the guide →": { r: "Guide parho →", u: "گائیڈ پڑھیں ←", h: "गाइड पढ़ें →" },
    "See the wishes →": { r: "Wishes dekho →", u: "وشز دیکھیں ←", h: "विश देखें →" },
    "Get inspired →": { r: "Khayal lo →", u: "خیال لیں ←", h: "प्रेरणा लें →" }
  };
  for (var k in DICT2) DICT[k] = DICT2[k];
  var DICT3 = {
    /* ---- studio ---- */
    "Photo Frame": { r: "Photo Frame", u: "فوٹو فریم", h: "फोटो फ्रेम" },
    "Studio": { r: "Studio", u: "اسٹوڈیو", h: "स्टूडियो" },
    "Add a photo and get a framed birthday picture — or let": { r: "Ek photo lagao aur framed birthday picture banao — ya", u: "ایک فوٹو لگائیں اور فریم شدہ برتھ ڈے تصویر بنائیں — یا", h: "एक फोटो लगाएं और फ्रेम वाली बर्थडे तस्वीर बनाएं — या" },
    "Laila, our AI artist": { r: "Laila, hamari AI artist", u: "لیلہ، ہماری AI آرٹسٹ", h: "लैला, हमारी AI आर्टिस्ट" },
    ", edit you into a real birthday scene, just like the demo below.": { r: ", ko kaho wo tumhein ek asal birthday scene mein edit kar de, bilkul neeche wale demo ki tarah.", u: "، کو کہیں وہ آپ کو ایک اصل برتھ ڈے سین میں ایڈٹ کر دے، بالکل نیچے والے ڈیمو کی طرح۔", h: ", को कहें वह आपको एक असली बर्थडे सीन में एडिट कर दे, बिल्कुल नीचे वाले डेमो की तरह।" },
    "1 · Make your picture": { r: "1 · Apni picture banao", u: "1 · اپنی تصویر بنائیں", h: "1 · अपनी तस्वीर बनाएं" },
    "AI Edit by Laila": { r: "Laila se AI Edit", u: "لیلہ سے AI ایڈٹ", h: "लैला से AI एडिट" },
    "⚡ Instant Frame": { r: "⚡ Fauran Frame", u: "⚡ فوری فریم", h: "⚡ तुरंत फ्रेम" },
    "📷 Tap to add a photo": { r: "📷 Photo lagane ke liye tap karo", u: "📷 فوٹو لگانے کے لیے ٹیپ کریں", h: "📷 फोटो लगाने के लिए टैप करें" },
    "JPG or PNG from your phone or computer": { r: "Apne phone ya computer se JPG ya PNG", u: "اپنے فون یا کمپیوٹر سے JPG یا PNG", h: "अपने फोन या कंप्यूटर से JPG या PNG" },
    "Photo added ✅ — ready!": { r: "Photo lag gayi ✅ — tayyar!", u: "فوٹو لگ گئی ✅ — تیار!", h: "फोटो लग गई ✅ — तैयार!" },
    "Name on the picture": { r: "Picture par naam", u: "تصویر پر نام", h: "तस्वीर पर नाम" },
    "Choose a scene": { r: "Scene chuno", u: "سین چنیں", h: "सीन चुनें" },
    "Rose Night": { r: "Rose Night", u: "روز نائٹ", h: "रोज़ नाइट" },
    "Royal Violet": { r: "Royal Violet", u: "رائل وائلٹ", h: "रॉयल वायलेट" },
    "Starry Night": { r: "Starry Night", u: "اسٹاری نائٹ", h: "स्टारी नाइट" },
    "Pearl Blush": { r: "Pearl Blush", u: "پرل بلش", h: "पर्ल ब्लश" },
    "Picture size": { r: "Picture ka size", u: "تصویر کا سائز", h: "तस्वीर का साइज़" },
    "4:5 · Post": { r: "4:5 · Post", u: "4:5 · پوسٹ", h: "4:5 · पोस्ट" },
    "9:16 · Story / Reel": { r: "9:16 · Story / Reel", u: "9:16 · اسٹوری / ریل", h: "9:16 · स्टोरी / रील" },
    "Photo zoom": { r: "Photo zoom", u: "فوٹو زوم", h: "फोटो ज़ूम" },
    "Tip: drag the photo inside the frame to move it, and use the slider to zoom.": { r: "Tip: photo ko frame ke andar drag karke hila sakte ho, aur slider se zoom kar sakte ho.", u: "ٹپ: فوٹو کو فریم کے اندر ڈریگ کر کے ہلا سکتے ہیں، اور سلائیڈر سے زوم کر سکتے ہیں۔", h: "टिप: फोटो को फ्रेम के अंदर ड्रैग करके हिला सकते हैं, और स्लाइडर से ज़ूम कर सकते हैं।" },
    "Meet Laila — your AI artist ✨": { r: "Milo Laila se — tumhari AI artist ✨", u: "لیں لیلہ سے — آپ کی AI آرٹسٹ ✨", h: "मिलिए लैला से — आपकी AI आर्टिस्ट ✨" },
    "Send a photo, and Laila edits you into a birthday scene.": { r: "Photo bhejo, aur Laila tumhein ek birthday scene mein edit kar degi.", u: "فوٹو بھیجیں، اور لیلہ آپ کو ایک برتھ ڈے سین میں ایڈٹ کر دے گی۔", h: "फोटो भेजें, और लैला आपको एक बर्थडे सीन में एडिट कर देगी।" },
    "● Online": { r: "● Online", u: "● آن لائن", h: "● ऑनलाइन" },
    "Your balance:": { r: "Tumhara balance:", u: "آپ کا بیلنس:", h: "आपका बैलेंस:" },
    "checking…": { r: "check ho raha hai…", u: "چیک ہو رہا ہے…", h: "चेक हो रहा है…" },
    "Free credits refill to 20 every 24 hours · paid credits never expire.": { r: "Muft credits har 24 ghante mein 20 tak wapis bhar jate hain · khareede hue credits kabhi khatam nahi hote.", u: "مفت کریڈٹس ہر 24 گھنٹے میں 20 تک واپس بھر جاتے ہیں · خریدے ہوئے کریڈٹس کبھی ختم نہیں ہوتے۔", h: "मुफ़्त क्रेडिट हर 24 घंटे में 20 तक वापस भर जाते हैं · खरीदे हुए क्रेडिट कभी खत्म नहीं होते।" },
    "Your balance code:": { r: "Tumhara balance code:", u: "آپ کا بیلنس کوڈ:", h: "आपका बैलेंस कोड:" },
    "— save it. If you ever change phones or lose this browser, enter the code here and your balance comes back.": { r: "— ise sambhal kar rakho. Agar kabhi phone badlo ya ye browser kho jaye, to code yahan dalo aur balance wapis a jaye ga.", u: "— اسے سنبھال کر رکھیں۔ اگر کبھی فون بدلیں یا یہ براؤزر کھو جائے، تو کوڈ یہاں ڈالیں اور بیلنس واپس آ جائے گا۔", h: "— इसे संभालकर रखें। अगर कभी फोन बदलें या यह ब्राउज़र खो जाए, तो कोड यहाँ डालें और बैलेंस वापस आ जाएगा।" },
    "Restore balance": { r: "Balance wapis lao", u: "بیلنس واپس لائیں", h: "बैलेंस वापस लाएं" },
    "Choose a scene style": { r: "Scene ka style chuno", u: "سین کا اسٹائل چنیں", h: "सीन का स्टाइल चुनें" },
    "1 AI edit = 10 credits": { r: "1 AI edit = 10 credits", u: "1 AI ایڈٹ = 10 کریڈٹس", h: "1 AI एडिट = 10 क्रेडिट" },
    "· 20 free credits refill every 24 hours ·": { r: "· 20 muft credits har 24 ghante mein wapis bharte hain ·", u: "· 20 مفت کریڈٹس ہر 24 گھنٹے میں واپس بھرتے ہیں ·", h: "· 20 मुफ़्त क्रेडिट हर 24 घंटे में वापस भरते हैं ·" },
    "Rs 100 = 50 credits": { r: "Rs 100 = 50 credits", u: "100 روپے = 50 کریڈٹس", h: "Rs 100 = 50 क्रेडिट" },
    ". ✍️ A name written above appears as glowing golden “Happy Birthday” text.": { r: ". ✍️ Upar likha gaya naam chamakte hue sunehre “Happy Birthday” text mein nazar aye ga.", u: "۔ ✍️ اوپر لکھا گیا نام چمکتے ہوئے سنہرے “Happy Birthday” ٹیکسٹ میں نظر آئے گا۔", h: ". ✍️ ऊपर लिखा गया नाम चमकते सुनहरे “Happy Birthday” टेक्स्ट में दिखेगा।" },
    "⏳ Editing takes": { r: "⏳ Editing mein lagte hain", u: "⏳ ایڈٹنگ میں لگتے ہیں", h: "⏳ एडिटिंग में लगते हैं" },
    "2–4 minutes": { r: "2–4 minute", u: "2–4 منٹ", h: "2–4 मिनट" },
    "— keep this page open. Your photo is deleted after editing.": { r: "— ye page khula rakho. Editing ke baad tumhari photo delete kar di jati hai.", u: "— یہ پیج کھلا رکھیں۔ ایڈٹنگ کے بعد آپ کی فوٹو ڈیلیٹ کر دی جاتی ہے۔", h: "— यह पेज खुला रखें। एडिटिंग के बाद आपकी फोटो डिलीट कर दी जाती है।" },
    "🤖 Send to Laila for AI Edit · 10 credits": { r: "🤖 AI Edit ke liye Laila ko bhejo · 10 credits", u: "🤖 AI ایڈٹ کے لیے لیلہ کو بھیجیں · 10 کریڈٹس", h: "🤖 AI एडिट के लिए लैला को भेजें · 10 क्रेडिट" },
    "⬇ Download picture": { r: "⬇ Picture download karo", u: "⬇ تصویر ڈاؤن لوڈ کریں", h: "⬇ तस्वीर डाउनलोड करें" },
    "🎂 Use it in my WishLink page": { r: "🎂 Ise mere WishLink page mein lagao", u: "🎂 اسے میرے WishLink پیج میں لگائیں", h: "🎂 इसे मेरे WishLink पेज में लगाएं" },
    "“Use it” places this picture as the first photo of your birthday page.": { r: "“Use it” dabane se ye picture tumhare birthday page ki pehli photo ban jati hai.", u: "“Use it” دبانے سے یہ تصویر آپ کے برتھ ڈے پیج کی پہلی فوٹو بن جاتی ہے۔", h: "“Use it” दबाने से यह तस्वीर आपके बर्थडे पेज की पहली फोटो बन जाती है।" },
    "Before — plain photo": { r: "Pehle — sada photo", u: "پہلے — سادہ فوٹو", h: "पहले — सादी फोटो" },
    "After — Laila's AI edit ✨": { r: "Baad mein — Laila ka AI edit ✨", u: "بعد میں — لیلہ کا AI ایڈٹ ✨", h: "बाद में — लैला का AI एडिट ✨" },
    "Demo made with an AI-generated model (not a real person). Your edit will look just like this — with YOUR photo.": { r: "Ye demo AI se bani model ke sath hai (asal insan nahi). Tumhara edit bilkul aisa hi lage ga — tumhari photo ke sath.", u: "یہ ڈیمو AI سے بنی ماڈل کے ساتھ ہے (اصل انسان نہیں)۔ آپ کا ایڈٹ بالکل ایسا ہی لگے گا — آپ کی فوٹو کے ساتھ۔", h: "यह डेमो AI से बनी मॉडल के साथ है (असली इंसान नहीं)। आपका एडिट बिल्कुल ऐसा ही लगेगा — आपकी फोटो के साथ।" },
    "Make a birthday page": { r: "Birthday page banao", u: "برتھ ڈے پیج بنائیں", h: "बर्थडे पेज बनाएं" },
    "Your credits are finished.": { r: "Tumhare credits khatam ho gaye hain.", u: "آپ کے کریڈٹس ختم ہو گئے ہیں۔", h: "आपके क्रेडिट खत्म हो गए हैं।" },
    "Add more credits —": { r: "Aur credits lo —", u: "اور کریڈٹس لیں —", h: "और क्रेडिट लें —" },
    "· Rs 200 = 100 · Rs 500 = 250. Pay any amount (minimum Rs 100) on EasyPaisa:": { r: "· Rs 200 = 100 · Rs 500 = 250. EasyPaisa par koi bhi raqam bhejo (kam se kam Rs 100):", u: "· 200 روپے = 100 · 500 روپے = 250۔ ایزی پیسہ پر کوئی بھی رقم بھیجیں (کم سے کم 100 روپے):", h: "· Rs 200 = 100 · Rs 500 = 250। EasyPaisa पर कोई भी रकम भेजें (कम से कम Rs 100):" },
    "After paying, upload the payment screenshot right here. It is checked automatically and the credits land in your balance in about 1–2 minutes — no WhatsApp needed.": { r: "Payment ke baad screenshot yahin upload kar do. Wo khud check hota hai aur credits taqreeban 1–2 minute mein tumhare balance mein a jate hain — WhatsApp ki zaroorat nahi.", u: "ادائیگی کے بعد اسکرین شاٹ یہیں اپ لوڈ کر دیں۔ وہ خود چیک ہوتا ہے اور کریڈٹس تقریباً 1–2 منٹ میں آپ کے بیلنس میں آ جاتے ہیں — واٹس ایپ کی ضرورت نہیں۔", h: "पेमेंट के बाद स्क्रीनशॉट यहीं अपलोड कर दें। वह खुद चेक होता है और क्रेडिट लगभग 1–2 मिनट में आपके बैलेंस में आ जाते हैं — WhatsApp की ज़रूरत नहीं।" },
    "✅ Submit screenshot for checking": { r: "✅ Check karne ke liye screenshot bhejo", u: "✅ چیک کرنے کے لیے اسکرین شاٹ بھیجیں", h: "✅ चेक करने के लिए स्क्रीनशॉट भेजें" },
    "Any problem? WhatsApp us your screenshot with your balance code": { r: "Koi masla? Apna screenshot balance code ke sath hamein WhatsApp karo", u: "کوئی مسئلہ؟ اپنا اسکرین شاٹ بیلنس کوڈ کے ساتھ ہمیں واٹس ایپ کریں", h: "कोई समस्या? अपना स्क्रीनशॉट बैलेंस कोड के साथ हमें WhatsApp करें" },
    "Could not read that image — please try another.": { r: "Ye tasveer parhi nahi ja saki — koi aur try karo.", u: "یہ تصویر پڑھی نہیں جا سکی — کوئی اور کوشش کریں۔", h: "यह तस्वीर पढ़ी नहीं जा सकी — कोई और कोशिश करें।" },
    "Sending…": { r: "Bhej raha hai…", u: "بھیج رہا ہے…", h: "भेज रहा है…" },
    "Your AI edited picture is ready!": { r: "Tumhari AI edited picture tayyar hai!", u: "آپ کی AI ایڈٹ شدہ تصویر تیار ہے!", h: "आपकी AI एडिट की हुई तस्वीर तैयार है!" },
    /* ---- track my pages ---- */
    "Track My": { r: "Mere Pages", u: "میرے پیجز", h: "मेरे पेज" },
    "Pages": { r: "ki Tracking", u: "کی ٹریکنگ", h: "की ट्रैकिंग" },
    "🎂 Pages made": { r: "🎂 Banaye gaye pages", u: "🎂 بنائے گئے پیجز", h: "🎂 बनाए गए पेज" },
    "👁 Link opens": { r: "👁 Link kitni dafa khula", u: "👁 لنک کتنی دفعہ کھلا", h: "👁 लिंक कितनी बार खुला" },
    "🔓 Opened with PIN": { r: "🔓 PIN se khula", u: "🔓 پن سے کھلا", h: "🔓 PIN से खुला" },
    "🔄 Refresh tracking": { r: "🔄 Tracking refresh karo", u: "🔄 ٹریکنگ ریفریش کریں", h: "🔄 ट्रैकिंग रिफ़्रेश करें" },
    "⏳ Loading your pages…": { r: "⏳ Tumhare pages load ho rahe hain…", u: "⏳ آپ کے پیجز لوڈ ہو رہے ہیں…", h: "⏳ आपके पेज लोड हो रहे हैं…" },
    "You have not made any page on this device yet.": { r: "Tum ne is phone par abhi tak koi page nahi banaya.", u: "آپ نے اس فون پر ابھی تک کوئی پیج نہیں بنایا۔", h: "आपने इस फोन पर अभी तक कोई पेज नहीं बनाया।" },
    "✨ Create your first page": { r: "✨ Apna pehla page banao", u: "✨ اپنا پہلا پیج بنائیں", h: "✨ अपना पहला पेज बनाएं" },
    "🎉 Surprise opened — they saw it!": { r: "🎉 Surprise khul gaya — unhon ne dekh liya!", u: "🎉 سرپرائز کھل گیا — انہوں نے دیکھ لیا!", h: "🎉 सरप्राइज़ खुल गया — उन्होंने देख लिया!" },
    "👁 Link seen — PIN not entered yet": { r: "👁 Link dekha gaya — PIN abhi nahi dala", u: "👁 لنک دیکھا گیا — پن ابھی نہیں ڈالا", h: "👁 लिंक देखा गया — PIN अभी नहीं डाला" },
    "⏳ Not opened yet": { r: "⏳ Abhi khula nahi", u: "⏳ ابھی کھلا نہیں", h: "⏳ अभी खुला नहीं" },
    "Not opened yet — share the link to start the surprise 💛": { r: "Abhi khula nahi — link share karo, surprise shuru karo 💛", u: "ابھی کھلا نہیں — لنک شیئر کریں، سرپرائز شروع کریں 💛", h: "अभी खुला नहीं — लिंक शेयर करें, सरप्राइज़ शुरू करें 💛" },
    "🔗 Copy link": { r: "🔗 Link copy karo", u: "🔗 لنک کاپی کریں", h: "🔗 लिंक कॉपी करें" },
    "Open": { r: "Kholo", u: "کھولیں", h: "खोलें" },
    "👁 Link opened": { r: "👁 Link khula", u: "👁 لنک کھلا", h: "👁 लिंक खुला" },
    "· 🔓 Opened with PIN": { r: "· 🔓 PIN se khula", u: "· 🔓 پن سے کھلا", h: "· 🔓 PIN से खुला" },
    "time": { r: "dafa", u: "دفعہ", h: "बार" },
    "times": { r: "dafa", u: "دفعہ", h: "बार" }
  };
  for (var k3 in DICT3) DICT[k3] = DICT3[k3];

  var PH = {
    "Your birthday wish will appear here…": { r: "Tumhari birthday wish yahan aye gi…", u: "آپ کی برتھ ڈے وش یہاں آئے گی…", h: "आपकी बर्थडे विश यहाँ आएगी…" },
    "A letter for them will appear here…": { r: "Un ke liye letter yahan aye ga…", u: "ان کے لیے خط یہاں آئے گا…", h: "उनके लिए पत्र यहाँ आएगा…" },
    "Write the line hidden inside the gift box…": { r: "Wo line likho jo gift box ke andar chhupi ho gi…", u: "وہ لائن لکھیں جو گفٹ باکس کے اندر چھپی ہو گی…", h: "वह लाइन लिखें जो गिफ़्ट बॉक्स के अंदर छिपी होगी…" },
    "Enter a balance code": { r: "Balance code likho", u: "بیلنس کوڈ لکھیں", h: "बैलेंस कोड लिखें" },
    "Name on the picture (optional)": { r: "Picture par naam (marzi hai)", u: "تصویر پر نام (مرضی ہے)", h: "तस्वीर पर नाम (इच्छा हो तो)" }
  };

  var PATTERNS = [
    { re: /^👥 ([\d,]+)\+ pages made$/,
      r: function (m) { return "👥 " + m[1] + "+ pages banaye gaye"; },
      u: function (m) { return "👥 " + m[1] + "+ پیجز بنائے گئے"; },
      h: function (m) { return "👥 " + m[1] + "+ पेज बनाए गए"; } },
    { re: /^Link last seen (.+?) — PIN not entered yet$/,
      r: function (m) { return "Link aakhri dafa dekha gaya " + m[1] + " — PIN abhi nahi dala"; },
      u: function (m) { return "لنک آخری دفعہ دیکھا گیا " + m[1] + " — پن ابھی نہیں ڈالا"; },
      h: function (m) { return "लिंक आखिरी बार देखा गया " + m[1] + " — PIN अभी नहीं डाला"; } },
    { re: /^Last opened (.+)$/,
      r: function (m) { return "Aakhri dafa khula " + m[1]; },
      u: function (m) { return "آخری دفعہ کھلا " + m[1]; },
      h: function (m) { return "आखिरी बार खुला " + m[1]; } },
    { re: /^Link last seen (.+)$/,
      r: function (m) { return "Link aakhri dafa dekha gaya " + m[1]; },
      u: function (m) { return "لنک آخری دفعہ دیکھا گیا " + m[1]; },
      h: function (m) { return "लिंक आखिरी बार देखा गया " + m[1]; } }
  ];

  var LANGS = { en: null, roman: "r", ur: "u", hi: "h" };
  var cur = "en";
  try { cur = localStorage.getItem("wl_lang") || "en"; } catch (e) {}
  if (!LANGS.hasOwnProperty(cur)) cur = "en";

  var origText = new WeakMap();
  function trCore(core) {
    var e = DICT[core];
    if (e && e[LANGS[cur]]) return e[LANGS[cur]];
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = PATTERNS[i].re.exec(core);
      if (m && PATTERNS[i][LANGS[cur]]) return PATTERNS[i][LANGS[cur]](m);
    }
    return null;
  }
  function applyTo(root) {
    if (!root) root = document.body;
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "OPTION" && p.parentElement && p.parentElement.id === "wlLangSel") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-nolang]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!origText.has(node)) origText.set(node, node.nodeValue);
      var orig = origText.get(node);
      var lead = /^\s*/.exec(orig)[0], trail = /\s*$/.exec(orig)[0];
      var core = orig.trim();
      if (!core) return;
      var target = (cur === "en") ? orig : (trCore(core) !== null ? lead + trCore(core) + trail : orig);
      if (node.nodeValue !== target) node.nodeValue = target;
    });
    /* placeholders */
    var els = root.querySelectorAll ? root.querySelectorAll("[placeholder]") : [];
    els.forEach(function (el) {
      if (!el.dataset.wlPhOrig) el.dataset.wlPhOrig = el.getAttribute("placeholder") || "";
      var o = el.dataset.wlPhOrig;
      if (cur === "en") { if (el.getAttribute("placeholder") !== o) el.setAttribute("placeholder", o); return; }
      var e = PH[o];
      if (e && e[LANGS[cur]]) el.setAttribute("placeholder", e[LANGS[cur]]);
    });
  }
  function setHtmlLang() {
    var de = document.documentElement;
    if (cur === "ur") { de.setAttribute("lang", "ur"); de.setAttribute("dir", "rtl"); }
    else if (cur === "hi") { de.setAttribute("lang", "hi"); de.removeAttribute("dir"); }
    else if (cur === "roman") { de.setAttribute("lang", "ur"); de.removeAttribute("dir"); }
    else { de.setAttribute("lang", "en"); de.removeAttribute("dir"); }
  }
  function apply() { setHtmlLang(); applyTo(document.body); }

  window.WL_T = function (key) {
    if (cur === "en") return key;
    var e = DICT[key];
    return (e && e[LANGS[cur]]) ? e[LANGS[cur]] : key;
  };
  window.WL18N = { apply: apply, get lang() { return cur; } };

  /* Urdu font + small RTL helpers */
  var st = document.createElement("style");
  st.textContent = "html[lang='ur'][dir='rtl'] body, html[lang='ur'][dir='rtl'] input, html[lang='ur'][dir='rtl'] textarea, html[lang='ur'][dir='rtl'] select, html[lang='ur'][dir='rtl'] button { font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif; } html[lang='ur'][dir='rtl'] body { line-height: 2.05; } html[lang='ur'][dir='rtl'] input, html[lang='ur'][dir='rtl'] textarea { line-height: 1.9; } html[lang='ur'][dir='rtl'] .linkrow input, html[lang='ur'][dir='rtl'] .plink { direction: ltr; text-align: left; }";
  document.head.appendChild(st);

  DICT["▶ See a live demo first"] = { r: "▶ Pehle live demo dekho", u: "▶ پہلے لائیو ڈیمو دیکھیں", h: "▶ पहले लाइव डेमो देखें" };
  DICT["· PIN:"] = { r: "· PIN:", u: "· پن:", h: "· PIN:" };

  /* header menu (mobile): the ☰ button toggles the nav panel */
  var mb = document.getElementById("wlMenuBtn");
  var nv = document.getElementById("wlNav") || document.querySelector(".nav");
  if (mb && nv) {
    mb.addEventListener("click", function () { nv.classList.toggle("open"); });
    nv.addEventListener("click", function (e) { if (e.target.tagName === "A") nv.classList.remove("open"); });
  }

  var sel = document.getElementById("wlLangSel");
  if (sel) {
    sel.value = cur;
    sel.addEventListener("change", function () {
      cur = sel.value;
      try { localStorage.setItem("wl_lang", cur); } catch (e) {}
      apply();
    });
  }
  apply();

  /* keep later-injected content (cards, statuses) translated too */
  var busy = false, queued = false;
  var mo = new MutationObserver(function () {
    if (cur === "en" || busy) return;
    if (queued) return;
    queued = true;
    setTimeout(function () {
      queued = false; busy = true;
      try { applyTo(document.body); } catch (e) {}
      busy = false;
    }, 250);
  });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true, characterData: true });
})();

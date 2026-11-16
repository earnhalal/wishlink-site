
/* ================= Occasions (2026-11-16) =================
   Every occasion reuses the same 15 visual designs; what changes is the
   wording: maker labels, ready wishes/letters/gifts, the page headline and
   the share message. Premium designs are marked in PREMIUM_THEMES and are
   enforced server-side (api/create.js + api/studio.js buydesign). */
var PREMIUM_THEMES = { rose: 1, emerald: 1, royal: 1, noir: 1, honey: 1 };
var PREMIUM_PRICE = 50;
var OCCASIONS = {
  birthday: {
    name: "Birthday", emoji: "🎂", page: "/birthday.html",
    makerTitle: "🎂 Birthday Surprise Maker",
    nameLabel: "Birthday person's name", namePh: "e.g. Hamza",
    wishLabel: "Birthday wish", wishPh: "Your birthday wish will appear here…",
    headline: "Happy Birthday",
    blurb: "The original surprise — cake, candles, photos and a letter, all behind a secret PIN.",
    themes: ["classic", "pastel", "neon", "rose", "ocean", "sunset", "lavender", "emerald", "candy", "vintage", "noir", "mint", "royal", "honey", "snow"],
    share: "I made a birthday surprise for you 🎁 Open it here: {link} PIN: {pin}"
  },
  love: {
    name: "Love", emoji: "❤️", page: "/love.html",
    makerTitle: "❤️ Love Page Maker",
    nameLabel: "Your partner's name", namePh: "e.g. Ayesha",
    wishLabel: "Love message", wishPh: "Your love message will appear here…",
    headline: "With All My Love",
    blurb: "For the one who makes ordinary days feel like celebrations — sweet, decent and from the heart.",
    themes: ["rose", "sunset", "lavender", "noir", "honey", "pastel"],
    share: "I made a love page for you ❤️ Open it here: {link} PIN: {pin}"
  },
  friendship: {
    name: "Best Friend", emoji: "👯", page: "/friendship.html",
    makerTitle: "👯 Best Friend Page Maker",
    nameLabel: "Your best friend's name", namePh: "e.g. Ali",
    wishLabel: "Friendship wish", wishPh: "Your friendship wish will appear here…",
    headline: "Happy Friendship Day",
    blurb: "For your partner in crime — the friend who laughs before the punchline and stays for everything after.",
    themes: ["candy", "neon", "sunset", "mint", "pastel", "ocean"],
    share: "I made a friendship page for you 👯 Open it here: {link} PIN: {pin}"
  },
  newyear: {
    name: "New Year", emoji: "🎆", page: "/new-year.html",
    makerTitle: "🎆 New Year Page Maker",
    nameLabel: "Their name", namePh: "e.g. Hamza",
    wishLabel: "New Year wish", wishPh: "Your New Year wish will appear here…",
    headline: "Happy New Year 2027",
    blurb: "Start their year with a bang — a page full of hope, duas and big plans for 2027.",
    themes: ["neon", "classic", "royal", "snow", "honey", "ocean"],
    share: "I made a New Year page for you 🎆 Open it here: {link} PIN: {pin}"
  },
  anniversary: {
    name: "Anniversary", emoji: "💍", page: "/anniversary.html",
    makerTitle: "💍 Anniversary Page Maker",
    nameLabel: "Couple's names", namePh: "e.g. Ahmed & Fatima",
    wishLabel: "Anniversary wish", wishPh: "Your anniversary wish will appear here…",
    headline: "Happy Anniversary",
    blurb: "Another year of love, still going strong — celebrate the couple with photos and a letter.",
    themes: ["classic", "rose", "royal", "vintage", "honey", "lavender"],
    share: "I made an anniversary page for you 💍 Open it here: {link} PIN: {pin}"
  },
  invitation: {
    name: "Invitation", emoji: "💌", page: "/invitation.html",
    makerTitle: "💌 Invitation Page Maker",
    nameLabel: "Host or event name", namePh: "e.g. The Khan Family",
    wishLabel: "Invitation wording", wishPh: "Your invitation wording will appear here…",
    headline: "You're Invited",
    blurb: "A prettier way to invite — one link with the wording, the details and a little celebration built in.",
    themes: ["classic", "emerald", "royal", "vintage", "snow", "mint"],
    share: "You're invited! 💌 See your invitation here: {link} PIN: {pin}"
  }
};
var OCC_ORDER = ["birthday", "love", "friendship", "newyear", "anniversary", "invitation"];

var OCC_WISHES = {
  love: {
    heartfelt: [
      "To {name}: some people search their whole lives for what I found in you. Thank you for your kindness, your patience and the way you make even ordinary days feel like little celebrations. You are loved more than words can hold.",
      "{name}, this page is small, but what it carries is not: my gratitude for every day with you, my pride in the person you are, and my promise to keep choosing you — today, tomorrow, and on all the ordinary days in between.",
      "For {name}: if I could give you one thing, it would be the ability to see yourself through my eyes — only then would you know how special you are to me, and how bright you make my world."
    ],
    romantic: [
      "My dearest {name}, every love story is beautiful, but ours is my favourite. Thank you for your smile that fixes bad days and your heart that makes room for everyone. This little page is just a reminder: you are so, so loved.",
      "{name}, they say home is a place. They are wrong — home is a person, and for me that person is you. Wherever you are, that is where my heart wants to be.",
      "To the one who holds my heart, {name}: loving you was never a choice I had to think about — it was the easiest, truest thing I have ever done. Here is to us, and to every year still waiting for us."
    ],
    short: [
      "For {name}: you are my favourite hello, my hardest goodbye, and every happy moment in between. ❤️",
      "{name} — just a little page to say what I feel every day: I love you, and I am grateful for you. 💛",
      "To {name}: of all the gifts life has given me, you are the one I thank Allah for the most. ❤️"
    ]
  },
  friendship: {
    heartfelt: [
      "To {name}: siblings are given, but friends like you are chosen — and I chose spectacularly. Thank you for every rescue, every secret kept and every laugh shared. Life is genuinely better with you in it.",
      "{name}, a best friend is someone who knows the song in your heart and sings it back when you forget. Thank you for always knowing my song. Here is to many more years of us.",
      "For {name}: thank you for being the family I got to choose. Your loyalty, your honesty and your ridiculous sense of humour have carried me through more days than you know."
    ],
    funny: [
      "{name}!! OFFICIAL BESTIE APPRECIATION PAGE: this certifies that you are my partner in crime, my unpaid therapist, and the only person who laughs at my jokes before the punchline. This honour cannot be returned or exchanged. 🎉",
      "To {name}: congratulations on being my best friend — the pay is terrible, the hours are 24/7, and the snacks are shared unfairly (mostly by me). But the laughs are unlimited, and so is my loyalty.",
      "{name}, if we were on a sinking ship and there was only one life jacket… I would miss you a lot, and I would think about you fondly every single day. That is true friendship. 😄"
    ],
    short: [
      "For {name}: good friends are like stars — you do not always see them, but you know they are always there. ⭐",
      "{name} — partner in crime, keeper of secrets, sharer of fries. Best friends forever. 👯",
      "To {name}: a true friend accepts you as you are — and still tells you when there is food in your teeth. 😄"
    ]
  },
  newyear: {
    heartfelt: [
      "Happy New Year, {name}! May 2027 be the year your quiet hard work finally meets its reward — health that never fails you, success you have truly earned, and a happiness so steady that even hard days cannot shake it.",
      "To {name}: a new year is a blank page, and nobody deserves a beautiful story more than you. May this year bring you closer to every dream you whispered about last year. I will be cheering for you in every chapter.",
      "{name}, my dua for you this New Year is simple and big: may Allah bless your rizq, protect your family, ease every difficulty before it reaches you, and fill 2027 with reasons to smile."
    ],
    funny: [
      "Happy New Year, {name}! This year we are definitely going to the gym, saving money and sleeping early. (This page will self-destruct before February, like all our resolutions.) 😄",
      "To {name}: my New Year resolution is to stop making resolutions — but for you I made one exception: more laughter, more chai, and more of your favourite people around you in 2027.",
      "{name}, congratulations on surviving another year of my friendship! Your reward: a whole new year of it. No refunds, no exchanges. Happy New Year! 🎆"
    ],
    short: [
      "Happy New Year, {name}! May 2027 be your best year yet. 🎆",
      "To {name}: new year, new chances, same wonderful you. Shine bright in 2027! ✨",
      "{name} — wishing you health, rizq and happiness in every month of the New Year. 🎇"
    ]
  },
  anniversary: {
    heartfelt: [
      "Happy Anniversary, {name}! Another year of love, patience and partnership — proof that the best decision two people can make is to keep choosing each other, every single day. May the years ahead be even gentler than the ones behind you.",
      "To {name}: your love is the kind people write duas about — steady in hard times, joyful in good ones. May Allah bless your home with barakah, your hearts with peace, and your story with many more beautiful chapters.",
      "{name}, congratulations on another year of us. Thank you for every sacrifice nobody saw, every laugh everybody heard, and every day you made this family feel like the safest place in the world."
    ],
    romantic: [
      "Happy Anniversary, {name}. If I had my life to live over again, I would find you sooner — so I could love you longer. Thank you for being my calm, my laughter and my favourite place in the world.",
      "To {name}: they say the first years are the sweetest, but they clearly never watched two people grow old together gracefully. Every year with you is better than the last — here is to forever, one year at a time.",
      "{name}, my favourite love story is not in any book — it is the one we are writing together, page by page, year by year. Happy Anniversary to my favourite co-author."
    ],
    short: [
      "Happy Anniversary, {name}! Another year of love, still going strong. 💍",
      "To {name}: every year with you is my favourite year. Here is to many more. 💛",
      "{name} — congratulations on another year of choosing each other. Happy Anniversary! ✨"
    ]
  },
  invitation: {
    birthday: [
      "You are warmly invited to a birthday celebration for {name}! Join us for cake, laughter and good company — your presence is the best present of all. Details are in the letter below, and we cannot wait to celebrate together.",
      "It's a party! {name} is celebrating a birthday, and you are on the guest list. Come hungry, bring your best smile, and get ready for an evening of cake, music and memories.",
      "With joyful hearts, we invite you to the birthday celebration of {name}. An evening of happiness is incomplete without you — please honour us with your presence."
    ],
    party: [
      "You are invited! {name} is hosting a get-together, and no gathering is complete without you. Good food, great company and an evening to remember — all the details are in the letter below.",
      "Mark your calendar! {name} warmly invites you to a special gathering. Join us for food, laughter and celebration — your presence will make it complete.",
      "It's celebration time! {name} invites you and your family to an evening of joy. Please come, eat, laugh and make memories with us — details below."
    ],
    formal: [
      "With the blessings of Allah, {name} cordially invites you to grace our celebration with your esteemed presence. Your attendance and duas are respectfully requested — the details follow in the letter below.",
      "{name} requests the honour of your presence at our upcoming celebration. It would be our privilege to host you; kindly find the date, time and venue in the letter below.",
      "We are delighted to invite you to a celebration hosted by {name}. Your presence is eagerly awaited, and your prayers are the most precious gift."
    ]
  }
};

var OCC_LETTERS = {
  love: [
    { label: "Romantic & Sweet", body: "My dearest {name},\n\nSome people write letters because they have something to say. I am writing because no single day is enough to celebrate you — but this page is a good place to start.\n\nThank you for your smile that fixes bad days, your heart that makes room for everyone, and simply for being you. My wish is that this year treats you as gently as you treat the people you love — and that I get to be standing next to you for every good part of it.\n\nYou are so loved — today, tomorrow, and on all the ordinary days in between." },
    { label: "Heartfelt Long", body: "My dear {name},\n\nEveryone will tell you that you are special. I want to tell you why.\n\nYou are the calm in my chaos and the light in my ordinary days. Your kindness, your strength and the way you love without keeping score — these are the things I thank Allah for, quietly, every day.\n\nWhatever this year brings, remember: you never walk alone. I am beside you in your celebrations, and even closer in your struggles.\n\nWith all my love, today and always." }
  ],
  friendship: [
    { label: "Bestie Fun", body: "Dear {name},\n\nOFFICIAL BESTIE NOTICE: This letter confirms that you are my favourite person to laugh with, my emergency contact for every crisis (real or snack-related), and the co-owner of approximately 400 inside jokes nobody else will ever understand.\n\nThank you for every rescue, every secret kept and every 3 a.m. conversation. Siblings are given — but I chose you, and I chose spectacularly.\n\nHere is to many more years of us." },
    { label: "Heartfelt", body: "Dear {name},\n\nThey say a true friend is one soul in two bodies — and honestly, nobody else could survive my mood swings, my voice notes and my life decisions the way you do.\n\nThank you for standing behind me in my struggles even more than in my celebrations. My prayer for you is simple: may life give you back all the loyalty and love you pour into everyone around you — multiplied.\n\nYour best friend, always." }
  ],
  newyear: [
    { label: "Heartfelt New Year", body: "Dear {name},\n\nA new year is standing at the door, and before it walks in, I wanted you to hear this from me: I am proud of the person you were this year — your patience, your hard work and the way you kept going even when it was hard.\n\nMy dua for your 2027 is simple and big: health that never fails you, rizq that grows with barakah, and a happiness so steady that even hard days cannot shake it.\n\nHappy New Year. This year is yours — go and take it." },
    { label: "Short & Bright", body: "Dear {name},\n\nJust a short letter for a brand-new year: thank you for being one of the best parts of the year that passed.\n\nMay 2027 bring you good health, true happiness, and every single thing you are quietly working towards. I will be cheering for you in every month of it.\n\nHappy New Year!" }
  ],
  anniversary: [
    { label: "Heartfelt Long", body: "Dear {name},\n\nAnother year of your beautiful story — and what a story it is. Through every season, you two have shown everyone around you what patience, partnership and true love actually look like.\n\nMy prayer for you is that the years ahead are even gentler than the ones behind you: a home full of barakah, hearts full of peace, and laughter that never grows old.\n\nHappy Anniversary. Here is to forever — one beautiful year at a time." },
    { label: "Sweet & Simple", body: "Dear {name},\n\nHappy Anniversary! This letter is short, because some things are too big for words: thank you for showing us all that real love is not a feeling — it is a choice you make, kindly, every single day.\n\nMay this year bring you both health, peace and many more reasons to celebrate each other." }
  ],
  invitation: [
    { label: "With Details", body: "Assalamu Alaikum,\n\nYou are warmly invited to join us for a celebration hosted by {name}. It would be our honour and happiness to have you with us.\n\n📅 Date: (write the date here)\n🕰 Time: (write the time here)\n📍 Venue: (write the address here)\n\nYour presence and your duas are the most precious gifts. We look forward to welcoming you.\n\nWith warm regards,\n{from}" },
    { label: "Simple & Warm", body: "Dear guest,\n\n{name} invites you to a celebration! Please join us for food, laughter and good company.\n\n📅 Date: (write the date here)\n🕰 Time: (write the time here)\n📍 Venue: (write the address here)\n\nWe cannot wait to see you there.\n\n— {from}" }
  ]
};

var OCC_GIFTS = [
  "Inside this box there is no toy and no gadget — there is something better: a promise. Whatever this year brings — big dreams, hard days and everything in between — you will never face any of it alone. I am in your corner, today and always. 💛",
  "Your gift is a whole year of my time, my prayers and my best advice — on demand, whenever you need it, no questions asked. 🎁",
  "This box holds a hug, a smile, and a reminder that you are truly loved. (And yes — a real gift is on its way in the real world too.) 🤗",
  "Inside is a wish I made just for you: health that never fails, success you have truly earned, and happiness that stays. Now go make this year yours! ✨"
];

/* the active text library for an occasion (birthday uses the big globals) */
function occLib(occ) {
  if (!occ || occ === "birthday" || !OCC_WISHES[occ]) return { wishes: WISHES, letters: LETTERS, gifts: GIFTS };
  return { wishes: OCC_WISHES[occ], letters: OCC_LETTERS[occ], gifts: OCC_GIFTS };
}

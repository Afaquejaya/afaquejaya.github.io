/*
 * Portfolio content that changes most often: published apps.
 * Edit here, not in index.html — js/main.js renders the "Selected products"
 * section, the app index, the "More shipped apps" list and the app chips
 * on the experience timeline from this file.
 *
 * Sources (checked 15 Oct 2026):
 *  - résumé PDF (roles, dates, outcomes, store links)
 *  - the live Google Play / App Store listings (titles, publishers,
 *    download counts, ratings, descriptions, icons and screenshots).
 *    Images were downloaded from the listings and re-encoded to WebP.
 *
 * screens[].kind:
 *   "ui"    — a raw app capture, shown inside a device frame
 *   "store" — a store marketing panel that already contains its own device
 *             art, shown as a card (no second frame around it)
 */
window.PORTFOLIO = {
  // Where the "Explore All Projects" button opens (in a new tab). The
  // showcase lives in /projects/ of this repo; if it is ever deployed on its
  // own domain, put that URL here.
  showcaseUrl: 'projects/',

  featured: [
    {
      id: 'tbay',
      name: 'Tbay',
      kind: 'Gift-card marketplace · FinTech',
      accent: '#2bb3a3',
      icon: 'img/apps/tbay/icon.webp',
      summary:
        'A peer-to-peer marketplace where people in Nigeria and Ghana trade gift cards for local currency. Vetted vendors compete on rates, trades are escrow-protected, and payouts go straight to a bank or mobile-money wallet.',
      problem:
        'Selling an unused gift card for cash is slow and risky when you don’t trust the buyer. Tbay puts escrow and bonded vendors between both sides.',
      role:
        'Senior Software Engineer at Kobet Technology — shipping production releases to Google Play and the App Store with the cross-country team I led.',
      tags: ['Android', 'iOS', 'Escrow trades', 'Live rates', 'Bank & MoMo payouts'],
      metric: { value: '1M+', label: 'downloads on Google Play · 4.6★ from 42.6K reviews' },
      links: [
        { store: 'play', url: 'https://play.google.com/store/apps/details?id=com.gonglian.tbay' },
        { store: 'ios', url: 'https://apps.apple.com/us/app/gift-card-on-tbay/id6472409948' }
      ],
      screens: [
        { src: 'img/apps/tbay/screen-1.webp', w: 560, h: 996, kind: 'ui', alt: 'Tbay iOS app showing live gift-card rates for Razer, Steam, Vanilla, Sephora and more' },
        { src: 'img/apps/tbay/screen-2.webp', w: 560, h: 996, kind: 'store', alt: 'Tbay store panel: “The most trusted gift card trading platform”, 2M+ downloads badge' },
        { src: 'img/apps/tbay/screen-3.webp', w: 560, h: 996, kind: 'store', alt: 'Tbay store panel: sell 30+ gift cards instantly at best rates' }
      ]
    },
    {
      id: 'evv',
      name: 'eVV 2.0',
      kind: 'State-government ed-tech · Jharkhand',
      accent: '#4f8df5',
      icon: 'img/apps/evv/icon.webp',
      summary:
        'The Department of School Education & Literacy’s platform for running and monitoring schools across Jharkhand — student enrolment, biometric attendance, teacher records, schemes and grievances in one app for officers, schools and teachers.',
      problem:
        'A state needed to track students, teachers and schemes across thousands of schools — and keep that going when COVID-19 closed classrooms.',
      role:
        'Software Engineer at CSM Technologies (2020–22) — requirements, biometric attendance configuration, development, UAT, rollout and post-launch support for the state’s ed-tech apps.',
      tags: ['Android', 'Biometric attendance', 'Role-based logins', 'Gov. rollout'],
      metric: { value: '500K+', label: 'downloads on Google Play' },
      note: 'Screens show the current store version, maintained by the department.',
      links: [
        { store: 'play', url: 'https://play.google.com/store/apps/details?id=com.evidyavahini.app' }
      ],
      screens: [
        { src: 'img/apps/evv/screen-1.webp', w: 560, h: 996, kind: 'ui', alt: 'eVV home grid: download data, student enrolment, student attendance, teacher enrolment, monitoring and more' },
        { src: 'img/apps/evv/screen-2.webp', w: 560, h: 996, kind: 'ui', alt: 'eVV login screen with Officer, School and Teacher roles' },
        { src: 'img/apps/evv/screen-3.webp', w: 560, h: 996, kind: 'ui', alt: 'eVV student enrolment form' }
      ]
    },
    {
      id: 'vivakard',
      name: 'VivaKard',
      kind: 'Gift cards to cash · FinTech',
      accent: '#c8f858',
      icon: 'img/apps/vivakard/icon.webp',
      summary:
        'Turns gift cards — Amazon, iTunes, Steam, Google Play, Xbox and 20+ more — into cash in naira, with transparent rates and no hidden fees. Referral rewards, daily check-ins and a leaderboard keep users coming back.',
      problem:
        'Gift-card holders want a fast, fair way to cash out without haggling or hidden fees.',
      role:
        'Senior Software Engineer at Kobet Technology — cross-platform delivery and production releases on both stores, with the team I led across Dubai, China and Sri Lanka.',
      tags: ['Android', 'iOS', 'Google sign-in', 'Referrals', 'Engagement loops'],
      metric: { value: '100K+', label: 'downloads on Google Play · 4.4★ from 1.1K reviews' },
      links: [
        { store: 'play', url: 'https://play.google.com/store/apps/details?id=com.gift.vivakard&hl=en' },
        { store: 'ios', url: 'https://apps.apple.com/us/app/vivakard-plus/id6749223091' }
      ],
      screens: [
        { src: 'img/apps/vivakard/screen-1.webp', w: 560, h: 1212, kind: 'store', alt: 'VivaKard store panel: get cash for your gift cards in minutes, showing the home screen' },
        { src: 'img/apps/vivakard/screen-2.webp', w: 560, h: 1212, kind: 'store', alt: 'VivaKard store panel: trade 50+ gift cards' },
        { src: 'img/apps/vivakard/screen-3.webp', w: 560, h: 1212, kind: 'store', alt: 'VivaKard store panel: one-tap Google login' }
      ]
    },
    {
      id: 'timucard',
      name: 'TimuCard',
      kind: 'Gift cards, payouts & bills · FinTech',
      accent: '#ff5a3c',
      icon: 'img/apps/timucard/icon.webp',
      summary:
        'Converts unused gift cards into instant naira payouts with a live rate ticker and upfront pricing — then lets users pay electricity, cable, airtime and data bills from their in-app balance, with device-level fraud monitoring.',
      problem:
        'Money stuck on unused gift cards; TimuCard turns it into a balance people can withdraw or spend on everyday bills.',
      role:
        'Senior Software Engineer at Kobet Technology — part of the FinTech app family I helped architect and ship on Google Play and the App Store.',
      tags: ['Android', 'iOS', 'Bill payments', 'Live rate ticker', 'Fraud monitoring'],
      metric: { value: '50K+', label: 'downloads on Google Play · 4.6★ rating' },
      links: [
        { store: 'play', url: 'https://play.google.com/store/apps/details?id=com.timucard.gift&hl=en' },
        { store: 'ios', url: 'https://apps.apple.com/us/app/timucard/id6752526295' }
      ],
      screens: [
        { src: 'img/apps/timucard/screen-1.webp', w: 554, h: 1200, kind: 'store', alt: 'TimuCard store panel: highest rates, instant cashouts' },
        { src: 'img/apps/timucard/screen-2.webp', w: 554, h: 1200, kind: 'store', alt: 'TimuCard store panel: invite friends and earn' },
        { src: 'img/apps/timucard/screen-3.webp', w: 554, h: 1200, kind: 'store', alt: 'TimuCard store panel: bill payments and biometrics' }
      ]
    }
  ],

  more: [
    {
      id: 'bitowi',
      name: 'BitOwi',
      line: 'Crypto wallet — store, send and receive crypto with balances and history in one place.',
      icon: 'img/apps/bitowi/icon.webp',
      url: 'https://play.google.com/store/apps/details?id=com.bitowi.app&hl=en_US',
      where: 'Kobet Technology · Google Play'
    },
    {
      id: 'jeeb', featuredElsewhere: true,
      name: 'Jeeb',
      line: 'Grocery and e-commerce platform for Qatar, built 0→1 with Arabic localisation. Store listing no longer public.',
      monogram: 'J',
      where: 'Jeeb · Doha'
    },
    {
      id: 'pass', featuredElsewhere: true,
      name: 'Pass Delivery',
      line: 'On-demand delivery app in Qatar. Store listing no longer public.',
      monogram: 'P',
      where: 'Jeeb · Doha'
    },
    {
      id: 'digischool',
      name: 'DigiSchool',
      line: 'E-learning for state-government schools during COVID-19. Store listing no longer public.',
      monogram: 'D',
      where: 'CSM Technologies'
    },
    {
      id: 'jmr',
      name: 'JMR',
      line: 'Native app that replaced paper vendor registers — 70% less data entry. Store listing no longer public.',
      monogram: 'JM',
      where: 'JUSCO (Tata Steel)'
    },
    {
      id: 'ecampuslink',
      name: 'e-CampusLink',
      line: 'Cross-platform school app built with .NET and Xamarin. Store listing no longer public.',
      monogram: 'e',
      where: 'JUSCO (Tata Steel)'
    }
  ]
  ,
  // Logo strip under the hero. `img` = an official mark (app-store icon or
  // the company's own logo file, see img/logos/README.md); `tile` puts a
  // light-on-dark logo on a solid chip. Without `img`, a neutral text tile is
  // shown.
  logos: [
    { name: 'Kobet Technology', caption: 'Employer · Dubai', img: 'img/logos/kobet.webp', square: true, url: 'https://kobet.co/' },
    { name: 'Tbay', caption: 'Product · 1M+ downloads', img: 'img/apps/tbay/icon.webp', square: true, url: '#app-tbay' },
    { name: 'VivaKard', caption: 'Product · FinTech', img: 'img/apps/vivakard/icon.webp', square: true, url: '#app-vivakard' },
    { name: 'TimuCard', caption: 'Product · FinTech', img: 'img/apps/timucard/icon.webp', square: true, url: '#app-timucard' },
    { name: 'BitOwi', caption: 'Product · crypto wallet', img: 'img/apps/bitowi/icon.webp', square: true },
    { name: 'Jeeb', caption: 'Employer · Doha', img: 'img/logos/jeeb.webp', wide: true, url: '#case-jeeb' },
    { name: 'Pass Delivery', caption: 'Product · Qatar', img: 'img/logos/pass.webp', wide: true },
    { name: 'eVV 2.0 · JEPC Jharkhand', caption: 'Product · 500K+ downloads', img: 'img/apps/evv/icon.webp', square: true, url: '#app-evv' },
    { name: 'CSM Technologies', caption: 'Employer · Ranchi', img: 'img/logos/csm.png', tile: '#121110', url: 'https://www.csm.tech/' },
    { name: 'JUSCO · Tata Steel UISL', caption: 'Employer · Jamshedpur', img: 'img/logos/tata-steel-uisl.webp', square: true, url: 'https://www.tatasteeluisl.com/' },
    { name: 'Rental Property SaaS', caption: 'My product · MCP', mono: 'RP', color: '#c43a0c', url: '#build-rental' },
    { name: 'GlowFit AI', caption: 'My product · AI', mono: '✦', color: '#a65f58', url: '#build-glowfit' }
  ]
};

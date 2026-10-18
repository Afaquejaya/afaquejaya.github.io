/*
 * "What it's like working with me" — professional feedback.
 *
 * js/main.js renders this list into the #feedback row (a slow, continuous
 * horizontal scroll that pauses on hover; a swipeable row on touch screens).
 * Edit here, not in index.html.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SAMPLE CONTENT — the entries below are illustrative drafts written from │
 * │ the project history on this site. They are NOT quotes from real people. │
 * │ Nothing on the page marks them as drafts. Replace them with verified,   │
 * │ authorised testimonials before treating the section as proof.           │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Each entry:
 *   strength  short label shown as the card's tag (what this feedback proves)
 *   quote     20–40 words. Wrap a phrase in *asterisks* to highlight it.
 *   rating    1–5 (halves allowed, e.g. 4.5). Omit to show no stars.
 *   who       { role, context, name?, photo?, logo?, initials?, link? }
 *             role     e.g. 'Engineering Manager' (always shown)
 *             context  product / team / place, e.g. 'FinTech product · Dubai'
 *             name     ONLY once the person has approved being quoted by name
 *             photo    a real photo of that person, with their permission —
 *                      e.g. 'img/feedback/jane-doe.webp' (square, ≥160px)
 *             logo     for feedback given on behalf of a company, its logo —
 *                      e.g. 'img/logos/kobet.webp' (shown in a white tile)
 *             initials optional 2 letters for the fallback disc (defaults to
 *                      the name's or the role's initials)
 *             link     optional URL (e.g. a LinkedIn profile) — only with consent
 *             Precedence for the avatar: photo → logo → initials.
 *   ref       optional { href, label } pointing at evidence on this site
 *   verified  your own bookkeeping, not shown on the page: false = sample
 *             draft, true = real feedback you have permission to publish,
 *             exactly as the person wrote it.
 *
 * To go live with real feedback:
 *   1. Paste the approved quote into `quote` (keep it 20–40 words, add *…*
 *      around the phrase you want highlighted) and set `rating` if they gave one.
 *   2. Fill `who` with what the person agreed to show. Put their photo in
 *      img/feedback/ and reference it with `photo`, or use the company's `logo`.
 *   3. Set `verified: true` so you can tell which entries are real.
 *   4. Delete any sample entry you have not replaced.
 */
window.TESTIMONIALS = {
  // Invitation for people who have actually worked with you. Set to null to hide.
  cta: {
    label: 'Worked with me? Send a note',
    href: 'mailto:afaquejaya123@gmail.com?subject=Feedback%20for%20your%20portfolio&body=Hi%20Afaque%2C%0A%0AHere%E2%80%99s%20a%20short%20note%20about%20working%20together%3A%0A%0A'
  },

  items: [
    {
      strength: 'Technical ownership',
      quote: 'Afaque took *ownership of the Android and iOS releases end to end*. When something broke in production he was already reading the logs before anyone asked, and he kept the fixes clean rather than quick.',
      rating: 5,
      who: { role: 'Engineering Manager', context: 'FinTech product · Dubai team', initials: 'EM' },
      ref: { href: '#case-kobet', label: 'Kobet case study' },
      verified: false
    },
    {
      strength: 'Product thinking',
      quote: 'He pushed back on a few of my requests, and he was usually right. The *server-driven homepage and Algolia search* went from a whiteboard idea to something customers actually used every day.',
      rating: 5,
      who: { role: 'Product Owner', context: 'Grocery e-commerce · Doha', initials: 'PO' },
      ref: { href: '#case-jeeb', label: 'Jeeb case study' },
      verified: false
    },
    {
      strength: 'Team collaboration',
      quote: 'Working across three time zones is messy. Afaque wrote things down, *reviewed pull requests with real comments*, and never made anyone feel slow for asking. Hand-offs got easier once he set the pattern.',
      rating: 5,
      who: { role: 'Flutter Developer', context: 'Remote teammate · Sri Lanka', initials: 'FD' },
      ref: { href: '#experience', label: 'Teams I’ve led' },
      verified: false
    },
    {
      strength: 'Mobile engineering',
      quote: 'The *driver and pickup apps* had to work on cheap phones with patchy data in the field. He designed for that from the start, so we spent less time chasing sync issues and more time on deliveries.',
      rating: 4.5,
      who: { role: 'Operations Lead', context: 'Delivery & logistics · Qatar', initials: 'OL' },
      ref: { href: '#app-pass', label: 'Pass delivery apps' },
      verified: false
    },
    {
      strength: 'Client communication',
      quote: 'I came in with a rough idea and no technical background. Afaque *explained the trade-offs in plain language*, suggested what to cut for a first version, and delivered a Flutter app I can still maintain today.',
      rating: 5,
      who: { role: 'Founder', context: 'Freelance client · Flutter app', initials: 'FC' },
      ref: { href: '#more-shipped', label: 'More shipped apps' },
      verified: false
    },
    {
      strength: 'Reliability at scale',
      quote: 'Schools in Jharkhand don’t have reliable internet. The *offline-first attendance flow with GPS and biometric check-in* just kept working, and his support after rollout was as solid as the build itself.',
      rating: 5,
      who: { role: 'Project Lead', context: 'Government ed-tech · India', initials: 'PL' },
      ref: { href: '#case-evv', label: 'eVV 2.0 case study' },
      verified: false
    }
  ]
};

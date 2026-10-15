/*
 * Builds the portfolio mascot sprite sheets — an illustrated likeness of
 * Afaque Jaya drawn from his profile photo — in the page-mascot format:
 *
 *   img/mascot/afaque-directions.webp   1080×1080, 3×3 cells of 360×360
 *     up-left   up      up-right
 *     left      center  right
 *     down-left down    down-right
 *
 *   img/mascot/afaque-reactions.webp    1080×1080, 3×3 cells of 360×360
 *     blink     heart   sparkle
 *     surprised wink    bashful
 *     sleepy    dizzy   delighted
 *
 * Cell order matches DIRECTIONS / REACTIONS in nilbuild/page-mascot
 * (src/mascot.tsx). The body is identical in every cell so nothing jumps
 * when the sheets swap. The vector masters are written next to the WebPs.
 *
 * Likeness notes (from the photo): warm medium-brown skin, black hair with
 * short faded sides and a tall swept-up top, thick straight brows, thin
 * light-gold aviator-style glasses with a double bridge, a trimmed full
 * beard that follows the jaw (cheeks and lips visible), beige blazer over
 * an open white collar. Colours are sampled from the photo.
 *
 * Usage (sharp is only needed to rasterise; it is not a site dependency):
 *   npm i --no-save sharp
 *   node tools/mascot/build.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', '..', 'img', 'mascot');
const TILE = 360;

const C = {
  line: '#2a1d18',
  skin: '#c88b6d',
  skinLight: '#d9a084',
  skinShade: '#a96c52',
  skinDeep: '#8f5640',
  hair: '#141010',
  hairMid: '#231a17',
  hairHi: '#3e302b',
  fade: 'rgba(20, 16, 16, 0.78)',
  beard: '#1a1312',
  beardEdge: 'rgba(26, 19, 18, 0.55)',
  lip: '#b86e62',
  lipDark: '#7d4038',
  mouth: '#4a1915',
  teeth: '#fbf7f2',
  eyeWhite: '#f5efe9',
  iris: '#2b1b15',
  brow: '#161110',
  frame: '#c4a97f',
  frameDark: '#8f7a58',
  blazer: '#cfb6a2',
  blazerShade: '#b39784',
  blazerDeep: '#9b806d',
  shirt: '#fbfaf8',
  shirtShade: '#e2ddd6',
  heart: '#ff4d6d',
  star: '#ffc93c',
  zzz: '#5a9cff',
  blush: 'rgba(255, 110, 120, 0.42)'
};

/* ------------------------------------------------------------------ body */
function body() {
  return `
  <g mask="url(#fade)">
    <!-- neck -->
    <path d="M154 214 C155 232 158 244 162 254 L198 254 C202 244 205 232 206 214 Z" fill="${C.skinShade}"/>
    <!-- shirt -->
    <path d="M146 252 L180 300 L214 252 L206 246 L180 270 L154 246 Z" fill="${C.shirt}" stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M154 246 L180 270 L170 284 L146 256 Z" fill="${C.shirt}" stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M206 246 L180 270 L190 284 L214 256 Z" fill="${C.shirtShade}" stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round"/>
    <!-- blazer -->
    <path d="M92 352 C94 300 116 268 150 252 L176 320 L184 320 L210 252 C244 268 266 300 268 352 Z" fill="${C.blazer}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M150 252 L134 286 L150 296 L142 318 L178 352 L176 320 Z" fill="${C.blazerShade}" stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M210 252 L226 286 L210 296 L218 318 L182 352 L184 320 Z" fill="${C.blazerShade}" stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M112 330 C114 304 122 290 132 280" fill="none" stroke="${C.blazerDeep}" stroke-width="2.6" stroke-linecap="round" opacity="0.7"/>
    <path d="M248 330 C246 304 238 290 228 280" fill="none" stroke="${C.blazerDeep}" stroke-width="2.6" stroke-linecap="round" opacity="0.7"/>
  </g>`;
}

/* ------------------------------------------------------------------ head */
// dx, dy in -1 … 1: head direction. face: expression options. id: unique per cell.
function head(dx, dy, face = {}, id = 'c') {
  const hx = 180 + dx * 5;           // skull centre
  const hy = 144 + dy * 4;
  const fx = 180 + dx * 15;          // features shift further → reads as a turn
  const fy = 144 + dy * 10;
  const rad = d => d.toFixed(1);

  // Face: slightly long oval, narrower jaw
  const face_d = `M ${hx - 59} ${hy - 20}
    C ${hx - 61} ${hy - 86} ${hx + 61} ${hy - 86} ${hx + 59} ${hy - 20}
    C ${hx + 61} ${hy + 20} ${hx + 52} ${hy + 54} ${hx + 28} ${hy + 72}
    C ${hx + 13} ${hy + 82} ${hx - 13} ${hy + 82} ${hx - 28} ${hy + 72}
    C ${hx - 52} ${hy + 54} ${hx - 61} ${hy + 20} ${hx - 59} ${hy - 20} Z`;

  // Ears (the far ear shrinks as the head turns)
  const ear = (side) => {
    const turnAway = side * dx < 0;
    const x = hx + side * (60 - (turnAway ? 3 : 0)) + dx * 4;
    const w = turnAway ? 8 : 12, h = 17;
    return `<ellipse cx="${rad(x)}" cy="${rad(hy + 4)}" rx="${w}" ry="${h}" fill="${C.skin}" stroke="${C.line}" stroke-width="2.6"/>
            <path d="M ${rad(x - side * 2)} ${rad(hy - 6)} q ${side * 5} 9 0 18" fill="none" stroke="${C.skinDeep}" stroke-width="2.4" stroke-linecap="round"/>`;
  };

  const shade = dx === 0 ? '' :
    `<ellipse clip-path="url(#face-${id})" cx="${rad(hx - dx * 64)}" cy="${rad(hy + 6)}" rx="34" ry="96" fill="${C.skinShade}" opacity="0.5"/>`;
  const glow = `<ellipse clip-path="url(#face-${id})" cx="${rad(fx + 6)}" cy="${rad(fy - 30)}" rx="28" ry="12" fill="${C.skinLight}" opacity="0.32"/>`;

  /* --- beard: follows the jaw, cheeks stay skin */
  const beard = `<path clip-path="url(#face-${id})" d="
      M ${rad(hx - 60)} ${rad(hy + 2)}
      C ${rad(hx - 56)} ${rad(hy + 24)} ${rad(fx - 44)} ${rad(fy + 30)} ${rad(fx - 30)} ${rad(fy + 40)}
      C ${rad(fx - 20)} ${rad(fy + 34)} ${rad(fx - 8)} ${rad(fy + 33)} ${rad(fx)} ${rad(fy + 34)}
      C ${rad(fx + 8)} ${rad(fy + 33)} ${rad(fx + 20)} ${rad(fy + 34)} ${rad(fx + 30)} ${rad(fy + 40)}
      C ${rad(fx + 44)} ${rad(fy + 30)} ${rad(hx + 56)} ${rad(hy + 24)} ${rad(hx + 60)} ${rad(hy + 2)}
      L ${rad(hx + 62)} ${rad(hy + 120)} L ${rad(hx - 62)} ${rad(hy + 120)} Z" fill="${C.beard}"/>
    <path d="M ${rad(hx - 32)} ${rad(hy + 70)} C ${rad(hx - 22)} ${rad(hy + 90)} ${rad(hx + 22)} ${rad(hy + 90)} ${rad(hx + 32)} ${rad(hy + 70)}
             C ${rad(hx + 16)} ${rad(hy + 82)} ${rad(hx - 16)} ${rad(hy + 82)} ${rad(hx - 32)} ${rad(hy + 70)} Z" fill="${C.beard}"/>
    <path clip-path="url(#face-${id})" d="M ${rad(hx - 58)} ${rad(hy + 4)} C ${rad(hx - 54)} ${rad(hy + 22)} ${rad(fx - 42)} ${rad(fy + 28)} ${rad(fx - 30)} ${rad(fy + 37)}
      M ${rad(hx + 58)} ${rad(hy + 4)} C ${rad(hx + 54)} ${rad(hy + 22)} ${rad(fx + 42)} ${rad(fy + 28)} ${rad(fx + 30)} ${rad(fy + 37)}"
      fill="none" stroke="${C.beardEdge}" stroke-width="5" stroke-linecap="round"/>`;

  /* --- mouth (sits in the beard, under the moustache) */
  const my = fy + 52;
  let mouth;
  switch (face.mouth) {
    case 'o':
      mouth = `<ellipse cx="${rad(fx)}" cy="${rad(my + 4)}" rx="7" ry="8.5" fill="${C.mouth}" stroke="${C.lipDark}" stroke-width="2.5"/>`; break;
    case 'grin':
      mouth = `<path d="M ${rad(fx - 17)} ${rad(my - 1)} Q ${rad(fx)} ${rad(my + 22)} ${rad(fx + 17)} ${rad(my - 1)} Z" fill="${C.mouth}" stroke="${C.lipDark}" stroke-width="2"/>
               <path d="M ${rad(fx - 14)} ${rad(my)} L ${rad(fx + 14)} ${rad(my)} L ${rad(fx + 11)} ${rad(my + 5.5)} L ${rad(fx - 11)} ${rad(my + 5.5)} Z" fill="${C.teeth}"/>
               <ellipse cx="${rad(fx)}" cy="${rad(my + 12)}" rx="7" ry="3.5" fill="#d9707b"/>`; break;
    case 'smile':
      mouth = `<path d="M ${rad(fx - 14)} ${rad(my)} Q ${rad(fx)} ${rad(my + 12)} ${rad(fx + 14)} ${rad(my)} Q ${rad(fx)} ${rad(my + 5)} ${rad(fx - 14)} ${rad(my)} Z" fill="${C.teeth}" stroke="${C.lipDark}" stroke-width="2"/>
               <path d="M ${rad(fx - 10)} ${rad(my + 7)} Q ${rad(fx)} ${rad(my + 13)} ${rad(fx + 10)} ${rad(my + 7)}" fill="none" stroke="${C.lip}" stroke-width="3.5" stroke-linecap="round"/>`; break;
    case 'wavy':
      mouth = `<path d="M ${rad(fx - 14)} ${rad(my + 3)} q 4.7 -5 9.3 0 t 9.3 0 t 9.3 0" fill="none" stroke="${C.lip}" stroke-width="3.5" stroke-linecap="round"/>`; break;
    default:
      // neutral: a full lower lip, like the photo
      mouth = `<path d="M ${rad(fx - 13)} ${rad(my + 1)} Q ${rad(fx)} ${rad(my + 13)} ${rad(fx + 13)} ${rad(my + 1)} Q ${rad(fx)} ${rad(my + 3)} ${rad(fx - 13)} ${rad(my + 1)} Z" fill="${C.lip}"/>
               <path d="M ${rad(fx - 10)} ${rad(my + 1)} Q ${rad(fx)} ${rad(my + 3)} ${rad(fx + 10)} ${rad(my + 1)}" fill="none" stroke="${C.lipDark}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  const moustache = `<path d="M ${rad(fx - 24)} ${rad(my + 2)}
      C ${rad(fx - 20)} ${rad(my - 10)} ${rad(fx - 7)} ${rad(my - 11)} ${rad(fx)} ${rad(my - 7)}
      C ${rad(fx + 7)} ${rad(my - 11)} ${rad(fx + 20)} ${rad(my - 10)} ${rad(fx + 24)} ${rad(my + 2)}
      C ${rad(fx + 14)} ${rad(my - 3)} ${rad(fx + 6)} ${rad(my - 2)} ${rad(fx)} ${rad(my - 1)}
      C ${rad(fx - 6)} ${rad(my - 2)} ${rad(fx - 14)} ${rad(my - 3)} ${rad(fx - 24)} ${rad(my + 2)} Z" fill="${C.beard}"/>`;

  /* --- nose: longer, with a soft side shadow */
  const nose = `<path d="M ${rad(fx + 2)} ${rad(fy - 6)} C ${rad(fx - 1)} ${rad(fy + 8)} ${rad(fx - 6)} ${rad(fy + 20)} ${rad(fx - 7)} ${rad(fy + 27)}"
      fill="none" stroke="${C.skinShade}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${rad(fx - 11)} ${rad(fy + 28)} C ${rad(fx - 6)} ${rad(fy + 34)} ${rad(fx + 6)} ${rad(fy + 34)} ${rad(fx + 11)} ${rad(fy + 28)}"
      fill="none" stroke="${C.skinDeep}" stroke-width="3" stroke-linecap="round"/>`;

  const blush = face.blush
    ? `<ellipse cx="${rad(fx - 36)}" cy="${rad(fy + 20)}" rx="10" ry="5.5" fill="${C.blush}"/><ellipse cx="${rad(fx + 36)}" cy="${rad(fy + 20)}" rx="10" ry="5.5" fill="${C.blush}"/>`
    : '';

  /* --- eyes: almond, dark brown */
  const ex = 24, eyeY = fy - 4;
  const look = { x: dx * 2.4, y: dy * 2 };
  function eye(side, kind) {
    const x = fx + side * ex;
    switch (kind) {
      case 'arc':
        return `<path d="M ${rad(x - 9)} ${rad(eyeY + 2)} Q ${rad(x)} ${rad(eyeY - 7)} ${rad(x + 9)} ${rad(eyeY + 2)}" fill="none" stroke="${C.line}" stroke-width="3.6" stroke-linecap="round"/>`;
      case 'sleep':
        return `<path d="M ${rad(x - 9)} ${rad(eyeY)} Q ${rad(x)} ${rad(eyeY + 6)} ${rad(x + 9)} ${rad(eyeY)}" fill="none" stroke="${C.line}" stroke-width="3.6" stroke-linecap="round"/>`;
      case 'wide':
        return `<ellipse cx="${rad(x)}" cy="${rad(eyeY)}" rx="9.5" ry="9.5" fill="${C.eyeWhite}" stroke="${C.line}" stroke-width="2.2"/>
                <circle cx="${rad(x)}" cy="${rad(eyeY)}" r="5.2" fill="${C.iris}"/><circle cx="${rad(x + 1.8)}" cy="${rad(eyeY - 2)}" r="1.7" fill="#fff"/>`;
      case 'spiral':
        return `<path d="M ${rad(x)} ${rad(eyeY)} m -1 0 a 1.5 1.5 0 1 1 3 0 a 4 4 0 1 1 -7 0 a 6.5 6.5 0 1 1 12 0" fill="none" stroke="${C.line}" stroke-width="2.4" stroke-linecap="round"/>`;
      default:
        return `<path d="M ${rad(x - 10)} ${rad(eyeY)} Q ${rad(x)} ${rad(eyeY - 8)} ${rad(x + 10)} ${rad(eyeY)} Q ${rad(x)} ${rad(eyeY + 6)} ${rad(x - 10)} ${rad(eyeY)} Z" fill="${C.eyeWhite}"/>
                <circle cx="${rad(x + look.x)}" cy="${rad(eyeY - 0.5 + look.y)}" r="4.6" fill="${C.iris}"/>
                <circle cx="${rad(x + look.x + 1.6)}" cy="${rad(eyeY - 2.2 + look.y)}" r="1.4" fill="#fff"/>
                <path d="M ${rad(x - 10.5)} ${rad(eyeY)} Q ${rad(x)} ${rad(eyeY - 8.5)} ${rad(x + 10.5)} ${rad(eyeY)}" fill="none" stroke="${C.line}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
  }
  const eyeKind = face.eyes || 'open';
  const eyes = eye(-1, face.leftEye || eyeKind) + eye(1, face.rightEye || eyeKind);

  /* --- brows: thick and straight */
  const lift = face.brows === 'up' ? -7 : 0;
  const brows = [-1, 1].map(s => {
    const x = fx + s * ex, y = eyeY - 17 + lift;
    const tilt = face.brows === 'sad' ? s * -3 : 0;
    return `<path d="M ${rad(x - s * 13)} ${rad(y + 2 + tilt)} C ${rad(x - s * 6)} ${rad(y - 2)} ${rad(x + s * 5)} ${rad(y - 3)} ${rad(x + s * 13)} ${rad(y - tilt)}"
              fill="none" stroke="${C.brow}" stroke-width="6.5" stroke-linecap="round"/>`;
  }).join('');

  /* --- glasses: thin light-gold aviator-ish frames, double bridge */
  const gw = 40, gh = 30, gy = eyeY - 1;
  const lens = s => {
    const cx = fx + s * (ex + 1);
    const l = cx - gw / 2, r = cx + gw / 2, t = gy - gh / 2 - 1, b = gy + gh / 2;
    // squarish top, slightly drooping outer-bottom (aviator)
    const outer = s > 0 ? r : l, inner = s > 0 ? l : r;
    return `<path d="M ${rad(inner)} ${rad(t + 4)} Q ${rad(inner)} ${rad(t)} ${rad(inner + s * 5)} ${rad(t)} L ${rad(outer - s * 6)} ${rad(t)} Q ${rad(outer)} ${rad(t)} ${rad(outer)} ${rad(t + 6)}
                    L ${rad(outer)} ${rad(b - 9)} Q ${rad(outer)} ${rad(b + 1)} ${rad(outer - s * 12)} ${rad(b + 1)} L ${rad(inner + s * 8)} ${rad(b - 1)} Q ${rad(inner)} ${rad(b - 2)} ${rad(inner)} ${rad(b - 9)} Z"
              fill="rgba(255,255,255,0.12)" stroke="${C.frame}" stroke-width="3.2" stroke-linejoin="round"/>
            <path d="M ${rad(cx - s * 12)} ${rad(t + 6)} L ${rad(cx - s * 4)} ${rad(t + 3)}" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>`;
  };
  const glasses = `
    <path d="M ${rad(fx - ex - gw / 2 - 1)} ${rad(gy - 8)} L ${rad(hx - 57 + dx * 4)} ${rad(gy - 5)}" stroke="${C.frame}" stroke-width="2.6" stroke-linecap="round" opacity="${dx > 0.5 ? 0 : 1}"/>
    <path d="M ${rad(fx + ex + gw / 2 + 1)} ${rad(gy - 8)} L ${rad(hx + 57 + dx * 4)} ${rad(gy - 5)}" stroke="${C.frame}" stroke-width="2.6" stroke-linecap="round" opacity="${dx < -0.5 ? 0 : 1}"/>
    ${lens(-1)}${lens(1)}
    <path d="M ${rad(fx - 6)} ${rad(gy - 3)} Q ${rad(fx)} ${rad(gy - 8)} ${rad(fx + 6)} ${rad(gy - 3)}" fill="none" stroke="${C.frame}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M ${rad(fx - 7)} ${rad(gy - gh / 2 - 1)} L ${rad(fx + 7)} ${rad(gy - gh / 2 - 1)}" stroke="${C.frameDark}" stroke-width="2.4" stroke-linecap="round"/>`;

  /* --- hair: short faded sides, tall swept-up top with a side part */
  const hX = hx + dx * 3, hY = hy + dy * 2;
  const sides = `<path clip-path="url(#face-${id})" d="M ${rad(hX - 60)} ${rad(hY - 40)} C ${rad(hX - 60)} ${rad(hY - 12)} ${rad(hX - 58)} ${rad(hY)} ${rad(hX - 54)} ${rad(hY + 8)}
                    L ${rad(hX - 48)} ${rad(hY + 6)} C ${rad(hX - 50)} ${rad(hY - 10)} ${rad(hX - 50)} ${rad(hY - 26)} ${rad(hX - 46)} ${rad(hY - 40)} Z
                    M ${rad(hX + 60)} ${rad(hY - 40)} C ${rad(hX + 60)} ${rad(hY - 12)} ${rad(hX + 58)} ${rad(hY)} ${rad(hX + 54)} ${rad(hY + 8)}
                    L ${rad(hX + 48)} ${rad(hY + 6)} C ${rad(hX + 50)} ${rad(hY - 10)} ${rad(hX + 50)} ${rad(hY - 26)} ${rad(hX + 46)} ${rad(hY - 40)} Z" fill="${C.fade}"/>`;
  const top = `<path d="M ${rad(hX - 59)} ${rad(hY - 28)}
      C ${rad(hX - 70)} ${rad(hY - 60)} ${rad(hX - 60)} ${rad(hY - 94)} ${rad(hX - 28)} ${rad(hY - 106)}
      C ${rad(hX + 2)} ${rad(hY - 118)} ${rad(hX + 48)} ${rad(hY - 114)} ${rad(hX + 64)} ${rad(hY - 90)}
      C ${rad(hX + 74)} ${rad(hY - 74)} ${rad(hX + 70)} ${rad(hY - 48)} ${rad(hX + 59)} ${rad(hY - 28)}
      C ${rad(hX + 55)} ${rad(hY - 44)} ${rad(hX + 46)} ${rad(hY - 56)} ${rad(hX + 30)} ${rad(hY - 61)}
      C ${rad(hX + 14)} ${rad(hY - 67)} ${rad(hX - 4)} ${rad(hY - 66)} ${rad(hX - 18)} ${rad(hY - 62)}
      C ${rad(hX - 36)} ${rad(hY - 57)} ${rad(hX - 51)} ${rad(hY - 48)} ${rad(hX - 59)} ${rad(hY - 28)} Z"
      fill="${C.hair}" stroke="${C.line}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M ${rad(hX - 16)} ${rad(hY - 62)} C ${rad(hX - 18)} ${rad(hY - 82)} ${rad(hX - 4)} ${rad(hY - 100)} ${rad(hX + 22)} ${rad(hY - 108)}" fill="none" stroke="${C.hairHi}" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${rad(hX + 4)} ${rad(hY - 64)} C ${rad(hX + 8)} ${rad(hY - 84)} ${rad(hX + 26)} ${rad(hY - 100)} ${rad(hX + 50)} ${rad(hY - 98)}" fill="none" stroke="${C.hairMid}" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M ${rad(hX - 40)} ${rad(hY - 52)} C ${rad(hX - 46)} ${rad(hY - 72)} ${rad(hX - 38)} ${rad(hY - 92)} ${rad(hX - 16)} ${rad(hY - 104)}" fill="none" stroke="${C.hairHi}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
    <path d="M ${rad(hX + 28)} ${rad(hY - 62)} C ${rad(hX + 38)} ${rad(hY - 78)} ${rad(hX + 52)} ${rad(hY - 88)} ${rad(hX + 64)} ${rad(hY - 84)}" fill="none" stroke="${C.hairMid}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`;

  return `<clipPath id="face-${id}"><path d="${face_d}"/></clipPath>
    ${ear(-1)}${ear(1)}
    <path d="${face_d}" fill="${C.skin}" stroke="${C.line}" stroke-width="3"/>
    ${glow}${shade}${sides}${beard}${mouth}${moustache}${nose}${blush}${eyes}${brows}${glasses}${top}`;
}

/* --------------------------------------------------------------- symbols */
const star = (x, y, r) => `<path d="M ${x} ${y - r} C ${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} C ${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} C ${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} C ${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${C.star}" stroke="${C.line}" stroke-width="2.5" stroke-linejoin="round"/>`;
const SYMBOLS = {
  heart: `<path d="M 272 62 C 272 62 246 46 246 30 C 246 20 254 14 262 14 C 267 14 270 17 272 21 C 274 17 277 14 282 14 C 290 14 298 20 298 30 C 298 46 272 62 272 62 Z" fill="${C.heart}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`,
  sparkle: star(92, 46, 15) + star(124, 18, 10) + star(272, 36, 17),
  zzz: [[252, 56, 14], [276, 32, 11], [296, 12, 8]].map(([x, y, s]) =>
    `<path d="M ${x} ${y} h ${s} l -${s} ${s} h ${s}" fill="none" stroke="${C.zzz}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')
};

/* ----------------------------------------------------------------- cells */
const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
];
const REACTIONS = [
  { name: 'blink', face: { eyes: 'arc' } },
  { name: 'heart', face: { eyes: 'arc', mouth: 'smile' }, sym: 'heart' },
  { name: 'sparkle', face: { eyes: 'arc', mouth: 'smile' }, sym: 'sparkle' },
  { name: 'surprised', face: { eyes: 'wide', mouth: 'o', brows: 'up' } },
  { name: 'wink', face: { leftEye: 'open', rightEye: 'arc', mouth: 'smile' } },
  { name: 'bashful', face: { eyes: 'arc', mouth: 'smile', blush: true, brows: 'sad' } },
  { name: 'sleepy', face: { eyes: 'sleep', brows: 'sad' }, sym: 'zzz' },
  { name: 'dizzy', face: { eyes: 'spiral', mouth: 'wavy', brows: 'up' } },
  { name: 'delighted', face: { eyes: 'arc', mouth: 'grin', brows: 'up' } }
];

const DEFS = `<defs>
  <linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0.85" stop-color="#fff"/>
    <stop offset="0.965" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <mask id="fade" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="360">
    <rect width="360" height="360" fill="url(#fadeG)"/>
  </mask>
</defs>`;

function cell(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 360 360">${DEFS}${body()}${inner}</svg>`;
}

function sheetSvg(cells) {
  const parts = cells.map((c, i) => {
    const x = (i % 3) * TILE, y = Math.floor(i / 3) * TILE;
    return `<svg x="${x}" y="${y}" width="${TILE}" height="${TILE}" viewBox="0 0 360 360">${c.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE * 3}" height="${TILE * 3}" viewBox="0 0 ${TILE * 3} ${TILE * 3}">${parts.join('')}</svg>`;
}

async function build(name, cells) {
  const svg = sheetSvg(cells);
  fs.writeFileSync(path.join(OUT, `afaque-${name}.svg`), svg);
  const info = await sharp(Buffer.from(svg), { density: 72 })
    .resize(TILE * 3, TILE * 3)
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(path.join(OUT, `afaque-${name}.webp`));
  console.log(name, info.width + 'x' + info.height, info.size + ' bytes');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await build('directions', DIRECTIONS.map(([dx, dy], i) => cell(head(dx, dy, {}, 'd' + i))));
  await build('reactions', REACTIONS.map((r, i) => cell(head(0, 0, r.face, 'r' + i) + (r.sym ? SYMBOLS[r.sym] : ''))));
})();

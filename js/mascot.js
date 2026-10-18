/*
 * Mascot — Afaque's 3D avatar in the bottom-right corner. Only his head and
 * eyes move: the eyes follow your cursor, the head leans gently after them,
 * he blinks now and then, and both settle back to neutral when the cursor
 * rests or leaves the window. The shoulders never move.
 *
 * The face is the supplied 3D render (img/mascot/afaque-head.webp), a single
 * flattened image. To move the head without the body it is drawn twice:
 * clipped to the shoulders (static) and clipped to the head along the beard
 * line (rotated/nudged around the neck, never scaled). Live eyes are drawn
 * in SVG exactly over the render's eyes (positions traced from the 1024×1536
 * source, see img/mascot/README.md): sclera, a layered iris, a pupil that
 * widens as you approach, fixed catch-lights, eyelids for blinks and winks,
 * lower lids for a smile, and a glint that sweeps across the glasses.
 *
 * Behaviour is adapted from page-mascot's <Mascot> React component
 * (https://github.com/nilbuild/page-mascot, v0.1.0, src/mascot.tsx): the
 * corner placement and blink. This site is plain static HTML, so it is a
 * dependency-free port. Clicking the avatar opens the AI Portfolio Guide
 * (js/concierge.js). Additions for this site: per-eye tracking, the head rig,
 * auto-hide while scrolling on touch screens, hiding near the contact links
 * and the open mobile menu, and the flight from the nav. Cursor tracking is
 * mouse/pen only; touch screens get a still avatar that just blinks.
 *
 * page-mascot is MIT licensed:
 *   Copyright (c) 2026 Kamran Ahmed <https://kamran.fyi>
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the
 *   following conditions: The above copyright notice and this permission
 *   notice shall be included in all copies or substantial portions of the
 *   Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 *
 * Character art: img/mascot/ (see img/mascot/README.md).
 */
(function () {
  'use strict';

  var FACE = 'img/mascot/afaque-head.webp';
  // The overlay uses the source render's pixel space; the headshot is the
  // 860×860 square at (82, 30) of the 1024×1536 original.
  var VB = { x: 82, y: 30, w: 860 };
  // Same ellipse as .mascot-disc inside .mascot-body (css/main.css), so the
  // shoulders stay inside the disc while the hair rises above it.
  var DISC = { cx: 512, cy: 536.7, rx: 337.9, ry: 353.3 };

  // Eye geometry traced from the render (source px).
  var EYES = [
    {
      id: 'L',
      open: 'M353 471 C362 457 380 443 406 441 C428 440 446 452 452 468 C455 476 457 483 458 489 C446 498 425 500 405 499 C384 498 365 488 353 471 Z',
      upper: 'M353 471 C362 457 380 443 406 441 C428 440 446 452 452 468 C455 476 457 483 458 489',
      lower: 'M458 489 C446 498 425 500 405 499 C384 498 365 488 353 471',
      box: { x: 353, y: 440, w: 105, h: 60 },
      iris: { x: 416, y: 463, r: 34 },
      spec: { x: 407, y: 456 },
      lid: 'M343 300 H468 V491 C446 502 425 504 405 503 C384 502 365 492 351 475 H343 Z',
      lash: 'M468 491 C446 502 425 504 405 503 C384 502 365 492 351 475',
      smile: 'M343 600 H468 V498 C450 470 430 462 405 462 C380 462 362 474 351 490 H343 Z',
      smileEdge: 'M468 498 C450 470 430 462 405 462 C380 462 362 474 351 490',
      lens: 'M338 412 L478 416 Q495 418 494 436 L486 528 Q482 552 458 552 L352 548 Q324 546 322 520 L320 432 Q320 412 338 412 Z',
      lashes: [[356, 480], [364, 488], [374, 494], [386, 499], [399, 502], [413, 503], [427, 502], [441, 499]],
      outer: -1
    },
    {
      id: 'R',
      open: 'M572 502 C580 486 597 466 621 462 C643 460 662 470 668 484 C671 492 673 500 675 507 C660 518 640 523 620 522 C600 521 583 513 572 502 Z',
      upper: 'M572 502 C580 486 597 466 621 462 C643 460 662 470 668 484 C671 492 673 500 675 507',
      lower: 'M675 507 C660 518 640 523 620 522 C600 521 583 513 572 502',
      box: { x: 572, y: 460, w: 103, h: 63 },
      iris: { x: 616.5, y: 492.5, r: 30.7 },
      spec: { x: 606, y: 481 },
      lid: 'M562 320 H685 V509 C660 522 640 527 620 526 C600 525 583 517 570 504 H562 Z',
      lash: 'M685 509 C660 522 640 527 620 526 C600 525 583 517 570 504',
      smile: 'M562 620 H685 V516 C668 490 646 484 622 484 C598 484 582 494 570 510 H562 Z',
      smileEdge: 'M685 516 C668 490 646 484 622 484 C598 484 582 494 570 510',
      lens: 'M562 432 L700 432 Q720 434 718 456 L712 536 Q708 562 684 562 L582 560 Q556 558 552 534 L545 456 Q544 432 562 432 Z',
      lashes: [[672, 513], [663, 519], [651, 523], [638, 526], [625, 526], [612, 525], [599, 522], [587, 517]],
      outer: 1
    }
  ];
  var LID_TRAVEL = 70;       // px the upper lid moves between open and closed
  var SMILE_TRAVEL = 46;     // px the lower lid rises for smiling eyes
  var EYE_X = 13;            // iris travel sideways (source px)
  var EYE_UP = 8;            // …up (the upper lid hides more of the iris)
  var EYE_DOWN = 11;         // …down (the iris tucks under the lower lid)
  var FULL_AT = 170;         // pointer distance (CSS px) for full eye travel
  var DEAD_ZONE = 10;
  // Head pose. The render is one flattened image, so the head is cut from the
  // shoulders along the bottom of the beard and only that layer moves; it is
  // rotated and nudged (never scaled) so the artwork is not distorted.
  var NECK = { x: 512, y: 790 };   // pivot the head turns around
  var HEAD_ROLL = 5;         // degrees the head leans toward the cursor side
  var HEAD_SHIFT_X = 7;      // source px it drifts sideways with that lean
  var HEAD_SHIFT_Y = 9;      // source px it dips/lifts to nod toward the cursor
  var HEAD_REACH = 480;      // horizontal cursor distance (CSS px) for a full turn
  var NEAR_PX = 170;         // cursor this close to the avatar = "approaching"
  var NEAR_TILT = 3;         // extra, curious head tilt (degrees) when approached
  var IDLE_MS = 3000;        // cursor still this long → ease back to neutral
  // Smoothing time constants (ms). Frame-rate independent: the head trails the
  // eyes slightly, the way people look round.
  var TAU = { eye: 70, head: 190, near: 260, lid: 35, smile: 80, pupil: 160 };
  // Head layer: everything above the beard's lower edge. Shoulders: the rest.
  var HEAD_CLIP = 'M82 30 H942 V688 H732 C722 712 704 732 680 752 C640 780 580 800 512 803 C444 800 384 785 340 762 C308 744 286 724 270 700 L262 688 H82 Z';
  var BODY_CLIP = 'M82 688 H262 L270 700 C286 724 308 744 340 762 C384 785 444 800 512 803 C580 800 640 780 680 752 C704 732 722 712 732 688 H942 V890 H82 Z';
  // The nav profile and the scroll flight use the head-and-chest avatar.
  var AVATAR = 'img/mascot/afaque-3d-bust.webp';

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function f(n) { return (+n).toFixed(2); }

  /* ---- the SVG: render + live eyes ---- */
  function artMarkup() {
    var d = '', body = '';
    EYES.forEach(function (e) {
      var b = e.box, i = e.iris;
      d +=
        '<clipPath id="avEye' + e.id + '"><path d="' + e.open + '"/></clipPath>' +
        '<clipPath id="avLens' + e.id + '"><path d="' + e.lens + '"/></clipPath>' +
        '<linearGradient id="avLid' + e.id + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + (b.y - 8) + '" x2="0" y2="' + (b.y + b.h + 4) + '">' +
          '<stop offset="0" stop-color="#b9705d"/><stop offset=".3" stop-color="#d0846a"/><stop offset=".62" stop-color="#dc9072"/><stop offset=".88" stop-color="#cf8165"/><stop offset="1" stop-color="#b56c58"/></linearGradient>' +
        // Soft-edged window for the eyelid: the eye opening, grown a few px and feathered,
        // so a closed lid melts into the skin and covers the render's own lash line.
        '<mask id="avLidMask' + e.id + '" maskUnits="userSpaceOnUse" x="' + (b.x - 20) + '" y="' + (b.y - 20) + '" width="' + (b.w + 40) + '" height="' + (b.h + 40) + '">' +
          '<path d="' + e.open + '" fill="#fff" stroke="#fff" stroke-width="7" stroke-linejoin="round" filter="url(#avFeather)"/></mask>' +
        '<radialGradient id="avScl' + e.id + '" gradientUnits="userSpaceOnUse" cx="' + f(b.x + b.w / 2) + '" cy="' + f(b.y + b.h * 0.62) + '" r="' + f(b.w * 0.62) + '">' +
          '<stop offset="0" stop-color="#f6eeec"/><stop offset=".55" stop-color="#e6d6d3"/><stop offset=".85" stop-color="#c9aba6"/><stop offset="1" stop-color="#a98580"/></radialGradient>' +
        '<linearGradient id="avTop' + e.id + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + b.y + '" x2="0" y2="' + f(b.y + b.h * 0.55) + '">' +
          '<stop offset="0" stop-color="#3b1d18" stop-opacity=".62"/><stop offset=".45" stop-color="#5a2e26" stop-opacity=".22"/><stop offset="1" stop-color="#5a2e26" stop-opacity="0"/></linearGradient>';
      var fibres = '';
      for (var k = 0; k < 36; k++) {
        var a = (k / 36) * Math.PI * 2 + (k % 2 ? 0.05 : 0);
        var r0 = i.r * (0.5 + (k % 3) * 0.04), r1 = i.r * (0.86 - (k % 4) * 0.05);
        fibres += '<path d="M' + f(i.x + Math.cos(a) * r0) + ' ' + f(i.y + Math.sin(a) * r0) + 'L' + f(i.x + Math.cos(a) * r1) + ' ' + f(i.y + Math.sin(a) * r1) + '"/>';
      }
      body +=
        '<g class="av-eye" clip-path="url(#avEye' + e.id + ')">' +
          '<rect x="' + (b.x - 6) + '" y="' + (b.y - 6) + '" width="' + (b.w + 12) + '" height="' + (b.h + 12) + '" fill="url(#avScl' + e.id + ')"/>' +
          '<g class="av-iris">' +
            '<circle cx="' + i.x + '" cy="' + i.y + '" r="' + (i.r + 2.5) + '" fill="#6d4a44" opacity=".25"/>' +
            '<circle cx="' + i.x + '" cy="' + i.y + '" r="' + i.r + '" fill="url(#avIris)"/>' +
            '<g stroke="#9c5f38" stroke-width="1.2" stroke-linecap="round" opacity=".22">' + fibres + '</g>' +
            '<circle cx="' + i.x + '" cy="' + i.y + '" r="' + f(i.r * 0.62) + '" fill="none" stroke="#2a1410" stroke-width="2" opacity=".35"/>' +
            '<circle class="av-pupil" cx="' + i.x + '" cy="' + i.y + '" r="' + f(i.r * 0.5) + '" fill="#030206"/>' +
            '<circle cx="' + i.x + '" cy="' + i.y + '" r="' + i.r + '" fill="url(#avIrisShade)"/>' +
            '<circle cx="' + i.x + '" cy="' + i.y + '" r="' + f(i.r - 1.4) + '" fill="none" stroke="#0d0708" stroke-width="3.2" opacity=".85"/>' +
          '</g>' +
          '<g class="av-spec">' +
            '<ellipse cx="' + e.spec.x + '" cy="' + e.spec.y + '" rx="6.2" ry="5.6" fill="#fff"/>' +
            '<circle cx="' + f(e.spec.x + i.r * 0.55) + '" cy="' + f(e.spec.y + i.r * 0.62) + '" r="2.4" fill="#fff" opacity=".55"/>' +
          '</g>' +
          '<rect x="' + (b.x - 6) + '" y="' + (b.y - 6) + '" width="' + (b.w + 12) + '" height="' + (b.h + 12) + '" fill="url(#avTop' + e.id + ')"/>' +
          '<g class="av-smile" transform="translate(0 ' + SMILE_TRAVEL + ')"><path d="' + e.smile + '" fill="url(#avLow)"/><path d="' + e.smileEdge + '" fill="none" stroke="#b5694e" stroke-width="2" opacity=".7"/></g>' +
        '</g>' +
        '<g mask="url(#avLidMask' + e.id + ')">' +
          '<g class="av-lid" transform="translate(0 ' + (-LID_TRAVEL) + ')"><path d="' + e.lid + '" fill="url(#avLid' + e.id + ')"/>' +
            '<ellipse cx="' + f(b.x + b.w * 0.5) + '" cy="' + f(b.y + b.h * 0.5) + '" rx="' + f(b.w * 0.3) + '" ry="' + f(b.h * 0.26) + '" fill="url(#avLidHi)"/>' +
            '<path d="' + e.lash + '" transform="translate(0 -7)" fill="none" stroke="#c07a5c" stroke-width="5" stroke-linecap="round" opacity=".35"/>' +
            '<path d="' + e.lash + '" fill="none" stroke="#1d1215" stroke-width="4" stroke-linecap="round"/></g>' +
        '</g>' +
        '<path class="av-rim-up" d="' + e.upper + '" fill="none" stroke="#1f1316" stroke-width="3" stroke-linecap="round" opacity=".9"/>' +
        '<path class="av-rim-low" d="' + e.lower + '" fill="none" stroke="#c98a7c" stroke-width="1.6" stroke-linecap="round" opacity=".65"/>' +
        '<g class="av-shut" opacity="0" fill="none" stroke="#1a1013" stroke-linecap="round">' +
          '<path d="' + e.lash + '" stroke-width="4.4"/>' +
          e.lashes.map(function (pt, n) {
            var t = n / (e.lashes.length - 1);                // 0 at the outer corner
            var len = 8 - t * 3.5, lean = e.outer * (5.5 - t * 4.5);
            return '<path d="M' + pt[0] + ' ' + pt[1] + ' q' + f(lean * 0.4) + ' ' + f(len * 0.7) + ' ' + f(lean) + ' ' + f(len) + '" stroke-width="' + f(1.9 - t * 0.8) + '"/>';
          }).join('') +
        '</g>' +
        '<g clip-path="url(#avLens' + e.id + ')"><rect class="av-glint" x="' + (b.x - 260) + '" y="380" width="130" height="220" fill="url(#avGlint)" transform="translate(-200 0)"/></g>';
    });
    return '<svg class="av" xmlns="http://www.w3.org/2000/svg" viewBox="' + VB.x + ' ' + VB.y + ' ' + VB.w + ' ' + VB.w + '" focusable="false">' +
      '<defs>' +
        '<clipPath id="avDisc"><ellipse cx="' + DISC.cx + '" cy="' + DISC.cy + '" rx="' + DISC.rx + '" ry="' + DISC.ry + '"/><rect x="' + VB.x + '" y="' + VB.y + '" width="' + VB.w + '" height="' + f(DISC.cy - VB.y) + '"/></clipPath>' +
        '<radialGradient id="avNeck"><stop offset="0" stop-color="#5a3528"/><stop offset=".7" stop-color="#7d4a37"/><stop offset="1" stop-color="#9a5d45" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="avHead"><path d="' + HEAD_CLIP + '"/></clipPath>' +
        '<clipPath id="avBody"><path d="' + BODY_CLIP + '"/></clipPath>' +
        '<filter id="avFeather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
        '<radialGradient id="avLidHi"><stop offset="0" stop-color="#ffd9c2" stop-opacity=".26"/><stop offset="1" stop-color="#ffd9c2" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="avIris" cx=".5" cy=".58" r=".55">' +
          '<stop offset="0" stop-color="#07060b"/><stop offset=".5" stop-color="#0d0a10"/><stop offset=".64" stop-color="#2b1712"/><stop offset=".8" stop-color="#55301d"/><stop offset=".92" stop-color="#2c1610"/><stop offset="1" stop-color="#0b0607"/></radialGradient>' +
        '<linearGradient id="avIrisShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05030a" stop-opacity=".85"/><stop offset=".55" stop-color="#05030a" stop-opacity=".25"/><stop offset="1" stop-color="#05030a" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="avLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98c6b"/><stop offset=".2" stop-color="#f0a983"/><stop offset="1" stop-color="#f6b892"/></linearGradient>' +
        '<linearGradient id="avGlint" x1="0" y1="0" x2="1" y2=".55"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".4" stop-color="#fff" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset=".58" stop-color="#fff" stop-opacity=".08"/><stop offset=".7" stop-color="#fff" stop-opacity=".3"/><stop offset=".76" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        d +
      '</defs>' +
      '<g clip-path="url(#avDisc)">' +
        // Shoulders stay put; a shadowed neck sits behind the beard so turning
        // the head never opens a gap.
        '<ellipse cx="' + NECK.x + '" cy="770" rx="135" ry="42" fill="url(#avNeck)"/>' +
        '<image href="' + FACE + '" x="' + VB.x + '" y="' + VB.y + '" width="' + VB.w + '" height="' + VB.w + '" clip-path="url(#avBody)"/>' +
        '<g class="av-tilt">' +
          '<image href="' + FACE + '" x="' + VB.x + '" y="' + VB.y + '" width="' + VB.w + '" height="' + VB.w + '" clip-path="url(#avHead)"/>' +
          body +
        '</g>' +
      '</g>' +
    '</svg>';
  }

  // Only mount once the face has loaded — the site works the same without it.
  var pre = new Image();
  pre.onload = function () { mount(); };
  pre.src = FACE;

  function mount() {
    var root = document.createElement('div');
    root.className = 'mascot is-av';
    root.innerHTML =
      '<button type="button" class="mascot-btn" aria-label="Chat with Afaque’s AI Portfolio Guide" aria-haspopup="dialog" aria-controls="concierge" aria-expanded="false">' +
        '<span class="mascot-disc" aria-hidden="true"></span>' +
        '<span class="mascot-body" aria-hidden="true">' + artMarkup() + '</span>' +
      '</button>' +
      // A short hello that appears once, so visitors know the avatar opens a chat.
      '<span class="mascot-bubble" role="status" aria-live="polite"></span>';

    var btn = root.querySelector('.mascot-btn');
    var art = root.querySelector('svg.av');
    var tiltEl = art.querySelector('.av-tilt');
    var eyes = EYES.map(function (g, idx) {
      var group = art.querySelectorAll('.av-eye')[idx];
      return {
        g: g,
        iris: group.querySelector('.av-iris'),
        spec: group.querySelector('.av-spec'),
        pupil: group.querySelector('.av-pupil'),
        lidEl: art.querySelectorAll('.av-lid')[idx],
        rimUp: art.querySelectorAll('.av-rim-up')[idx],
        rimLow: art.querySelectorAll('.av-rim-low')[idx],
        shut: art.querySelectorAll('.av-shut')[idx],
        smileEl: group.querySelector('.av-smile'),
        glint: art.querySelectorAll('.av-glint')[idx],
        x: 0, y: 0, tx: 0, ty: 0,
        lid: 0, lidT: 0,          // 0 open … 1 closed
        bl: null,                 // running blink: { t0, from, close, hold, open }
        smile: 0, smileT: 0,      // 0 hidden … 1 smiling eyes
        pr: g.iris.r * 0.5
      };
    });

    var S = {
      hx: 0, hy: 0, hxT: 0, hyT: 0,   // head turn (x) and nod (y), each -1…1
      near: 0, nearT: 0,              // 0 … 1 as the cursor approaches the avatar
      pupilT: 0.5,                    // pupil radius as a share of the iris radius
      dizzyUntil: 0, hold: 0, calm: false
    };
    var timers = [];

    // Everything the mascot listens to, so it can all be removed again.
    var offs = [];
    function listen(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      offs.push(function () { target.removeEventListener(type, fn, opts); });
    }

    requestAnimationFrame(function () { root.classList.add('is-ready'); });

    /* ---- render loop ----
       One rAF loop eases every value toward its target and stops itself once
       everything has settled, so nothing runs while the avatar is at rest. */
    var loop = 0, lastFrame = 0;
    var px = null, py = null, aimPending = false;
    function kick() { if (!loop) { lastFrame = 0; loop = requestAnimationFrame(step); } }
    function ease(tau, dt) { return 1 - Math.exp(-dt / tau); }

    function step(now) {
      loop = 0;
      var dt = lastFrame ? Math.min(64, now - lastFrame) : 16;
      lastFrame = now;
      var still = reduceMQ.matches;
      var busy = false;
      var spin = now < S.dizzyUntil;
      // Pointer moves are only stored by the event handler; the (layout-reading)
      // aim runs here, at most once per frame.
      if (aimPending) { aimPending = false; aim(px, py); }

      var aE = still ? 1 : ease(TAU.eye, dt);
      eyes.forEach(function (e, n) {
        var tx = e.tx, ty = e.ty;
        if (spin) {
          var a = now / 85 + n * Math.PI;
          tx = Math.cos(a) * EYE_X * 0.9;
          ty = Math.sin(a) * EYE_DOWN;
        }
        e.x += (tx - e.x) * (spin ? 1 : aE);
        e.y += (ty - e.y) * (spin ? 1 : aE);
        // The upper lid follows a downward gaze a little, like a real eye.
        var rest = clamp(e.lidT + (e.y > 0 ? (e.y / EYE_DOWN) * 0.22 : 0), 0, 1);
        if (e.bl) {
          // Timed blink: shut fast (ease-in), hold fully closed, open a bit slower (ease-out).
          var b = e.bl, t = now - b.t0, u;
          if (t < b.close) { u = t / b.close; e.lid = b.from + (1 - b.from) * u * u; }
          else if (t < b.close + b.hold) e.lid = 1;
          else if (t < b.close + b.hold + b.open) { u = (t - b.close - b.hold) / b.open; e.lid = 1 - (1 - rest) * (1 - Math.pow(1 - u, 3)); }
          else { e.bl = null; e.lid = rest; }
          busy = true;
        } else {
          e.lid += (rest - e.lid) * (still ? 1 : ease(TAU.lid, dt));
        }
        e.smile += (e.smileT - e.smile) * (still ? 1 : ease(TAU.smile, dt));
        var prT = e.g.iris.r * S.pupilT;
        e.pr += (prT - e.pr) * (still ? 1 : ease(TAU.pupil, dt));
        if (Math.abs(tx - e.x) > 0.03 || Math.abs(ty - e.y) > 0.03 || Math.abs(rest - e.lid) > 0.003 ||
            Math.abs(e.smileT - e.smile) > 0.003 || Math.abs(prT - e.pr) > 0.02) busy = true;
        e.iris.setAttribute('transform', 'translate(' + f(e.x) + ' ' + f(e.y) + ')');
        // Catch-lights are reflections of the room, so they barely move.
        e.spec.setAttribute('transform', 'translate(' + f(e.x * 0.3) + ' ' + f(e.y * 0.3) + ')');
        e.pupil.setAttribute('r', f(e.pr));
        e.lidEl.setAttribute('transform', 'translate(0 ' + f((e.lid - 1) * LID_TRAVEL) + ')');
        // As the lid comes down the open-eye rims fade out and the closed lash
        // line (with its little lashes) fades in.
        e.rimUp.setAttribute('opacity', f(0.9 * (1 - e.lid)));
        e.rimLow.setAttribute('opacity', f(0.65 * (1 - e.lid * 0.85)));
        e.shut.setAttribute('opacity', f(clamp((e.lid - 0.78) / 0.22, 0, 1)));
        e.smileEl.setAttribute('transform', 'translate(0 ' + f((1 - e.smile) * SMILE_TRAVEL) + ')');
      });

      // Head: only the head layer moves; the shoulders never do.
      if (still) {
        S.hx = S.hy = S.near = 0;
      } else {
        var aH = ease(TAU.head, dt), aN = ease(TAU.near, dt);
        S.hx += (S.hxT - S.hx) * aH;
        S.hy += (S.hyT - S.hy) * aH;
        S.near += (S.nearT - S.near) * aN;
        if (Math.abs(S.hxT - S.hx) > 0.001 || Math.abs(S.hyT - S.hy) > 0.001 || Math.abs(S.nearT - S.near) > 0.002) busy = true;
      }
      var wobble = spin ? Math.sin(now / 110) * 5 : 0;
      tiltEl.setAttribute('transform',
        'translate(' + f(S.hx * HEAD_SHIFT_X) + ' ' + f(S.hy * HEAD_SHIFT_Y) + ') ' +
        'rotate(' + f(S.hx * HEAD_ROLL + S.near * NEAR_TILT + wobble) + ' ' + NECK.x + ' ' + NECK.y + ')');

      if (busy || spin) loop = requestAnimationFrame(step);
    }

    /* ---- eyes and head follow the pointer ---- */
    // Each eye aims from its own spot on screen, so the two converge a
    // little when the cursor comes close — it reads as real focus.
    function aim(x, y) {
      if (x === null || performance.now() < S.dizzyUntil) return;
      var r = art.getBoundingClientRect();
      if (!r.width) return;
      var k = r.width / VB.w;
      // The mascot sits at the bottom of the screen, so nearly every cursor is
      // "above" it. Far away, the vertical gaze follows where the cursor is on
      // the screen (top = up, bottom = down); up close it aims straight at it.
      var vh = window.innerHeight || 800;
      var vy = clamp((y - vh * 0.42) / (vh * 0.4), -1, 1);
      var tyView = vy < 0 ? vy * EYE_UP : vy * EYE_DOWN;
      eyes.forEach(function (e) {
        var dx = x - (r.left + (e.g.iris.x - VB.x) * k);
        var dy = y - (r.top + (e.g.iris.y - VB.y) * k);
        var d = Math.hypot(dx, dy);
        if (d < DEAD_ZONE) { e.tx = e.ty = 0; return; }
        var reach = Math.min(1, d / FULL_AT);
        var near = 1 - Math.min(1, d / 260);
        var tyAim = (dy / d) * (dy < 0 ? EYE_UP : EYE_DOWN) * reach;
        e.tx = (dx / d) * EYE_X * reach;
        e.ty = clamp(tyView + (tyAim - tyView) * near, -EYE_UP, EYE_DOWN);
      });
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dist = Math.hypot(x - cx, y - cy);
      var calm = S.calm ? 0.3 : 1;
      S.hxT = clamp((x - cx) / HEAD_REACH, -1, 1) * calm;
      S.hyT = vy * calm;
      // Approaching: a small curious head tilt and slightly wider pupils.
      S.nearT = S.calm ? 0 : clamp(1 - (dist - r.width * 0.45) / NEAR_PX, 0, 1);
      S.pupilT = 0.5 + S.nearT * 0.08;
    }
    function neutral() {
      eyes.forEach(function (e) { e.tx = e.ty = 0; });
      S.hxT = S.hyT = S.nearT = 0;
      S.pupilT = 0.5;
      kick();
    }

    /* ---- blinking, winks ---- */
    function setLids(v, which) { eyes.forEach(function (e, n) { if (which == null || which === n) e.lidT = v; }); kick(); }
    function setSmile(v) { eyes.forEach(function (e) { e.smileT = v; }); kick(); }
    // A natural blink: ~70 ms to shut fully, a short hold, ~150 ms to open.
    function blink(which, hold) {
      var t0 = performance.now();
      eyes.forEach(function (e, n) {
        if (which == null || which === n) e.bl = { t0: t0, from: e.lid, close: 70, hold: hold || 45, open: 150 };
      });
      kick();
    }
    // Occasional idle blinks (also on touch screens — the only idle motion there).
    var blinkTimer = 0;
    (function blinkLoop() {
      blinkTimer = setTimeout(function () {
        if (!reduceMQ.matches && !document.hidden && !S.hold) {
          blink();
          if (Math.random() < 0.15) timers.push(setTimeout(function () { blink(); }, 320)); // the odd double blink
        }
        blinkLoop();
      }, 2800 + Math.random() * 4200);
    })();

    // Glasses glint: a soft highlight sweeps across both lenses now and then.
    function glint() {
      if (reduceMQ.matches || !eyes[0].glint.animate) return;
      eyes.forEach(function (e, n) {
        e.glint.animate([{ transform: 'translate(-40px, 0)' }, { transform: 'translate(420px, 0)' }],
          { duration: 900, delay: n * 110, easing: 'cubic-bezier(.4,0,.2,1)' });
      });
    }
    var glintTimer = 0;
    (function glintLoop() { glintTimer = setTimeout(function () { if (!document.hidden) glint(); glintLoop(); }, 7000 + Math.random() * 5000); })();
    listen(btn, 'mouseenter', glint);

    /* ---- input (mouse / pen only; touch screens keep a still avatar) ---- */
    var idleTimer = 0;
    function onPointer(e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      px = e.clientX; py = e.clientY;
      aimPending = true;
      kick();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(neutral, IDLE_MS);
    }
    function onScroll() { if (px !== null) { aimPending = true; kick(); } }
    function onLeave(e) { if (!e.relatedTarget) { px = null; clearTimeout(idleTimer); neutral(); } }
    function onBlur() { px = null; clearTimeout(idleTimer); neutral(); }
    var tracking = false;
    var trackOffs = [];
    function setTracking(on) {
      if (on === tracking) return;
      tracking = on;
      if (on) {
        var before = offs.length;
        listen(window, 'pointermove', onPointer, { passive: true });
        listen(window, 'scroll', onScroll, { passive: true });
        listen(document, 'mouseout', onLeave);
        listen(window, 'blur', onBlur);
        trackOffs = offs.splice(before);
      } else {
        trackOffs.forEach(function (off) { off(); });
        trackOffs = [];
        px = null;
        clearTimeout(idleTimer);
        neutral();
      }
    }
    setTracking(fineMQ.matches);
    function onMQ() { setTracking(fineMQ.matches); }
    listen(fineMQ, 'change', onMQ);

    // Tear everything down when the page is really going away (not when it is
    // only being put into the back/forward cache).
    listen(window, 'pagehide', function (e) {
      if (e.persisted) return;
      setTracking(false);
      cancelAnimationFrame(loop); loop = 0;
      clearTimeout(blinkTimer); clearTimeout(glintTimer); clearTimeout(idleTimer);
      timers.forEach(clearTimeout);
      offs.forEach(function (off) { off(); }); offs = [];
    });

    /* ---- click: open the AI Portfolio Guide (js/concierge.js) ---- */
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    listen(btn, 'click', function () {
      clearTimers();
      hush();
      // A quick nod and blink acknowledge the click; the head only, never the body.
      if (!reduceMQ.matches) { S.hy += 0.45; kick(); }
      S.hold = 1;
      blink(null, 110);
      later(function () { S.hold = 0; }, 400);
      if (window.Concierge) window.Concierge.toggle(btn);
    });

    // While the guide is open the avatar stays calm: eyes still follow, the head barely moves.
    listen(window, 'concierge:state', function (e) {
      var open = !!(e.detail && e.detail.open);
      S.calm = open;
      if (open) hush();
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (px !== null) { aimPending = true; kick(); } else neutral();
    });

    /* ---- stay out of the way ---- */
    var hideReasons = {};
    function setHidden(reason, on) {
      if (on) hideReasons[reason] = true; else delete hideReasons[reason];
      applyHidden();
    }
    function applyHidden() {
      var hidden = !root.classList.contains('is-docked') && Object.keys(hideReasons).length > 0;
      root.classList.toggle('is-away', hidden);
      if (hidden) hush(false); else maybeGreet();
      btn.tabIndex = hidden ? -1 : 0;
    }

    /* ---- hello bubble ----
       The first time the avatar is settled and in view, a speech bubble says
       what it is and invites a question. It stays ~7s, goes away as soon as
       the visitor opens the guide, and shows once per browser session. */
    var bubble = root.querySelector('.mascot-bubble');
    var GREET_KEY = 'aj-guide-hello';
    var greeted = false, greetTimer = null, greetHide = null, inView = true;
    try { greeted = sessionStorage.getItem(GREET_KEY) === '1'; } catch (e) {}

    // Stop any pending or showing hello. done=true: never show it again this session.
    function hush(done) {
      clearTimeout(greetTimer); clearTimeout(greetHide); greetTimer = greetHide = null;
      root.classList.remove('is-talking');
      if (done !== false) {
        greeted = true;
        try { sessionStorage.setItem(GREET_KEY, '1'); } catch (e) {}
      }
    }
    function canGreet() { return !greeted && !S.calm && inView && !root.classList.contains('is-away'); }
    function greet() {
      if (!canGreet()) return;
      greeted = true;
      try { sessionStorage.setItem(GREET_KEY, '1'); } catch (e) {}
      bubble.innerHTML =
        '<b>Hi, I’m Afaque’s AI guide 👋</b>' +
        '<span>Ask me anything — his apps, stack, rates or availability.</span>' +
        '<small>Tap to chat</small>';
      void bubble.offsetWidth; // it was display:none while empty — let the fade-in run
      root.classList.add('is-talking');
      greetHide = setTimeout(function () { root.classList.remove('is-talking'); }, 7000);
    }
    function maybeGreet() {
      if (greetTimer || !canGreet()) return;
      greetTimer = setTimeout(function () { greetTimer = null; greet(); }, 1400);
    }
    // The bubble opens the guide too.
    listen(bubble, 'click', function () { btn.click(); });
    // Docked in the About section on phones: wait until it has scrolled into view.
    if ('IntersectionObserver' in window) {
      inView = false;
      var seeMe = new IntersectionObserver(function (entries) {
        inView = entries.some(function (en) { return en.isIntersecting; });
        if (inView) maybeGreet(); else if (!greeted) hush(false);
      }, { threshold: 0.6 });
      seeMe.observe(root);
      offs.push(function () { seeMe.disconnect(); });
    }

    // Below 760px the mascot sits inline in the About section instead of floating
    // over text; above that it floats bottom-right.
    var dock = document.querySelector('.mascot-dock');
    var smallMQ = window.matchMedia('(max-width: 760px)');
    function place() {
      var docked = !!(dock && smallMQ.matches);
      root.classList.toggle('is-docked', docked);
      (docked ? dock : document.body).appendChild(root);
      applyHidden();
    }
    place();
    smallMQ.addEventListener && smallMQ.addEventListener('change', place);

    /* ---- lives in the nav at the top, flies to the corner on scroll ---- */
    // The avatar sits in the nav's brand mark while the page is at the top.
    // Scrolling down launches it along an arc (with a motion trail) to the
    // bottom-right corner; scrolling back to the top flies it home.
    var brandMark = document.querySelector('.brand-mark');
    var brandAv = null;
    // Same head-and-chest image as the corner mascot.
    function headBg(el, size) {
      el.style.backgroundImage = 'url("' + AVATAR + '")';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = '50% 20%';
    }
    if (brandMark) {
      brandAv = document.createElement('span');
      brandAv.className = 'brand-avatar';
      brandAv.setAttribute('aria-hidden', 'true');
      brandMark.appendChild(brandAv);
      brandMark.classList.add('has-avatar');
      headBg(brandAv, brandMark.offsetWidth || 36);
    }
    var TOP_LIMIT = 160;
    var atTop = window.scrollY < TOP_LIMIT;
    var flight = null;

    function floating() { return !root.classList.contains('is-docked'); }
    function setBrand(home) { if (brandMark) brandMark.classList.toggle('avatar-away', !home); }
    function instant(fn) {
      root.classList.add('no-trans');
      fn();
      void root.offsetWidth;
      root.classList.remove('no-trans');
    }
    // The corner position, from layout (ignores the hidden state's transform).
    function cornerRect() {
      var b = btn.getBoundingClientRect();
      var t = getComputedStyle(root).transform;
      var dy = 0;
      if (t && t !== 'none') { var m = t.match(/matrix\(([^)]+)\)/); if (m) dy = parseFloat(m[1].split(',')[5]) || 0; }
      return { left: b.left, top: b.top - dy, width: b.width, height: b.height };
    }
    function fly(down) {
      if (flight) flight.finish();
      var from = down ? brandMark.getBoundingClientRect() : cornerRect();
      var to = down ? cornerRect() : brandMark.getBoundingClientRect();
      var size = from.width;
      var endScale = to.width / size;
      // Quadratic Bézier: drop down the left side first, then sweep right.
      var p0 = { x: from.left, y: from.top };
      var p2 = { x: to.left + (to.width - size) / 2, y: to.top + (to.height - size) / 2 };
      var c = down ? { x: p0.x + (p2.x - p0.x) * 0.08, y: p2.y + 40 } : { x: p2.x + (p0.x - p2.x) * 0.08, y: p0.y + 40 };
      var frames = [];
      for (var i = 0; i <= 12; i++) {
        var t = i / 12, u = 1 - t;
        var x = u * u * p0.x + 2 * u * t * c.x + t * t * p2.x;
        var y = u * u * p0.y + 2 * u * t * c.y + t * t * p2.y;
        var sc = (down ? (1 + (endScale - 1) * t) : ((to.width / size) * t + (1 - t))) * (1 + Math.sin(Math.PI * t) * 0.45);
        var rot = (down ? 1 : -1) * 360 * (t * t * (3 - 2 * t));
        frames.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotate(' + rot.toFixed(1) + 'deg)', offset: t });
      }
      var made = [];
      var anims = [0, 1, 2].map(function (k) {
        var f = document.createElement('div');
        f.className = 'mascot-flyer' + (k ? ' ghost' : '');
        f.style.width = f.style.height = size + 'px';
        headBg(f, size);
        if (k) f.style.opacity = String(0.38 - k * 0.14);
        document.body.appendChild(f);
        made.push(f);
        return f.animate(frames, { duration: 1050, delay: k * 55, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'both' });
      });
      if (down) setBrand(false); else instant(function () { setHidden('top', true); });
      var done = false;
      function land() {
        if (done) return;
        done = true;
        made.forEach(function (f) { f.remove(); });
        flight = null;
        if (down) {
          instant(function () { setHidden('top', false); });
          if (!root.classList.contains('is-away') && btn.animate) {
            btn.animate([{ transform: 'scale(.7)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
          }
        } else {
          setBrand(true);
          if (brandAv && brandAv.animate) brandAv.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
        }
      }
      anims[0].onfinish = land;
      flight = { finish: function () { anims.forEach(function (a) { try { a.finish(); } catch (e) {} }); land(); } };
    }
    function syncTop(animate) {
      if (!floating()) { setBrand(true); setHidden('top', false); return; }
      if (animate && !reduceMQ.matches && brandMark && document.body.animate) { fly(!atTop); return; }
      setBrand(atTop);
      instant(function () { setHidden('top', atTop); });
    }
    syncTop(false);
    window.addEventListener('scroll', function () {
      var now = window.scrollY < TOP_LIMIT;
      if (now === atTop) return;
      atTop = now;
      syncTop(true);
    }, { passive: true });
    smallMQ.addEventListener && smallMQ.addEventListener('change', function () { syncTop(false); });

    // Hide near the contact links (bottom-right content) and while the mobile menu is open.
    // ...and over the "work with me" cards, so it never covers the payment or contact buttons.
    var avoidEls = [].slice.call(document.querySelectorAll('.contact-links, .engage'));
    if (avoidEls.length && 'IntersectionObserver' in window) {
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { seen[avoidEls.indexOf(en.target)] = en.isIntersecting; });
        setHidden('contact', Object.keys(seen).some(function (k) { return seen[k]; }));
      }, { rootMargin: '0px 0px 40px 0px' });
      avoidEls.forEach(function (el) { io.observe(el); });
    }
    new MutationObserver(function () {
      setHidden('menu', document.documentElement.classList.contains('menu-open'));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // On larger touch screens (tablets), tuck away while scrolling so it never sits on top of what you're reading.
    var scrollTimer;
    window.addEventListener('scroll', function () {
      if (fineMQ.matches) return;
      setHidden('scrolling', true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () { setHidden('scrolling', false); }, 700);
    }, { passive: true });
  }
})();

/* Renaissance-style painted portraits, rendered as SVG (viewBox 0 0 200 240).
   Each sitter is posed in three-quarter view facing left, lit from the upper left
   (chiaroscuro), modelled with soft blurred light and shadow, then passed through a
   "paint" filter that adds brush-stroke relief and slight wobble, with varnish and
   vignette on top so it reads like an oil painting on panel. */
var Characters = (function () {
  var uid = 0;

  var C = {
    aldric: { name: 'Master Aldric', title: 'The Mentor', skin: '#e2b08e', hair: '#5a3418', hairStyle: 'curls',
      outfit: '#22392f', trim: '#c9a24a', shirt: '#ece2cc', bg: ['#cfd8da', '#76878e'], gaze: 'down', sash: true, collar: 'gold', seed: 3 },
    isolde: { name: 'Lady Isolde', title: 'Keeper of Numbers', skin: '#efc6a6', hair: '#b9853a', hairStyle: 'long',
      outfit: '#7e1a22', trim: '#d8b052', bg: ['#b8c0aa', '#4a5640'], female: true, hat: 'circlet', pearls: true, seed: 11 },
    anselm: { name: 'Brother Anselm', title: 'Monk of the Scriptorium', skin: '#d6a07c', hair: '#6a5a48', hairStyle: 'none',
      outfit: '#5e4128', trim: '#a88a5a', bg: ['#8c7a60', '#2a2119'], hat: 'hood', rope: true, seed: 5 },
    gareth: { name: 'Sir Gareth', title: 'Knight of the Realm', skin: '#d49a74', hair: '#3a2a1c', hairStyle: 'none',
      outfit: '#1b376e', trim: '#d8b052', bg: ['#aeb9c2', '#47525e'], hat: 'coif', beard: 'stubble', cross: true, seed: 7 },
    eleanor: { name: 'Queen Eleanor', title: 'Sovereign of the Realm', skin: '#eec4a2', hair: '#2a1a12', hairStyle: 'updo',
      outfit: '#45205f', trim: '#e0bb5a', bg: ['#3a5444', '#0f1a14'], female: true, hat: 'crown', ermine: true, pearls: true, seed: 13 },
    tobias: { name: 'Tobias the Merchant', title: 'Master of Coin', skin: '#c08560', hair: '#2b1d14', hairStyle: 'short',
      outfit: '#6e2416', trim: '#c9a24a', shirt: '#ece2cc', bg: ['#a69476', '#3a2f22'], hat: 'beret', beard: 'full', fur: true, chain: true, seed: 17 },
    rowena: { name: 'Rowena the Alchemist', title: 'Seeker of Change', skin: '#ecbf9c', hair: '#8f3418', hairStyle: 'veil',
      outfit: '#1c4f50', trim: '#c9a24a', bg: ['#566576', '#161d27'], female: true, hat: 'veil', seed: 19 },
    edmund: { name: 'Old Edmund', title: 'Royal Astronomer', skin: '#dcab8c', hair: '#d6d1c8', hairStyle: 'short',
      outfit: '#1a2752', trim: '#c9a24a', shirt: '#ece2cc', bg: ['#3c4766', '#0d1222'], hat: 'scholar', beard: 'long', stars: true, old: true, seed: 23 }
  };

  /* ---------- colour helpers ---------- */
  function rgb(h) { var c = parseInt(h.slice(1), 16); return [c >> 16, (c >> 8) & 255, c & 255]; }
  function hex(a) { return '#' + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }

  /* ---------- geometry shared by every sitter (three-quarter view, facing left) ---------- */
  var FACE = 'M104 52 C88 52 78 62 77 78 C76 86 80 90 79 96 C78 104 81 108 80 114 C79 120 82 124 82 128 C83 136 88 142 98 145 C110 146 122 140 130 128 C136 120 139 108 139 96 C140 74 126 52 104 52 Z';
  var NOSE = 'M96 88 C94 98 87 106 81 111 C79 113 79.5 116.5 82 117 C85 118 88 118 91 116 C93 112 95 104 98 92 Z';
  var BODY = 'M0 240 L0 222 C12 196 38 176 72 168 C84 165 94 163 104 163 C132 163 162 174 184 196 C194 207 200 220 200 228 L200 240 Z';
  var NECK = 'M93 134 C96 148 94 158 90 170 L136 170 C130 158 129 144 133 122 Z';

  function blur(id, s) { return '<filter id="' + id + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="' + s + '"/></filter>'; }

  function build(key, extra) {
    var c = C[key] || C.aldric;
    var p = 'c' + (++uid);
    var B = function (n) { return 'filter="url(#' + p + 'b' + n + ')"'; };
    var u = function (n) { return 'url(#' + p + n + ')'; };

    var skin = c.skin, skinL = mix(skin, '#fff1dc', 0.38), skinS = mix(skin, '#6a2a18', 0.45), skinD = mix(skin, '#2a1006', 0.66);
    var hair = c.hair, hairL = mix(hair, '#f3d6a0', c.old ? 0.6 : 0.42), hairD = mix(hair, '#0a0604', c.old ? 0.45 : 0.6);
    var o = c.outfit, oD = mix(o, '#000000', 0.62), oL = mix(o, '#ffffff', 0.28), sheen = mix(o, '#f2f0e0', 0.5);
    var lip = c.female ? '#b4505a' : mix(skin, '#8a3a32', 0.55), lipD = mix(lip, '#3a0e0e', 0.45);
    var gold = c.trim, goldD = mix(gold, '#3a2208', 0.6), goldL = mix(gold, '#fff6d0', 0.6);
    var s = [];

    /* ---------------- defs ---------------- */
    s.push('<defs>' +
      '<linearGradient id="' + p + 'bg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="' + c.bg[0] + '"/><stop offset="1" stop-color="' + c.bg[1] + '"/></linearGradient>' +
      '<radialGradient id="' + p + 'glow" cx=".26" cy=".42" r=".6"><stop offset="0" stop-color="' + mix(c.bg[0], '#ffffff', 0.25) + '" stop-opacity=".9"/><stop offset="1" stop-color="' + c.bg[0] + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'skin" cx=".28" cy=".34" r=".85"><stop offset="0" stop-color="' + skinL + '"/><stop offset=".38" stop-color="' + skin + '"/><stop offset=".78" stop-color="' + skinS + '"/><stop offset="1" stop-color="' + skinD + '"/></radialGradient>' +
      '<radialGradient id="' + p + 'hb" cx=".32" cy=".28" r=".8"><stop offset="0" stop-color="' + hairL + '"/><stop offset=".45" stop-color="' + hair + '"/><stop offset="1" stop-color="' + hairD + '"/></radialGradient>' +
      '<linearGradient id="' + p + 'hairLin" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="' + hairL + '"/><stop offset=".4" stop-color="' + hair + '"/><stop offset="1" stop-color="' + hairD + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'cloth" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="' + oL + '"/><stop offset=".45" stop-color="' + o + '"/><stop offset="1" stop-color="' + oD + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'gold" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="' + goldL + '"/><stop offset=".4" stop-color="' + gold + '"/><stop offset=".75" stop-color="' + goldD + '"/><stop offset="1" stop-color="' + gold + '"/></linearGradient>' +
      '<radialGradient id="' + p + 'vig" cx=".42" cy=".42" r=".78"><stop offset=".55" stop-color="#140c04" stop-opacity="0"/><stop offset="1" stop-color="#140c04" stop-opacity=".62"/></radialGradient>' +
      '<pattern id="' + p + 'emb" width="9" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="9" height="7" fill="' + gold + '"/>' +
      '<path d="M.5 3.5c1.4-2.8 3.2-2.8 3.8 0s2.4 2.8 3.8 0" stroke="' + goldD + '" stroke-width=".9" fill="none"/><circle cx="4.4" cy=".9" r=".6" fill="' + goldL + '"/><circle cx="4.4" cy="6.1" r=".6" fill="' + goldL + '"/></pattern>' +
      '<pattern id="' + p + 'mail" width="3.6" height="3" patternUnits="userSpaceOnUse"><rect width="3.6" height="3" fill="#4f555d"/><ellipse cx="1.8" cy="1.5" rx="1.45" ry="1.05" fill="none" stroke="#c2c8cf" stroke-width=".65"/></pattern>' +
      '<clipPath id="' + p + 'fc"><path d="' + FACE + '"/></clipPath>' +
      '<clipPath id="' + p + 'bc"><path d="' + BODY + '"/></clipPath>' +
      '<clipPath id="' + p + 'nc"><path d="' + NECK + '"/></clipPath>' +
      blur(p + 'b0', 0.6) + blur(p + 'b1', 1.2) + blur(p + 'b2', 2.2) + blur(p + 'b3', 3.5) + blur(p + 'b5', 5.5) + blur(p + 'b9', 9) +
      /* background clouds */
      '<filter id="' + p + 'cl" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".012 .022" numOctaves="4" seed="' + c.seed + '"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 .96  1.7 0 0 0 -.78"/></filter>' +
      /* fur: fuzzy edges */
      '<filter id="' + p + 'fz" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="' + c.seed + '"/><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      /* the oil-paint look: wobble + brush-stroke relief lit from the upper left */
      '<filter id="' + p + 'paint" x="0" y="0" width="200" height="240" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="' + c.seed + '" result="w"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="w" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d0"/><feGaussianBlur in="d0" stdDeviation=".45" result="d"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="' + (c.seed + 1) + '" result="n"/>' +
      '<feColorMatrix in="n" type="luminanceToAlpha" result="h"/>' +
      '<feDiffuseLighting in="h" surfaceScale=".28" diffuseConstant="1" lighting-color="#ffffff" result="relief"><feDistantLight azimuth="225" elevation="68"/></feDiffuseLighting>' +
      '<feComposite in="relief" in2="d" operator="arithmetic" k1="1.05" k2="0" k3="0" k4="0"/>' +
      '</filter>' +
      '</defs>');

    s.push('<g filter="' + u('paint') + '">');

    /* ---------------- background ---------------- */
    s.push('<rect width="200" height="240" fill="' + u('bg') + '"/><rect width="200" height="240" fill="' + u('glow') + '"/>');
    s.push('<rect width="200" height="240" filter="' + u('cl') + '" opacity=".28"/>');
    if (c.stars) [[22, 30], [46, 18], [176, 40], [160, 20], [30, 120], [184, 110]].forEach(function (q) {
      s.push('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.1" fill="#f6e7b8" opacity=".8"/>');
    });

    /* ---------------- behind the head ---------------- */
    if (c.hat === 'hood') s.push('<path d="M54 112 C46 50 84 26 112 28 C144 30 162 60 158 112 C158 142 168 162 180 180 L34 180 C46 162 54 142 54 112 Z" fill="' + u('cloth') + '"/>' +
      '<path d="M54 112 C46 50 84 26 112 28 C144 30 162 60 158 112" stroke="' + oD + '" stroke-width="10" fill="none" opacity=".45" ' + B(5) + '/>');
    if (c.hat === 'coif') s.push('<path d="M56 112 C50 52 84 32 108 32 C138 32 156 58 152 112 C152 140 158 160 166 176 L40 176 C50 160 56 140 56 112 Z" fill="' + u('mail') + '"/>');
    if (c.hat === 'veil') s.push('<path d="M60 84 C56 36 150 30 152 84 L168 206 Q104 220 40 206 Z" fill="' + mix(o, '#000', 0.35) + '"/>' +
      '<path d="M150 90 C156 130 160 170 166 204" stroke="' + oD + '" stroke-width="8" fill="none" opacity=".6" ' + B(3) + '/>');
    if (c.hairStyle === 'long') s.push('<path d="M64 84 C58 40 148 34 150 92 C152 130 160 168 172 204 L118 204 L118 140 Z" fill="' + u('hairLin') + '"/>' +
      '<path d="M140 100 C146 140 152 170 162 200 M132 110 C136 150 140 176 146 202" stroke="' + hairD + '" stroke-width="2" fill="none" opacity=".55" ' + B(0) + '/>');
    if (c.hairStyle === 'updo') s.push('<circle cx="146" cy="80" r="17" fill="' + u('hb') + '"/><path d="M134 72 q12 -8 22 4 M136 86 q10 4 20 -4" stroke="' + hairL + '" stroke-width="1.2" fill="none" opacity=".6"/>');

    /* ---------------- body ---------------- */
    s.push('<path d="' + BODY + '" fill="' + u('cloth') + '"/>');
    s.push('<g clip-path="' + u('bc') + '">' +
      '<ellipse cx="44" cy="196" rx="52" ry="22" fill="' + oL + '" opacity=".55" ' + B(9) + '/>' +
      '<ellipse cx="176" cy="226" rx="62" ry="42" fill="' + oD + '" opacity=".85" ' + B(9) + '/>' +
      /* velvet folds: dark trough + bright sheen ridge beside it */
      ['M66 176 C76 200 72 222 78 240', 'M118 172 C128 196 130 220 126 240', 'M150 184 C160 206 166 224 164 240', 'M38 198 C48 214 50 228 48 240'].map(function (d, i) {
        return '<path d="' + d + '" stroke="' + oD + '" stroke-width="8" fill="none" opacity=".75" ' + B(2) + '/>' +
          '<path d="' + d + '" transform="translate(' + (i === 0 || i === 3 ? -5 : 5) + ' 0)" stroke="' + sheen + '" stroke-width="2.6" fill="none" opacity="' + (i === 0 || i === 3 ? 0.55 : 0.28) + '" ' + B(1) + '/>';
      }).join('') +
      '</g>');
    if (c.stars) [[42, 214], [150, 210], [66, 232], [130, 230], [176, 232], [96, 222]].forEach(function (q) {
      s.push('<path d="M' + q[0] + ' ' + (q[1] - 4.5) + 'l1.4 3 3.2.4-2.4 2.2.7 3.2-2.9-1.7-2.9 1.7.7-3.2-2.4-2.2 3.2-.4z" fill="' + gold + '" opacity=".9"/>');
    });
    if (c.cross) s.push('<path d="M94 196 h16 v14 h14 v13 h-14 v20 h-16 v-20 h-14 v-13 h14 z" fill="' + u('gold') + '"/><path d="M94 196 v44 M80 210 h14" stroke="' + goldL + '" stroke-width="1" opacity=".7"/>');

    /* neck with the strong shadow cast by the jaw */
    s.push('<path d="' + NECK + '" fill="' + skin + '"/>');
    s.push('<g clip-path="' + u('nc') + '"><ellipse cx="112" cy="138" rx="24" ry="11" fill="' + skinD + '" opacity=".85" ' + B(3) + '/>' +
      '<path d="M122 130 L130 170" stroke="' + skinS + '" stroke-width="10" opacity=".7" ' + B(3) + '/>' +
      '<path d="M97 146 C98 154 97 160 95 166" stroke="' + skinL + '" stroke-width="3" opacity=".55" ' + B(1) + '/></g>');

    if (c.female) {
      /* low neckline: chest, collarbones, gown trim, pearls */
      s.push('<path d="M80 162 C96 156 120 156 138 162 L140 186 C120 194 98 194 76 186 Z" fill="' + u('skin') + '"/>');
      s.push('<path d="M86 170 C96 174 104 174 110 172 M114 172 C122 172 128 170 134 166" stroke="' + skinS + '" stroke-width="1.6" fill="none" opacity=".6" ' + B(0) + '/>');
      s.push('<ellipse cx="128" cy="180" rx="14" ry="10" fill="' + skinS + '" opacity=".55" ' + B(3) + '/>');
      s.push('<path d="M74 186 C96 198 122 198 142 184" stroke="' + u('gold') + '" stroke-width="7" fill="none"/><path d="M74 186 C96 198 122 198 142 184" stroke="' + goldD + '" stroke-width="1.2" stroke-dasharray="2 2.5" fill="none"/>');
      if (c.pearls) {
        var pts = [];
        for (var t = 0; t <= 1.0001; t += 1 / 13) {
          var x = (1 - t) * (1 - t) * 92 + 2 * (1 - t) * t * 108 + t * t * 126, y = (1 - t) * (1 - t) * 160 + 2 * (1 - t) * t * 180 + t * t * 158;
          pts.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.5" fill="#efe9dc"/><circle cx="' + (x - 0.5).toFixed(1) + '" cy="' + (y - 0.5).toFixed(1) + '" r=".5" fill="#fff"/>');
        }
        s.push(pts.join('') + '<path d="M108 170 l3 4 -3 5 -3 -5 z" fill="#8c1420" stroke="' + gold + '" stroke-width="1"/>');
      }
    } else if (c.hat !== 'hood' && c.hat !== 'coif') {
      /* linen shirt with lace edge, inside a standing collar */
      var sh = c.shirt || '#ece2cc';
      s.push('<path d="M88 157 C100 151 120 150 134 154 L137 174 C118 180 100 180 83 174 Z" fill="' + sh + '"/>');
      s.push('<path d="M88 157 q2.5-3.5 5-1 q2.5-3.5 5-1 q2.5-3.5 5-1 q2.5-3.5 5-1 q2.5-3.5 5-1 q2.5-3.5 5-1 q2.5-3.5 5-1 q2-3 4-.5" stroke="' + mix(sh, '#6a5a40', 0.5) + '" stroke-width="1" fill="none"/>');
      s.push('<path d="M98 163 L96 173 M108 161 L108 175 M120 160 L121 174" stroke="' + mix(sh, '#6a5a40', 0.45) + '" stroke-width="1.6" opacity=".5" ' + B(1) + '/>');
      s.push('<ellipse cx="126" cy="164" rx="10" ry="8" fill="' + mix(sh, '#3a2a18', 0.6) + '" opacity=".45" ' + B(3) + '/>');
      s.push('<path d="M80 170 C92 182 124 182 140 168" stroke="' + u('gold') + '" stroke-width="9" fill="none"/>');
      s.push('<path d="M80 170 C92 182 124 182 140 168" stroke="' + goldD + '" stroke-width="1.4" stroke-dasharray="3 1.5 1 1.5" fill="none"/>');
      s.push('<path d="M84 168 C94 176 110 177 120 175" stroke="' + goldL + '" stroke-width="1.6" fill="none" opacity=".7" ' + B(0) + '/>');
    }
    if (c.sash) {
      s.push('<path d="M58 240 L144 172 L158 184 L78 240 Z" fill="url(#' + p + 'emb)"/>');
      s.push('<path d="M66 240 L151 178" stroke="' + goldL + '" stroke-width="3" opacity=".45" ' + B(1) + '/>');
      s.push('<path d="M58 240 L144 172 M78 240 L158 184" stroke="' + goldD + '" stroke-width="1.4"/>');
      s.push('<path d="M118 200 L158 184 L162 240 L96 240 Z" fill="' + oD + '" opacity=".35" ' + B(5) + '/>');
    }
    if (c.ermine) {
      s.push('<g filter="' + u('fz') + '"><path d="M4 226 C14 194 50 172 84 172 L74 194 C52 198 32 214 26 240 L4 240 Z M196 226 C186 194 150 172 116 172 L126 194 C148 198 168 214 174 240 L196 240 Z" fill="#f4efe4"/></g>');
      s.push('<path d="M150 186 C170 196 186 214 192 236" stroke="#9a9488" stroke-width="10" opacity=".5" fill="none" ' + B(3) + '/>');
      [[40, 196], [58, 186], [28, 220], [162, 198], [146, 188], [176, 220]].forEach(function (q) {
        s.push('<path d="M' + q[0] + ' ' + q[1] + ' l-2.2 7 2.2-1.4 2.2 1.4 z" fill="#161412"/>');
      });
    }
    if (c.fur) {
      s.push('<g filter="' + u('fz') + '"><path d="M24 206 C36 180 70 166 98 165 L130 165 C152 168 174 182 184 204 C168 196 150 190 130 190 L100 192 C76 192 50 196 24 206 Z" fill="' + mix('#6a4a2a', '#000', 0.1) + '"/></g>');
      s.push('<path d="M40 192 C64 180 90 176 106 176" stroke="#b08a5a" stroke-width="4" opacity=".55" fill="none" ' + B(1) + '/>');
      s.push('<path d="M140 180 C160 186 172 196 180 204" stroke="#1e140a" stroke-width="6" opacity=".6" fill="none" ' + B(2) + '/>');
    }
    if (c.chain) {
      s.push('<path d="M70 198 Q112 226 152 196" stroke="' + u('gold') + '" stroke-width="3.6" stroke-dasharray="3.2 1.4" fill="none"/>');
      s.push('<circle cx="111" cy="214" r="7" fill="' + u('gold') + '" stroke="' + goldD + '" stroke-width="1"/><circle cx="109" cy="212" r="2" fill="' + goldL + '"/>');
    }
    if (c.rope) {
      s.push('<path d="M64 180 Q104 200 144 178" stroke="#c4ad84" stroke-width="4" stroke-dasharray="4 1.5" fill="none"/><path d="M104 190 L102 240" stroke="#c4ad84" stroke-width="3.4" stroke-dasharray="4 1.5"/>');
    }
    if (c.hat === 'coif') {
      /* mail mantle over the shoulders */
      s.push('<path d="M22 218 C32 188 62 170 92 166 L132 166 C162 170 184 190 192 218 C170 208 140 200 112 202 C84 200 50 206 22 218 Z" fill="' + u('mail') + '"/>');
      s.push('<path d="M30 200 C50 184 74 174 96 172" stroke="#e6ebf0" stroke-width="5" opacity=".35" fill="none" ' + B(3) + '/>');
      s.push('<path d="M150 182 C170 192 184 204 190 216" stroke="#11151a" stroke-width="10" opacity=".55" fill="none" ' + B(5) + '/>');
    }

    /* ---------------- head (three-quarter view, lit from the upper left) ---------------- */
    var showEar = c.hat !== 'hood' && c.hat !== 'coif' && c.hat !== 'veil' && c.hairStyle !== 'long' && c.hairStyle !== 'curls';
    if (showEar) s.push('<path d="M131 92 C139 84 147 92 145 104 C144 114 139 120 133 118 Z" fill="' + skin + '"/><path d="M136 96 C141 96 142 104 138 110" stroke="' + skinD + '" stroke-width="1.5" fill="none" opacity=".7"/><ellipse cx="141" cy="104" rx="3" ry="6" fill="#d0665a" opacity=".25" ' + B(1) + '/>');

    s.push('<path d="' + FACE + '" fill="' + u('skin') + '"/>');
    s.push('<g clip-path="' + u('fc') + '">' +
      /* the turned-away cheek plane falls into shadow */
      '<path d="M120 62 C142 76 146 114 134 136 C126 146 114 148 112 142 C124 122 124 92 112 70 Z" fill="' + skinD + '" opacity=".8" ' + B(5) + '/>' +
      '<path d="M128 70 C140 84 142 112 132 134" stroke="' + skinD + '" stroke-width="12" fill="none" opacity=".6" ' + B(5) + '/>' +
      /* eye sockets */
      '<ellipse cx="87" cy="94" rx="8" ry="6" fill="' + skinS + '" opacity=".55" ' + B(2) + '/>' +
      '<ellipse cx="115" cy="94" rx="12" ry="7" fill="' + skinS + '" opacity=".65" ' + B(2) + '/>' +
      /* shadow the nose throws onto the near cheek */
      '<path d="M98 90 C100 102 100 112 102 118 C96 121 92 120 90 118 C94 108 96 98 98 90 Z" fill="' + skinD + '" opacity=".5" ' + B(2) + '/>' +
      '<ellipse cx="93" cy="120" rx="8" ry="2.6" fill="' + skinD + '" opacity=".5" ' + B(1) + '/>' +
      '<ellipse cx="95" cy="136" rx="8" ry="2.8" fill="' + skinS + '" opacity=".6" ' + B(1) + '/>' +
      '<path d="M82 132 C92 148 112 150 132 128 L136 142 C114 158 88 158 78 140 Z" fill="' + skinD + '" opacity=".6" ' + B(2) + '/>' +
      /* lights: forehead, cheekbone, chin */
      '<ellipse cx="92" cy="68" rx="16" ry="9" fill="' + skinL + '" opacity=".9" ' + B(5) + '/>' +
      '<ellipse cx="84" cy="104" rx="6" ry="9" fill="' + skinL + '" opacity=".8" ' + B(3) + '/>' +
      '<ellipse cx="96" cy="140" rx="5" ry="2.6" fill="' + skinL + '" opacity=".55" ' + B(1) + '/>' +
      /* warmth in cheeks */
      '<ellipse cx="88" cy="116" rx="7" ry="6" fill="#d0665a" opacity="' + (c.female ? 0.36 : 0.24) + '" ' + B(3) + '/>' +
      '<ellipse cx="120" cy="118" rx="10" ry="7" fill="#c05248" opacity=".22" ' + B(3) + '/>' +
      (c.old ? '<path d="M84 103 q4 2 8 0 M108 104 q6 3 12 0 M90 72 q10 -3 20 0 M88 78 q12 -3 24 0" stroke="' + skinS + '" stroke-width="1" fill="none" opacity=".7"/><path d="M101 119 C105 124 107 128 107 132 M85 121 C85 125 86 128 88 130" stroke="' + skinS + '" stroke-width="1.2" fill="none" opacity=".6"/>' : '') +
      (c.beard === 'stubble' ? '<path d="M78 112 C80 134 92 148 104 148 C118 148 132 138 138 112 C132 128 120 136 106 136 C94 136 84 128 78 112 Z" fill="' + hair + '" opacity=".3" ' + B(1) + '/>' : '') +
      (c.hat === 'hood' || c.hat === 'coif' || c.hat === 'veil' ? '<path d="M70 52 L144 52 L144 84 C126 70 94 70 70 84 Z" fill="' + skinD + '" opacity=".55" ' + B(5) + '/><path d="M128 52 L146 52 L146 150 L130 150 Z" fill="' + skinD + '" opacity=".5" ' + B(5) + '/>' : '') +
      '</g>');

    /* nose: projects past the far cheek, the key three-quarter cue */
    s.push('<path d="' + NOSE + '" fill="' + skin + '"/><path d="M93 100 C92 108 91 112 91 116 C88 118 85 118 83 117" stroke="' + skinS + '" stroke-width="3" fill="none" opacity=".45" ' + B(1) + '/>');
    s.push('<path d="M95 93 C93 100 89 106 84 110" stroke="' + skinL + '" stroke-width="2.4" fill="none" opacity=".6" ' + B(1) + '/>');
    s.push('<ellipse cx="84" cy="112.5" rx="2" ry="1.6" fill="' + skinL + '" opacity=".7" ' + B(0) + '/>');
    s.push('<path d="M97 92 C95 104 93 110 92 116" stroke="' + skinS + '" stroke-width="1.6" fill="none" opacity=".55" ' + B(0) + '/>');
    s.push('<path d="M82 117 C85 119.5 89 119.5 92 116.5" stroke="' + skinD + '" stroke-width="1.3" fill="none" opacity=".8"/>');
    s.push('<path d="M83.5 117.2 q2 1.2 3.8 .3" stroke="#43201a" stroke-width="1.3" fill="none"/>');

    /* eyes: the far eye is narrower and tucked against the nose */
    var browC = mix(hair, '#1a0e06', c.old ? 0.25 : 0.35);
    var E1 = 'M82 97 Q87 93.4 93 96 Q88 100.2 82 97 Z', E2 = 'M104 96 Q113 90.5 124 96 Q114 101.5 104 96 Z';
    if (c.gaze === 'down') {
      s.push('<path d="' + E1 + '" fill="' + skinS + '" opacity=".45"/><path d="' + E2 + '" fill="' + skinS + '" opacity=".45"/>' +
        '<path d="M82.5 97.4 Q87 99.6 93 96.8" stroke="#2a160c" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M104.5 97 Q114 101.2 124 96.4" stroke="#2a160c" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M84 98.6 l-.5 1.4 M87 99.3 l-.2 1.5 M90 99 l.1 1.5 M107 99.3 l-.4 1.6 M110.5 100.1 l-.2 1.7 M114 100.4 l.1 1.7 M117.5 100 l.3 1.6 M121 98.6 l.5 1.5" stroke="#2a160c" stroke-width=".7"/>' +
        '<path d="M82 94.4 Q87 91 93 93.6 M104.5 93.8 Q114 89 124 94" stroke="' + skinD + '" stroke-width="1.1" fill="none" opacity=".75"/>' +
        '<path d="M83 95.6 Q88 93.2 92 95 M106 95 Q114 92 123 95" stroke="' + skinL + '" stroke-width="1.5" fill="none" opacity=".55" ' + B(0) + '/>');
    } else {
      var iris = c.female ? '#4a5a6a' : '#3a2416';
      if (key === 'isolde') iris = '#3d6080';
      if (key === 'rowena') iris = '#3f6a44';
      s.push('<clipPath id="' + p + 'e1"><path d="' + E1 + '"/></clipPath><clipPath id="' + p + 'e2"><path d="' + E2 + '"/></clipPath>' +
        '<path d="' + E1 + '" fill="#e6d8c8"/><path d="' + E2 + '" fill="#ece0d0"/>' +
        '<g clip-path="' + u('e1') + '"><circle cx="85.6" cy="96.7" r="2.6" fill="' + iris + '"/><circle cx="85.6" cy="96.7" r="1.1" fill="#0c0806"/><rect x="80" y="91" width="16" height="3.8" fill="' + skinS + '" opacity=".6" ' + B(0) + '/></g>' +
        '<g clip-path="' + u('e2') + '"><circle cx="110" cy="96.2" r="3.3" fill="' + iris + '"/><circle cx="110" cy="96.2" r="1.4" fill="#0c0806"/><rect x="102" y="89" width="24" height="4.6" fill="' + skinS + '" opacity=".6" ' + B(0) + '/></g>' +
        '<circle cx="109" cy="95.1" r=".8" fill="#fff"/><circle cx="84.9" cy="95.8" r=".6" fill="#fff"/>' +
        '<path d="M81.6 97 Q87 92.8 93.4 95.8" stroke="#24140a" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M103.5 96 Q113 90 124.5 96" stroke="#24140a" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
        '<path d="M82 93.6 Q87 90 93 92.6 M104.5 92.5 Q114 87.5 124 92.5" stroke="' + skinD + '" stroke-width="1" fill="none" opacity=".6"/>' +
        '<path d="M83.5 99.4 Q88 100.8 92.5 98.4 M106 98.8 Q114 101.6 123 98" stroke="' + skinS + '" stroke-width=".9" fill="none" opacity=".6"/>');
    }
    s.push('<path d="M78 87.5 Q84 ' + (c.female ? 83.8 : 82.8) + ' 94 85.5" stroke="' + browC + '" stroke-width="' + (c.female ? 1.8 : 2.8) + '" fill="none" stroke-linecap="round" opacity=".85" ' + B(0) + '/>');
    s.push('<path d="M101 85 Q113 ' + (c.female ? 80.5 : 79.5) + ' 127 86" stroke="' + browC + '" stroke-width="' + (c.female ? 2 : 3.2) + '" fill="none" stroke-linecap="round" opacity=".85" ' + B(0) + '/>');

    /* beards before the mouth */
    if (c.beard === 'full' || c.beard === 'long') {
      var bot = c.beard === 'long' ? 196 : 158;
      s.push('<path d="M79 108 C78 ' + (bot - 30) + ' 88 ' + bot + ' 104 ' + bot + ' C120 ' + bot + ' 136 ' + (bot - 34) + ' 139 112 C133 132 121 139 111 139 C103 141 95 139 89 136 C83 130 80 120 79 108 Z" fill="' + u('hairLin') + '"/>');
      var strands = '';
      for (var k = 0; k < 9; k++) {
        var sx = 86 + k * 6;
        strands += '<path d="M' + sx + ' 139 C' + (sx - 2) + ' ' + (150 + (bot - 150) * 0.4) + ' ' + (sx + 2) + ' ' + (bot - 12) + ' ' + (sx - 1 + (k % 3)) + ' ' + (bot - 4) + '" stroke="' + (k % 2 ? hairL : hairD) + '" stroke-width="1.1" fill="none" opacity=".55"/>';
      }
      s.push(strands);
      s.push('<path d="M121 131 C131 129 137 119 139 112 C137 ' + (bot - 34) + ' 127 ' + (bot - 6) + ' 113 ' + bot + ' Z" fill="' + hairD + '" opacity=".5" ' + B(3) + '/>');
      s.push('<path d="M83 124.5 C87 120 95 120 99 122 C103 120 108 121 111 125.5 C105 124 100 125 96 125 C92 124 88 125 83 124.5 Z" fill="' + hair + '" stroke="' + hairD + '" stroke-width=".8"/>');
    }

    /* mouth (animated when speaking) */
    var lb = c.female ? 134.6 : 133.2;
    s.push('<g class="mouth">' +
      '<path d="M85 127.4 Q89 124.6 93 125.4 Q95 124.7 97 125.4 Q102 124.6 107 127.4 Q96 129 85 127.4 Z" fill="' + lipD + '"/>' +
      '<path d="M86 128 Q96 129.6 106 128 Q102 ' + (lb - 0.4) + ' 95 ' + lb + ' Q89 ' + (lb - 0.4) + ' 86 128 Z" fill="' + lip + '"/>' +
      '<path d="M84.5 127.4 Q96 129.7 107.5 127.2" stroke="' + mix(lipD, '#000', 0.4) + '" stroke-width="1" fill="none"/>' +
      '<ellipse cx="93.5" cy="131" rx="4" ry="1.2" fill="#fff4ea" opacity=".38" ' + B(0) + '/>' +
      '<path d="M104 128.5 Q107 131 106 133" stroke="' + skinS + '" stroke-width="1" fill="none" opacity=".5"/>' +
      '</g>');

    /* ---------------- front hair ---------------- */
    if (c.hairStyle === 'curls') {
      var blobs = [[70, 88, 12], [68, 106, 11], [74, 122, 9], [76, 66, 13], [88, 50, 14], [106, 44, 14], [124, 47, 14], [140, 58, 14], [150, 76, 13], [151, 96, 12], [147, 114, 11], [141, 128, 10],
        [82, 64, 10], [96, 56, 10.5], [110, 54, 10.5], [124, 59, 10], [135, 70, 9.5], [143, 88, 10], [143, 104, 9.5], [77, 78, 9]];
      var circles = blobs.map(function (q) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + q[2] + '"/>'; }).join('');
      s.push('<mask id="' + p + 'hm" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="240"><g fill="#fff">' + circles + '</g><path d="' + FACE + '" fill="#000"/><path d="M79 53 C96 46 124 46 140 54 L141 86 C132 74 116 68 100 70 C88 72 81 80 79 90 L76 90 Z" fill="#fff"/><rect x="0" y="0" width="200" height="1" fill="#000"/></mask>');
      s.push('<g mask="' + u('hm') + '"><rect x="56" y="28" width="110" height="114" fill="' + u('hb') + '"/>' +
        '<ellipse cx="146" cy="100" rx="16" ry="34" fill="' + hairD + '" opacity=".7" ' + B(5) + '/>' +
        '<ellipse cx="90" cy="50" rx="22" ry="10" fill="' + hairL + '" opacity=".45" ' + B(5) + '/>');
      var rr = (function (seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; })(42);
      blobs.forEach(function (q) {
        for (var j = 0; j < 3; j++) {
          var x = q[0] + (rr() - 0.5) * q[2] * 0.9, y = q[1] + (rr() - 0.5) * q[2] * 0.9, r = q[2] * (0.35 + rr() * 0.3);
          var lit = (x < 112 && y < 80) ? 0.85 : (x > 132 ? 0.3 : 0.55);
          s.push('<path d="M' + (x - r) + ' ' + y + ' a' + r + ' ' + r + ' 0 1 1 ' + (r * 1.4) + ' ' + (r * 0.9) + '" stroke="' + hairD + '" stroke-width="1.8" fill="none" opacity=".6" ' + B(0) + '/>' +
            '<path d="M' + (x - r * 0.9) + ' ' + (y - r * 0.3) + ' a' + (r * 0.9) + ' ' + (r * 0.9) + ' 0 0 1 ' + (r * 1.3) + ' ' + (-r * 0.4) + '" stroke="' + hairL + '" stroke-width="1.3" fill="none" opacity="' + lit + '"/>');
        }
      });
      s.push('</g>');
    } else if (c.hairStyle === 'long') {
      s.push('<path d="M68 98 C64 60 84 44 106 44 C130 44 146 62 142 98 C140 80 130 66 116 62 C104 60 88 62 80 72 C74 80 70 88 68 98 Z" fill="' + u('hairLin') + '"/>');
      s.push('<path d="M70 92 C66 124 68 156 60 200 C68 208 82 206 86 198 C82 160 78 126 76 100 Z" fill="' + u('hairLin') + '"/>');
      s.push('<path d="M72 104 C70 140 70 170 64 198 M78 110 C76 146 78 176 76 200" stroke="' + hairL + '" stroke-width="1.3" fill="none" opacity=".6"/>');
      s.push('<path d="M100 48 C90 54 80 64 74 80 M106 47 C118 50 132 60 138 78 M112 50 C124 56 134 70 136 90" stroke="' + hairL + '" stroke-width="1.2" fill="none" opacity=".6"/>');
    } else if (c.hairStyle === 'updo') {
      s.push('<path d="M68 92 C66 60 84 46 104 46 C128 46 142 62 140 90 C134 70 120 60 104 62 C88 62 74 72 68 92 Z" fill="' + u('hairLin') + '"/>');
      s.push('<path d="M76 70 C86 58 104 54 122 58 M72 80 C82 66 100 60 120 64" stroke="' + hairL + '" stroke-width="1" fill="none" opacity=".5"/>');
    } else if (c.hairStyle === 'short' && c.hat !== 'hood' && c.hat !== 'coif') {
      s.push('<path d="M126 74 C142 78 148 100 140 120 L134 116 C138 100 134 86 126 82 Z" fill="' + u('hairLin') + '"/>');
      s.push('<path d="M70 80 C72 70 78 66 84 66 L80 84 Z" fill="' + hair + '" opacity=".9"/>');
    }

    /* ---------------- headwear ---------------- */
    if (c.hat === 'hood') {
      s.push('<path d="M62 106 C58 58 84 40 106 40 C132 40 150 58 146 106 C142 76 128 54 106 52 C84 52 68 70 62 106 Z" fill="' + u('cloth') + '"/>');
      s.push('<path d="M64 100 C66 70 84 54 106 54 C126 54 140 70 144 100" stroke="' + oD + '" stroke-width="4" fill="none" opacity=".7" ' + B(1) + '/>');
      s.push('<path d="M70 56 C80 44 100 38 118 42" stroke="' + oL + '" stroke-width="4" fill="none" opacity=".5" ' + B(2) + '/>');
    }
    if (c.hat === 'coif') {
      s.push('<path d="M62 108 C58 58 84 40 106 40 C132 40 150 58 146 108 C142 78 128 56 106 54 C84 54 68 72 62 108 Z" fill="' + u('mail') + '"/>');
      s.push('<path d="M64 104 C66 72 84 56 106 56 C126 56 140 72 144 104" stroke="#3a2a1a" stroke-width="2.6" fill="none"/>');
      s.push('<path d="M66 60 C78 46 96 40 116 42" stroke="#eef2f6" stroke-width="5" fill="none" opacity=".45" ' + B(2) + '/>');
      s.push('<path d="M146 80 C150 110 150 140 156 170" stroke="#101418" stroke-width="10" fill="none" opacity=".5" ' + B(3) + '/>');
    }
    if (c.hat === 'veil') {
      s.push('<path d="M70 88 C72 70 86 62 102 62 C120 62 134 70 138 88 C128 76 116 70 102 70 C88 70 78 76 70 88 Z" fill="' + u('hairLin') + '"/>');
      s.push('<path d="M62 110 C56 60 82 38 106 38 C134 38 152 58 148 110 C142 76 128 54 106 52 C84 54 68 72 62 110 Z" fill="' + mix(o, '#000', 0.2) + '"/>');
      s.push('<path d="M68 74 C82 58 120 54 140 74" stroke="' + u('gold') + '" stroke-width="3" fill="none"/>');
      s.push('<path d="M66 50 C78 40 96 36 116 40" stroke="' + oL + '" stroke-width="4" fill="none" opacity=".5" ' + B(2) + '/>');
    }
    if (c.hat === 'circlet') {
      s.push('<path d="M70 76 C88 67 118 65 139 73" stroke="' + u('gold') + '" stroke-width="2.6" fill="none"/>');
      s.push('<path d="M98 66 l3.4 4 -3.4 4.4 -3.4 -4.4 z" fill="#2a5f8a" stroke="' + gold + '" stroke-width="1"/><circle cx="97.4" cy="68.6" r=".8" fill="#cfe6f6"/>');
    }
    if (c.hat === 'crown') {
      s.push('<path d="M74 62 L77 36 L88 50 L99 29 L110 48 L124 34 L130 60 C114 54 90 54 74 62 Z" fill="' + u('gold') + '" stroke="' + goldD + '" stroke-width="1"/>');
      s.push('<path d="M76 58 C92 52 114 52 129 56" stroke="' + goldL + '" stroke-width="1.6" fill="none" opacity=".8"/>');
      s.push('<ellipse cx="101" cy="50" rx="3.6" ry="4.4" fill="#9c1424"/><circle cx="100" cy="48.6" r="1.1" fill="#ffd0d0"/><circle cx="84" cy="55" r="2.6" fill="#1f4f80"/><circle cx="118" cy="53" r="2.6" fill="#1f4f80"/>');
      s.push('<circle cx="77" cy="36" r="2.3" fill="#f2ecdf"/><circle cx="99" cy="29" r="2.3" fill="#f2ecdf"/><circle cx="124" cy="34" r="2.3" fill="#f2ecdf"/>');
    }
    if (c.hat === 'beret') {
      s.push('<path d="M60 64 C58 44 100 30 142 36 C166 40 172 56 158 66 C140 76 96 76 60 64 Z" fill="' + mix(o, '#000', 0.45) + '"/>');
      s.push('<path d="M64 52 C84 38 120 34 146 40" stroke="' + sheen + '" stroke-width="4" fill="none" opacity=".3" ' + B(2) + '/>');
      s.push('<path d="M120 70 C140 72 156 68 160 62" stroke="#000" stroke-width="7" fill="none" opacity=".4" ' + B(3) + '/>');
      s.push('<path d="M68 66 C94 74 130 72 152 64" stroke="' + u('gold') + '" stroke-width="2.6" fill="none" stroke-dasharray="5 2"/>');
      s.push('<path d="M70 60 C60 40 46 24 30 18 C44 30 52 44 62 62 Z" fill="#f2ede2"/><path d="M68 60 C58 42 46 28 32 20" stroke="#b9b0a0" stroke-width=".9" fill="none"/>');
    }
    if (c.hat === 'scholar') {
      s.push('<path d="M68 70 C64 40 92 28 112 30 C136 32 150 48 146 70 C128 62 90 60 68 70 Z" fill="#14121a"/>');
      s.push('<path d="M76 46 C88 36 104 32 120 34" stroke="#5a566a" stroke-width="4" fill="none" opacity=".55" ' + B(2) + '/>');
      s.push('<path d="M68 70 C90 60 128 62 146 70" stroke="' + u('gold') + '" stroke-width="2.4" fill="none"/>');
    }

    if (extra) s.push(extra);
    s.push('</g>');

    /* varnish and vignette, like an old oil on panel */
    s.push('<rect width="200" height="240" fill="#b0823a" opacity=".09"/><rect width="200" height="240" fill="' + u('vig') + '"/>');

    return '<svg class="portrait" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Painted portrait of ' + c.name + '">' + s.join('') + '</svg>';
  }

  /* The opening scene: Aldric's left hand raises an apple to his mouth.
     The group is positioned by app.js using the poses below. */
  var applePose = {
    start: 'translate(10px, 300px)',
    near: 'translate(62px, 134px) rotate(6deg)',
    bite: 'translate(69px, 131px) rotate(4deg)',
    back: 'translate(60px, 138px) rotate(6deg)',
    rest: 'translate(46px, 198px) rotate(-4deg)',
    bites: [[21, -3], [19, 8], [17, -12]]
  };

  function appleArm() {
    var skin = '#e2b08e', skinL = mix(skin, '#fff3e4', 0.5), skinS = mix(skin, '#5a2c1c', 0.42);
    return '<defs>' +
      '<radialGradient id="appleG" cx="30%" cy="28%" r="80%"><stop offset="0" stop-color="#ff8a62"/><stop offset=".35" stop-color="#d2272a"/><stop offset=".8" stop-color="#7a0e12"/><stop offset="1" stop-color="#3e0608"/></radialGradient>' +
      '<radialGradient id="handG" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="' + skinL + '"/><stop offset=".5" stop-color="' + skin + '"/><stop offset="1" stop-color="' + skinS + '"/></radialGradient>' +
      '<linearGradient id="sleeveG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f6656"/><stop offset=".5" stop-color="#22392f"/><stop offset="1" stop-color="#0c1712"/></linearGradient>' +
      '<filter id="appleSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>' +
      '<clipPath id="appleClip"><path d="M0 -14 C-10 -22 -24 -16 -22 0 C-21 14 -10 22 0 18 C10 22 21 14 22 0 C24 -16 10 -22 0 -14 Z"/></clipPath>' +
      '<mask id="biteMask" maskUnits="userSpaceOnUse" x="-40" y="-40" width="80" height="80"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/><g id="biteHoles"></g></mask>' +
      '</defs>' +
      '<g id="appleArm" style="transform: ' + applePose.start + '">' +
      /* velvet sleeve from the lower left, gold cuff, lace */
      '<path d="M-34 20 C-54 50 -76 92 -96 160 L-30 170 C-20 110 -10 64 -6 34 Z" fill="url(#sleeveG)"/>' +
      '<path d="M-40 60 C-52 90 -62 120 -70 160" stroke="#0c1712" stroke-width="6" fill="none" opacity=".7" filter="url(#appleSoft)"/>' +
      '<path d="M-28 46 C-36 80 -44 116 -50 160" stroke="#8fb8a4" stroke-width="2" fill="none" opacity=".4" filter="url(#appleSoft)"/>' +
      '<path d="M-36 30 C-26 38 -14 40 -4 36" stroke="#c9a24a" stroke-width="7" fill="none"/>' +
      '<path d="M-36 30 C-26 38 -14 40 -4 36" stroke="#6b4512" stroke-width="1.2" stroke-dasharray="2 1.5" fill="none"/>' +
      '<path d="M-34 24 q3 3 6 1 q3 3 6 1 q3 3 6 0 q3 2 6 -1 q2 2 4 -1" stroke="#ece2cc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      /* palm under the apple */
      '<path d="M-28 24 C-32 12 -24 4 -14 8 C-4 12 4 20 8 24 C12 30 8 34 0 34 C-12 36 -24 34 -28 24 Z" fill="url(#handG)"/>' +
      /* apple */
      '<g mask="url(#biteMask)">' +
      '<path d="M0 -14 C-10 -22 -24 -16 -22 0 C-21 14 -10 22 0 18 C10 22 21 14 22 0 C24 -16 10 -22 0 -14 Z" fill="url(#appleG)"/>' +
      '<g clip-path="url(#appleClip)">' +
      '<path d="M-14 -12 C-16 0 -12 10 -6 16 M-6 -14 C-8 0 -6 10 -2 16 M6 -14 C8 -2 8 8 6 16" stroke="#f0b050" stroke-width="1.4" fill="none" opacity=".35" filter="url(#appleSoft)"/>' +
      '<ellipse cx="12" cy="10" rx="12" ry="10" fill="#2a0204" opacity=".5" filter="url(#appleSoft)"/>' +
      '<ellipse cx="-10" cy="-8" rx="5" ry="3.2" fill="#fff" opacity=".55" transform="rotate(-30 -10 -8)" filter="url(#appleSoft)"/>' +
      '<g id="biteFlesh"></g>' +
      '</g></g>' +
      '<path d="M0 -14 Q-1 -22 -4 -27" stroke="#3e2410" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M-3 -24 C-10 -32 -20 -30 -22 -26 C-16 -22 -8 -22 -3 -24 Z" fill="#4f7a2a"/><path d="M-3 -24 C-10 -26 -16 -26 -21 -26" stroke="#2e4a16" stroke-width=".6" fill="none"/>' +
      /* thumb up the left side, fingers curled under the front */
      '<path d="M-20 12 C-27 4 -27 -6 -21 -11 C-17 -13 -14 -10 -15 -6 C-17 0 -16 6 -12 10 Z" fill="url(#handG)"/>' +
      '<path d="M-20 -9 C-19 -11 -16 -11 -16 -8" stroke="#f3d8c4" stroke-width="1.4" fill="none" opacity=".7"/>' +
      '<path d="M-10 18 C-2 22 8 22 14 16 C16 13 14 11 11 12 C6 16 -2 17 -10 15 Z" fill="url(#handG)"/>' +
      '<path d="M-8 24 C2 28 10 26 16 22 C18 19 16 17 13 18 C8 22 0 23 -8 21 Z" fill="url(#handG)"/>' +
      '<path d="M-6 29 C2 32 8 31 12 28" stroke="' + skinS + '" stroke-width="2" fill="none" opacity=".6"/>' +
      '<path d="M-8 15.5 C0 17 8 16 12 12.5 M-6 21.5 C2 23 10 21 14 18" stroke="' + skinS + '" stroke-width="1" fill="none" opacity=".7"/>' +
      '<circle cx="4" cy="20.5" r="1.8" fill="none" stroke="#d8c47a" stroke-width="1.2"/>' +
      '</g>';
  }

  return {
    list: C,
    get: function (k) { return C[k] || C.aldric; },
    svg: build,
    appleArm: appleArm,
    applePose: applePose
  };
})();

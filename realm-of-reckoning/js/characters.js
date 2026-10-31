/* Medieval character portraits drawn as SVG busts (viewBox 0 0 200 240).
   Each character is a set of parameters: skin, hair, velvet outfit, gold trim, hat. */
var Characters = (function () {
  var uid = 0;

  var C = {
    aldric: { name: 'Master Aldric', title: 'The Mentor', skin: '#e9bb98', hair: '#5b3418', hairStyle: 'curls',
      outfit: '#24443a', outfit2: '#0f241c', trim: '#c9a24a', shirt: '#efe4cc', eyes: '#4a3020', gaze: 'down', sash: true },
    isolde: { name: 'Lady Isolde', title: 'Keeper of Numbers', skin: '#f2cbaa', hair: '#c8913a', hairStyle: 'long',
      outfit: '#8c1c24', outfit2: '#4d0c12', trim: '#d8b052', eyes: '#3b5b7a', hat: 'circlet', female: true },
    anselm: { name: 'Brother Anselm', title: 'Monk of the Scriptorium', skin: '#dcae8a', hair: '#7a6a58', hairStyle: 'short',
      outfit: '#6b4a2e', outfit2: '#3d2a18', trim: '#a88a5a', eyes: '#4a3a2a', hat: 'hood', rope: true },
    gareth: { name: 'Sir Gareth', title: 'Knight of the Realm', skin: '#d9a27f', hair: '#3a2a1c', hairStyle: 'short',
      outfit: '#1d3c78', outfit2: '#0f2048', trim: '#d8b052', eyes: '#3a2a1c', hat: 'coif', beard: 'stubble', cross: true },
    eleanor: { name: 'Queen Eleanor', title: 'Sovereign of the Realm', skin: '#f0c8a6', hair: '#2a1a12', hairStyle: 'updo',
      outfit: '#4b1f6b', outfit2: '#260d38', trim: '#e0bb5a', eyes: '#3a2a1c', hat: 'crown', ermine: true, female: true },
    tobias: { name: 'Tobias the Merchant', title: 'Master of Coin', skin: '#c98d66', hair: '#2b1d14', hairStyle: 'short',
      outfit: '#7a2e1a', outfit2: '#3f150a', trim: '#c9a24a', shirt: '#efe4cc', eyes: '#2b1d14', hat: 'beret', beard: 'full' },
    rowena: { name: 'Rowena the Alchemist', title: 'Seeker of Change', skin: '#efc3a0', hair: '#9b3a1c', hairStyle: 'long',
      outfit: '#1f5a5a', outfit2: '#0d3030', trim: '#c9a24a', eyes: '#2f5a3a', hat: 'veil', female: true },
    edmund: { name: 'Old Edmund', title: 'Royal Astronomer', skin: '#e2b294', hair: '#d8d4cc', hairStyle: 'short',
      outfit: '#1c2a5a', outfit2: '#0b1430', trim: '#c9a24a', shirt: '#efe4cc', eyes: '#4a4a5a', hat: 'scholar', beard: 'long', stars: true }
  };

  function shade(hex, amt) {
    var c = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, (c >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((c >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (c & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function curls(cx, cy, color, list, r) {
    var hi = shade(color, 40), lo = shade(color, -30);
    return list.map(function (p) {
      var x = cx + p[0], y = cy + p[1], rr = p[2] || r;
      return '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="' + color + '" stroke="' + lo + '" stroke-width="1.2"/>' +
        '<path d="M' + (x - rr * 0.5) + ' ' + (y - rr * 0.1) + ' q' + (rr * 0.5) + ' ' + (-rr * 0.6) + ' ' + rr + ' 0" stroke="' + hi + '" stroke-width="1.4" fill="none" opacity=".7"/>';
    }).join('');
  }

  function build(key, extra) {
    var c = C[key] || C.aldric;
    var id = 'c' + (++uid);
    var skinLo = shade(c.skin, -28), skinHi = shade(c.skin, 14);
    var hairLo = shade(c.hair, -35);
    var s = [];

    s.push('<defs>' +
      '<radialGradient id="' + id + 'v" cx="40%" cy="25%" r="85%"><stop offset="0" stop-color="' + shade(c.outfit, 35) + '"/>' +
      '<stop offset=".55" stop-color="' + c.outfit + '"/><stop offset="1" stop-color="' + c.outfit2 + '"/></radialGradient>' +
      '<radialGradient id="' + id + 'f" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="' + skinHi + '"/>' +
      '<stop offset=".75" stop-color="' + c.skin + '"/><stop offset="1" stop-color="' + skinLo + '"/></radialGradient>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(c.trim, 40) + '"/>' +
      '<stop offset=".5" stop-color="' + c.trim + '"/><stop offset="1" stop-color="' + shade(c.trim, -45) + '"/></linearGradient>' +
      '<pattern id="' + id + 'm" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#8c9096"/>' +
      '<circle cx="2.5" cy="2.5" r="1.7" fill="none" stroke="#5a5e66" stroke-width=".9"/></pattern>' +
      '</defs>');

    /* --- behind the head --- */
    if (c.hat === 'hood') {
      s.push('<path d="M48 118 C40 40 160 40 152 118 L168 176 Q100 196 32 176 Z" fill="url(#' + id + 'v)"/>');
    }
    if (c.hat === 'coif') {
      s.push('<path d="M54 112 C48 44 152 44 146 112 L156 172 Q100 188 44 172 Z" fill="url(#' + id + 'm)" stroke="#4a4e55" stroke-width="2"/>');
    }
    if (c.hat === 'veil') {
      s.push('<path d="M56 80 C56 34 144 34 144 80 L158 196 Q100 206 42 196 Z" fill="' + shade(c.outfit2, 10) + '"/>');
    }
    if (c.hairStyle === 'long' && c.hat !== 'veil') {
      s.push('<path d="M58 92 C50 36 150 36 142 92 L152 192 Q126 202 116 186 L84 186 Q74 202 48 192 Z" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1.5"/>');
      s.push('<path d="M60 120 Q56 160 62 188 M140 120 Q144 160 138 188" stroke="' + hairLo + '" stroke-width="2" fill="none" opacity=".6"/>');
    }
    if (c.hairStyle === 'curls') {
      s.push(curls(100, 86, c.hair, [[-40, 6, 14], [-42, 24, 13], [-36, 40, 12], [40, 6, 14], [42, 24, 13], [36, 40, 12], [-30, -24, 15], [30, -24, 15], [0, -38, 16], [-16, -34, 15], [16, -34, 15], [-38, -10, 14], [38, -10, 14]], 13));
    }
    if (c.hairStyle === 'updo') {
      s.push('<circle cx="100" cy="46" r="18" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1.5"/>');
    }

    /* --- body --- */
    s.push('<path d="M10 240 C14 196 48 168 100 163 C152 168 186 196 190 240 Z" fill="url(#' + id + 'v)"/>');
    s.push('<path d="M40 206 Q52 222 50 240 M160 206 Q148 222 150 240 M74 196 Q80 220 76 240 M126 196 Q120 220 124 240" stroke="' + c.outfit2 + '" stroke-width="3" fill="none" opacity=".55"/>');
    s.push('<path d="M52 190 Q70 180 82 182 M148 190 Q130 180 118 182" stroke="' + shade(c.outfit, 50) + '" stroke-width="2" fill="none" opacity=".35"/>');
    if (c.stars) {
      [[46, 212], [154, 214], [66, 230], [136, 228], [36, 230], [166, 232]].forEach(function (p) {
        s.push('<path d="M' + p[0] + ' ' + (p[1] - 5) + ' l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="' + c.trim + '"/>');
      });
    }
    if (c.cross) {
      s.push('<path d="M92 196 h16 v14 h14 v14 h-14 v16 h-16 v-16 h-14 v-14 h14 z" fill="url(#' + id + 'g)" opacity=".95"/>');
    }

    /* neck */
    s.push('<path d="M86 124 L86 168 Q100 176 114 168 L114 124 Z" fill="' + c.skin + '"/>');
    s.push('<path d="M86 136 Q100 150 114 136 L114 128 L86 128 Z" fill="' + skinLo + '" opacity=".55"/>');

    if (c.female) {
      s.push('<path d="M72 170 Q100 158 128 170 L124 182 Q100 196 76 182 Z" fill="' + c.skin + '"/>');
      s.push('<path d="M70 170 Q100 200 130 170" stroke="url(#' + id + 'g)" stroke-width="7" fill="none"/>');
      s.push('<path d="M70 170 Q100 200 130 170" stroke="' + shade(c.trim, -60) + '" stroke-width="1.5" stroke-dasharray="2 3" fill="none"/>');
      if (key === 'isolde' || key === 'eleanor') s.push('<circle cx="100" cy="186" r="4" fill="#b0202c" stroke="url(#' + id + 'g)" stroke-width="2"/>');
    } else if (c.hat !== 'hood' && c.hat !== 'coif') {
      /* linen shirt + lace ruff */
      var shirt = c.shirt || '#efe4cc';
      s.push('<path d="M82 154 L118 154 L124 174 Q100 186 76 174 Z" fill="' + shirt + '"/>');
      s.push('<path d="M80 160 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0" stroke="' + shade(shirt, -40) + '" stroke-width="1.2" fill="none"/>');
      s.push('<path d="M72 172 Q100 198 128 172" stroke="url(#' + id + 'g)" stroke-width="8" fill="none"/>');
      s.push('<path d="M72 172 Q100 198 128 172" stroke="' + shade(c.trim, -60) + '" stroke-width="1.6" stroke-dasharray="3 2 1 2" fill="none"/>');
    }
    if (c.sash) {
      /* embroidered gold band across the doublet, like the painting */
      s.push('<path d="M58 240 L138 176 L150 186 L74 240 Z" fill="url(#' + id + 'g)"/>');
      s.push('<path d="M66 240 L144 181" stroke="' + shade(c.trim, -70) + '" stroke-width="1.5" stroke-dasharray="4 2 1 2" fill="none"/>');
      s.push('<path d="M62 236 L140 178 M70 240 L148 183" stroke="' + shade(c.trim, -40) + '" stroke-width=".8" fill="none"/>');
    }
    if (c.ermine) {
      s.push('<path d="M14 222 C22 196 52 176 82 176 L70 196 C50 198 30 214 26 236 Z M186 222 C178 196 148 176 118 176 L130 196 C150 198 170 214 174 236 Z" fill="#f6f1e6"/>');
      [[40, 200], [56, 190], [30, 222], [160, 200], [144, 190], [170, 222]].forEach(function (p) {
        s.push('<path d="M' + p[0] + ' ' + p[1] + ' l-2 6 2 -1 2 1 z" fill="#1b1b1b"/>');
      });
    }
    if (c.rope) {
      s.push('<path d="M70 176 Q100 196 130 176" stroke="#c9b38a" stroke-width="4" fill="none" stroke-dasharray="5 2"/>');
      s.push('<path d="M100 192 L100 240" stroke="#c9b38a" stroke-width="3" stroke-dasharray="5 2"/>');
    }

    /* ears */
    s.push('<ellipse cx="66" cy="98" rx="6" ry="10" fill="' + c.skin + '"/><ellipse cx="134" cy="98" rx="6" ry="10" fill="' + c.skin + '"/>');
    s.push('<path d="M64 94 q3 4 0 8 M136 94 q-3 4 0 8" stroke="' + skinLo + '" stroke-width="1.2" fill="none"/>');

    /* face */
    s.push('<path d="M66 92 C66 56 134 56 134 92 C134 122 118 141 100 141 C82 141 66 122 66 92 Z" fill="url(#' + id + 'f)"/>');
    s.push('<circle cx="82" cy="112" r="8" fill="#e07a6a" opacity=".22"/><circle cx="118" cy="112" r="8" fill="#e07a6a" opacity=".22"/>');

    /* eyes */
    var browCol = c.hairStyle === 'curls' ? c.hair : shade(c.hair, -20);
    if (c.gaze === 'down') {
      s.push('<path d="M79 96 Q86 101 93 96 M107 96 Q114 101 121 96" stroke="#3a2416" stroke-width="1.8" fill="none" stroke-linecap="round"/>');
      s.push('<path d="M79 93 Q86 89 93 93 M107 93 Q114 89 121 93" stroke="' + skinLo + '" stroke-width="1.2" fill="none"/>');
      s.push('<path d="M80 97 l-1 2 M84 98.5 l-.6 2 M89 98.5 l.2 2 M111 98.5 l-.2 2 M116 98.5 l.6 2 M120 97 l1 2" stroke="#3a2416" stroke-width=".8"/>');
    } else {
      s.push('<g class="eyes">' +
        '<ellipse cx="86" cy="96" rx="6" ry="3.4" fill="#fbf6ee"/><ellipse cx="114" cy="96" rx="6" ry="3.4" fill="#fbf6ee"/>' +
        '<circle cx="86.5" cy="96.3" r="2.6" fill="' + c.eyes + '"/><circle cx="114.5" cy="96.3" r="2.6" fill="' + c.eyes + '"/>' +
        '<circle cx="86.5" cy="96.3" r="1.1" fill="#111"/><circle cx="114.5" cy="96.3" r="1.1" fill="#111"/>' +
        '<circle cx="87.4" cy="95.3" r=".7" fill="#fff"/><circle cx="115.4" cy="95.3" r=".7" fill="#fff"/>' +
        '<path d="M79.5 95 Q86 90.5 92.5 95 M107.5 95 Q114 90.5 120.5 95" stroke="#2a1a10" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
        '</g>');
    }
    s.push('<path d="M77 87 Q86 82 94 86 M106 86 Q114 82 123 87" stroke="' + browCol + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>');
    if (c.hat === 'scholar' || key === 'edmund') s.push('<path d="M80 103 q6 3 12 0 M108 103 q6 3 12 0" stroke="' + skinLo + '" stroke-width="1" fill="none"/>');

    /* nose */
    s.push('<path d="M100 95 Q98 106 95 112 Q99 116 105 112" stroke="' + skinLo + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>');

    /* beard (before mouth so the mouth stays visible) */
    if (c.beard === 'full' || c.beard === 'long') {
      var bottom = c.beard === 'long' ? 184 : 152;
      s.push('<path d="M67 100 C66 ' + (bottom - 20) + ' 86 ' + bottom + ' 100 ' + bottom + ' C114 ' + bottom + ' 134 ' + (bottom - 20) + ' 133 100 C128 126 116 134 100 134 C84 134 72 126 67 100 Z" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1"/>');
      s.push('<path d="M86 140 q2 10 0 18 M100 142 q1 12 0 22 M114 140 q-2 10 0 18" stroke="' + hairLo + '" stroke-width="1" fill="none" opacity=".6"/>');
      s.push('<path d="M86 121 Q100 113 114 121 Q100 118 86 121 Z" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1"/>');
    }
    if (c.beard === 'stubble') {
      s.push('<path d="M70 108 C72 132 88 141 100 141 C112 141 128 132 130 108 C124 128 112 132 100 132 C88 132 76 128 70 108 Z" fill="' + c.hair + '" opacity=".28"/>');
    }

    /* mouth */
    s.push('<g class="mouth"><path d="M91 124 Q100 128.5 109 124 Q100 131 91 124 Z" fill="#b5545a"/>' +
      '<path d="M91 124 Q100 122 109 124" stroke="#7a2e32" stroke-width="1.2" fill="none"/></g>');

    /* front hair */
    if (c.hairStyle === 'curls') {
      s.push(curls(100, 86, c.hair, [[-26, -16, 10], [-12, -22, 10], [3, -24, 10], [17, -21, 10], [29, -14, 10], [-34, -2, 9], [35, -2, 9]], 10));
    } else if (c.hairStyle === 'long' && c.hat !== 'veil') {
      s.push('<path d="M66 92 C64 50 136 50 134 92 C128 70 112 62 100 70 C88 62 72 70 66 92 Z" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1.2"/>');
      s.push('<path d="M100 70 Q90 64 76 76 M100 70 Q110 64 124 76" stroke="' + hairLo + '" stroke-width="1" fill="none" opacity=".6"/>');
    } else if ((c.hairStyle === 'short' || c.hairStyle === 'updo') && c.hat !== 'hood' && c.hat !== 'coif') {
      s.push('<path d="M64 94 C60 50 140 50 136 94 C132 74 118 64 100 66 C82 64 68 74 64 94 Z" fill="' + c.hair + '" stroke="' + hairLo + '" stroke-width="1.2"/>');
    }

    /* hats */
    if (c.hat === 'hood') {
      s.push('<path d="M60 108 C56 52 144 52 140 108 C136 74 120 62 100 62 C80 62 64 74 60 108 Z" fill="' + c.outfit2 + '" opacity=".85"/>');
    }
    if (c.hat === 'coif') {
      s.push('<path d="M62 104 C58 54 142 54 138 104 C134 78 120 64 100 64 C80 64 66 78 62 104 Z" fill="url(#' + id + 'm)" stroke="#4a4e55" stroke-width="1.5"/>');
      s.push('<path d="M62 104 C66 78 80 64 100 64 C120 64 134 78 138 104" stroke="#c0c4ca" stroke-width="1.5" fill="none"/>');
    }
    if (c.hat === 'veil') {
      s.push('<path d="M62 96 C58 48 142 48 138 96 C132 70 116 62 100 62 C84 62 68 70 62 96 Z" fill="' + shade(c.outfit2, 18) + '"/>');
      s.push('<path d="M66 82 Q100 66 134 82" stroke="url(#' + id + 'g)" stroke-width="3" fill="none"/>');
      s.push('<path d="M68 86 C70 70 84 66 100 66" stroke="' + c.hair + '" stroke-width="5" fill="none" stroke-linecap="round"/>');
    }
    if (c.hat === 'circlet') {
      s.push('<path d="M66 80 Q100 66 134 80" stroke="url(#' + id + 'g)" stroke-width="3.5" fill="none"/>');
      s.push('<path d="M100 66 l4 6 -4 6 -4 -6 z" fill="#2a7ab0" stroke="url(#' + id + 'g)" stroke-width="1.5"/>');
    }
    if (c.hat === 'crown') {
      s.push('<path d="M66 66 L70 36 L84 54 L100 28 L116 54 L130 36 L134 66 Q100 58 66 66 Z" fill="url(#' + id + 'g)" stroke="' + shade(c.trim, -70) + '" stroke-width="1.2"/>');
      s.push('<circle cx="100" cy="52" r="4.5" fill="#b0202c"/><circle cx="80" cy="60" r="3" fill="#2a7ab0"/><circle cx="120" cy="60" r="3" fill="#2a7ab0"/>');
      s.push('<circle cx="70" cy="36" r="2.5" fill="#f6efe0"/><circle cx="100" cy="28" r="2.5" fill="#f6efe0"/><circle cx="130" cy="36" r="2.5" fill="#f6efe0"/>');
    }
    if (c.hat === 'beret') {
      s.push('<ellipse cx="94" cy="60" rx="50" ry="17" transform="rotate(-8 94 60)" fill="' + c.outfit2 + '" stroke="' + shade(c.outfit2, -20) + '" stroke-width="1.5"/>');
      s.push('<path d="M60 72 Q100 60 140 64" stroke="url(#' + id + 'g)" stroke-width="3" fill="none"/>');
      s.push('<path d="M128 56 C150 30 168 28 176 20 C166 40 152 50 132 60 Z" fill="#f4efe4" stroke="#c9c2b0" stroke-width="1"/>');
      s.push('<path d="M132 58 C148 44 162 34 174 22" stroke="#c9c2b0" stroke-width="1" fill="none"/>');
    }
    if (c.hat === 'scholar') {
      s.push('<path d="M62 76 C60 36 140 36 138 76 Q100 66 62 76 Z" fill="' + c.outfit2 + '" stroke="' + shade(c.outfit2, -20) + '" stroke-width="1.5"/>');
      s.push('<path d="M62 76 Q100 66 138 76" stroke="url(#' + id + 'g)" stroke-width="4" fill="none"/>');
      s.push('<circle cx="100" cy="40" r="4" fill="url(#' + id + 'g)"/>');
    }

    if (extra) s.push(extra);
    return '<svg class="portrait" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + c.name + '">' + s.join('') + '</svg>';
  }

  /* Arm + apple overlay for the opening scene (Master Aldric eating an apple). */
  function appleArm() {
    return '<defs>' +
      '<radialGradient id="appleG" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b5a"/><stop offset=".5" stop-color="#c8202a"/><stop offset="1" stop-color="#6a0d12"/></radialGradient>' +
      '<clipPath id="appleClip"><path d="M0 -14 C-10 -22 -24 -16 -22 0 C-21 14 -10 22 0 18 C10 22 21 14 22 0 C24 -16 10 -22 0 -14 Z"/></clipPath>' +
      '<mask id="biteMask" maskUnits="userSpaceOnUse" x="-40" y="-40" width="80" height="80"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/><g id="biteHoles"></g></mask>' +
      '<linearGradient id="sleeveG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f5a4a"/><stop offset="1" stop-color="#0f241c"/></linearGradient>' +
      '</defs>' +
      '<g id="appleArm" style="transform: translate(160px, 260px)">' +
      '<path d="M-4 22 C12 56 34 92 46 140 L104 140 C84 82 52 40 22 14 Z" fill="url(#sleeveG)"/>' +
      '<path d="M6 30 C20 60 38 92 50 140" stroke="#c9a24a" stroke-width="5" fill="none" opacity=".9"/>' +
      '<path d="M-6 20 Q8 34 26 14" stroke="#efe4cc" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M-6 20 q3 3 6 1 q3 3 6 1 q3 3 6 0 q3 2 6 -2 q3 1 6 -4" stroke="#bdb3a0" stroke-width="1" fill="none"/>' +
      '<g mask="url(#biteMask)">' +
      '<path d="M0 -14 C-10 -22 -24 -16 -22 0 C-21 14 -10 22 0 18 C10 22 21 14 22 0 C24 -16 10 -22 0 -14 Z" fill="url(#appleG)"/>' +
      '<ellipse cx="-9" cy="-8" rx="5" ry="3" fill="#fff" opacity=".35" transform="rotate(-30 -9 -8)"/>' +
      '<g id="biteFlesh" clip-path="url(#appleClip)"></g>' +
      '</g>' +
      '<path d="M0 -14 Q2 -22 6 -27" stroke="#4a2e14" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M5 -24 C12 -32 22 -30 24 -26 C18 -22 10 -22 5 -24 Z" fill="#4f8a2a"/>' +
      /* hand: palm under the apple, fingers in front */
      '<path d="M-10 14 C-6 26 18 28 22 14 C22 24 12 32 2 32 C-6 32 -12 24 -10 14 Z" fill="#e2ad88"/>' +
      '<path d="M12 4 C20 2 26 8 22 16 C20 20 14 18 14 14" fill="#e9bb98" stroke="#c48d6a" stroke-width="1"/>' +
      '<path d="M16 12 C24 12 26 20 20 24 C16 26 12 22 14 18" fill="#e9bb98" stroke="#c48d6a" stroke-width="1"/>' +
      '<path d="M-14 6 C-20 10 -18 20 -10 20" fill="#e9bb98" stroke="#c48d6a" stroke-width="1"/>' +
      '<circle cx="15" cy="21" r="1.6" fill="none" stroke="#e8e0cf" stroke-width="1.2"/>' +
      '</g>';
  }

  return {
    list: C,
    get: function (k) { return C[k] || C.aldric; },
    svg: build,
    appleArm: appleArm
  };
})();

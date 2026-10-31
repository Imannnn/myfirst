/* Realm of Reckoning — screens, lives, progress and the opening scene. */
(function () {
  var app = document.getElementById('app');
  var topbar = document.getElementById('topbar');
  var modalRoot = document.getElementById('modal-root');
  var KEY = 'realm-of-reckoning-v1';
  var REGEN_MS = CONFIG.lifeRegenMinutes * 60 * 1000;

  /* ---------------- storage ---------------- */
  var S = load();
  function load() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
    d = d || {};
    return {
      level: d.level || null,
      lives: typeof d.lives === 'number' ? d.lives : CONFIG.maxLives,
      regenStart: d.regenStart || null,
      progress: d.progress || {},
      sound: d.sound !== false
    };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: keep in memory */ } }
  function prog(id) { return S.progress[id] || (S.progress[id] = { lesson: false, practice: null, exam: null }); }

  /* ---------------- lives ---------------- */
  var Lives = {
    sync: function () {
      if (S.lives >= CONFIG.maxLives) { S.lives = CONFIG.maxLives; S.regenStart = null; return; }
      if (!S.regenStart) S.regenStart = Date.now();
      var gained = Math.floor((Date.now() - S.regenStart) / REGEN_MS);
      if (gained > 0) {
        S.lives = Math.min(CONFIG.maxLives, S.lives + gained);
        S.regenStart = S.lives >= CONFIG.maxLives ? null : S.regenStart + gained * REGEN_MS;
        save();
      }
    },
    lose: function () {
      this.sync();
      if (S.lives >= CONFIG.maxLives) S.regenStart = Date.now();
      S.lives = Math.max(0, S.lives - 1);
      save(); renderHearts(true);
    },
    add: function () {
      this.sync();
      S.lives = Math.min(CONFIG.maxLives, S.lives + 1);
      if (S.lives >= CONFIG.maxLives) S.regenStart = null;
      save(); renderHearts();
    },
    msToNext: function () { this.sync(); return S.regenStart ? Math.max(0, S.regenStart + REGEN_MS - Date.now()) : 0; }
  };
  function fmtMs(ms) {
    var s = Math.ceil(ms / 1000), m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------------- sound ---------------- */
  var actx = null;
  function audio() {
    if (!S.sound) return null;
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    return actx;
  }
  function tone(freq, start, dur, type, vol) {
    var a = audio(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, a.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.05);
  }
  var Sfx = {
    crunch: function () {
      var a = audio(); if (!a) return;
      var len = Math.floor(a.sampleRate * 0.18), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2) * (Math.random() < 0.3 ? 1 : 0.4);
      var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.8; g.gain.value = 0.6;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(a.destination); src.start();
    },
    right: function () { tone(659, 0, 0.18, 'triangle'); tone(988, 0.12, 0.3, 'triangle'); },
    wrong: function () { tone(196, 0, 0.35, 'sawtooth', 0.08); tone(147, 0.1, 0.4, 'sawtooth', 0.06); },
    fanfare: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.14, 0.35, 'triangle', 0.12); }); }
  };

  /* ---------------- helpers ---------------- */
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function level() { return MQ.levels.filter(function (l) { return l.id === S.level; })[0]; }
  function findCity(id) {
    for (var i = 0; i < MQ.levels.length; i++) for (var j = 0; j < MQ.levels[i].cities.length; j++)
      if (MQ.levels[i].cities[j].id === id) return MQ.levels[i].cities[j];
    return null;
  }
  var screenToken = 0; /* cancels async scenes when the screen changes */
  function show(el, withBar) {
    screenToken++;
    app.innerHTML = '';
    app.appendChild(el);
    topbar.hidden = !withBar;
    window.scrollTo(0, 0);
    renderHearts();
  }
  function heartSvg(full) {
    return '<svg viewBox="0 0 24 22" class="heart ' + (full ? 'full' : 'empty') + '" aria-hidden="true"><path d="M12 21s-8.5-5.3-10.6-10.2C-0.2 6.9 2.2 2 6.6 2c2.4 0 4 1.3 5.4 3.1C13.4 3.3 15 2 17.4 2c4.4 0 6.8 4.9 5.2 8.8C20.5 15.7 12 21 12 21z"/></svg>';
  }
  function renderHearts(lost) {
    Lives.sync();
    var box = document.getElementById('hearts');
    var html = '';
    for (var i = 0; i < CONFIG.maxLives; i++) html += heartSvg(i < S.lives);
    box.innerHTML = html;
    box.setAttribute('aria-label', S.lives + ' of ' + CONFIG.maxLives + ' lives');
    if (lost) { box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
    var t = document.getElementById('life-timer');
    var ms = Lives.msToNext();
    t.textContent = ms ? fmtMs(ms) : '';
    t.hidden = !ms;
    document.getElementById('sound-btn').textContent = S.sound ? '♪' : '♪̸';
    document.getElementById('sound-btn').setAttribute('aria-pressed', S.sound ? 'true' : 'false');
  }

  /* ---------------- modals ---------------- */
  function modal(inner, opts) {
    opts = opts || {};
    var m = h('<div class="modal-back"><div class="modal parchment" role="dialog" aria-modal="true">' + inner + '</div></div>');
    if (opts.dismiss !== false) m.addEventListener('click', function (e) { if (e.target === m) close(); });
    function close() { m.remove(); if (opts.onClose) opts.onClose(); }
    modalRoot.appendChild(m);
    var first = m.querySelector('button'); if (first) first.focus();
    return { el: m, close: close };
  }
  function toast(msg) {
    var t = h('<div class="toast">' + msg + '</div>');
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2200);
    setTimeout(function () { t.remove(); }, 2700);
  }

  /* Shop: buy one life. Resolves true if a life was bought. */
  function buyLife() {
    return new Promise(function (resolve) {
      if (S.lives >= CONFIG.maxLives) { toast('Thy lives are already full!'); resolve(false); return; }
      if (CONFIG.checkoutUrl) { window.location.href = CONFIG.checkoutUrl; resolve(false); return; }
      var m = modal(
        '<h2>Buy a Life</h2>' +
        '<div class="shop-item">' + heartSvg(true) + '<div><b>1 extra life</b><br><span class="price">' + CONFIG.lifePrice + '</span></div></div>' +
        '<p class="small">Demo mode: payments are not connected yet, so no money will be taken. ' +
        'Set a checkout link in <code>js/config.js</code> to sell lives for real.</p>' +
        '<div class="row"><button class="btn gold" data-a="ok">Pay ' + CONFIG.lifePrice + ' (demo)</button><button class="btn ghost" data-a="no">Cancel</button></div>',
        { onClose: function () { resolve(false); } });
      m.el.querySelector('[data-a=ok]').onclick = function () {
        Lives.add(); m.el.remove(); Sfx.right(); toast('A life has been restored!'); resolve(true);
      };
      m.el.querySelector('[data-a=no]').onclick = function () { m.close(); };
    });
  }

  /* Lives panel (from the hearts). */
  function livesPanel() {
    Lives.sync();
    var full = S.lives >= CONFIG.maxLives;
    var m = modal(
      '<h2>Thy Lives</h2><div class="big-hearts">' + Array.apply(null, Array(CONFIG.maxLives)).map(function (_, i) { return heartSvg(i < S.lives); }).join('') + '</div>' +
      (full ? '<p>All ' + CONFIG.maxLives + ' lives are full. Each wrong answer costs one life.</p>'
        : '<p>Next life in <b data-countdown>' + fmtMs(Lives.msToNext()) + '</b>. A new life returns every ' + CONFIG.lifeRegenMinutes + ' minutes.</p>') +
      '<div class="row">' + (full ? '' : '<button class="btn gold" data-a="buy">Buy a life · ' + CONFIG.lifePrice + '</button>') + '<button class="btn ghost" data-a="x">Close</button></div>');
    var b = m.el.querySelector('[data-a=buy]');
    if (b) b.onclick = function () { m.close(); buyLife(); };
    m.el.querySelector('[data-a=x]').onclick = m.close;
  }

  /* Blocks until the learner has a life again (wait or buy), or they leave. */
  function needLife() {
    Lives.sync();
    if (S.lives > 0) return Promise.resolve(true);
    return new Promise(function (resolve) {
      var done = false;
      var m = modal(
        '<div class="out-of-lives">' + Characters.svg('aldric') + '</div>' +
        '<h2>Thou art out of lives!</h2>' +
        '<p>Rest a while, scholar. Thy next life returns in</p><div class="countdown" data-countdown>' + fmtMs(Lives.msToNext()) + '</div>' +
        '<div class="row"><button class="btn gold" data-a="buy">Buy a life · ' + CONFIG.lifePrice + '</button><button class="btn ghost" data-a="map">Return to the map</button></div>',
        { dismiss: false });
      m.el.dataset.waitLife = '1';
      m.el.addEventListener('liferestored', function () { finish(true); });
      m.el.querySelector('[data-a=buy]').onclick = function () { buyLife().then(function (ok) { if (ok) finish(true); }); };
      m.el.querySelector('[data-a=map]').onclick = function () { finish(false); };
      function finish(ok) { if (done) return; done = true; m.el.remove(); resolve(ok); }
    });
  }

  setInterval(function () {
    var before = S.lives;
    Lives.sync();
    renderHearts();
    var ms = Lives.msToNext();
    document.querySelectorAll('[data-countdown]').forEach(function (el) { el.textContent = fmtMs(ms); });
    if (S.lives > 0) document.querySelectorAll('[data-wait-life]').forEach(function (el) { el.dispatchEvent(new Event('liferestored')); });
    if (S.lives > before) toast('A life has returned!');
  }, 1000);

  /* ======================================================================
     OPENING SCENE
     ====================================================================== */
  function intro(skipAnim) {
    var el = h(
      '<section class="intro">' +
      '<div class="hall"><div class="window"></div><div class="window w2"></div><div class="banner b1"></div><div class="banner b2"></div></div>' +
      '<h1 class="game-title">Realm of Reckoning</h1>' +
      '<div class="intro-stage">' +
      '<div class="frame">' + Characters.svg('aldric', Characters.appleArm()) + '<div class="crunch" aria-hidden="true">crunch!</div></div>' +
      '<div class="speech parchment" aria-live="polite"><div class="speaker">Master Aldric</div><p class="say"></p></div>' +
      '</div>' +
      '<div class="level-pick" hidden>' +
      '<h2>What manner of scholar art thou?</h2>' +
      '<div class="levels">' + MQ.levels.map(function (l) {
        return '<button class="level-btn' + (S.level === l.id ? ' current' : '') + '" data-l="' + l.id + '"><span class="ln">' + l.name + '</span><span class="la">' + l.ages + '</span></button>';
      }).join('') + '</div></div>' +
      '<button class="btn ghost skip-intro">Skip ▸</button>' +
      '</section>');
    show(el, false);
    var tok = screenToken;
    var arm = el.querySelector('#appleArm'), svg = el.querySelector('.portrait'), say = el.querySelector('.say');
    var pickBox = el.querySelector('.level-pick');

    el.querySelectorAll('.level-btn').forEach(function (b) {
      b.onclick = function () { S.level = b.dataset.l; save(); map(); };
    });
    function revealPick() {
      el.querySelector('.skip-intro').hidden = true;
      pickBox.hidden = false;
      pickBox.classList.add('rise');
    }
    el.querySelector('.skip-intro').onclick = function () {
      screenToken++;
      arm.style.transition = 'none';
      arm.style.transform = P.rest;
      for (var i = 0; i < 3; i++) bite(i);
      say.textContent = 'Welcome! Let’s learn mathematics.';
      revealPick();
    };

    var P = Characters.applePose, bites = P.bites;
    function bite(i) {
      var p = bites[i], NS = 'http://www.w3.org/2000/svg';
      var hole = document.createElementNS(NS, 'circle');
      hole.setAttribute('cx', p[0]); hole.setAttribute('cy', p[1]); hole.setAttribute('r', 7.5); hole.setAttribute('fill', '#000');
      el.querySelector('#biteHoles').appendChild(hole);
      var len = Math.hypot(p[0], p[1]) || 1;
      var flesh = document.createElementNS(NS, 'circle');
      flesh.setAttribute('cx', p[0] - p[0] / len * 2.6); flesh.setAttribute('cy', p[1] - p[1] / len * 2.6); flesh.setAttribute('r', 8.2); flesh.setAttribute('fill', '#f6ecc8');
      el.querySelector('#biteFlesh').appendChild(flesh);
    }
    function typeText(text) {
      say.textContent = '';
      svg.classList.add('talking');
      var i = 0;
      return new Promise(function (res) {
        (function step() {
          if (tok !== screenToken) return res();
          say.textContent = text.slice(0, ++i);
          if (i < text.length) setTimeout(step, 45); else { svg.classList.remove('talking'); res(); }
        })();
      });
    }

    if (skipAnim) { el.querySelector('.skip-intro').onclick(); return; }

    (async function () {
      await sleep(700); if (tok !== screenToken) return;
      arm.style.transform = P.near;
      await sleep(1000);
      for (var i = 0; i < 3; i++) {
        if (tok !== screenToken) return;
        arm.style.transform = P.bite;
        await sleep(180);
        bite(i); Sfx.crunch();
        var c = el.querySelector('.crunch'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
        svg.classList.add('chewing');
        arm.style.transform = P.back;
        await sleep(650);
      }
      if (tok !== screenToken) return;
      svg.classList.remove('chewing');
      arm.style.transform = P.rest;
      await sleep(700);
      await typeText('Welcome! Let’s learn mathematics.');
      await sleep(400);
      if (tok !== screenToken) return;
      revealPick();
    })();
  }

  /* ======================================================================
     MAP
     ====================================================================== */
  function seeded(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

  function map() {
    var L = level();
    if (!L) return intro(true);
    var rand = seeded(MQ.levels.indexOf(L) * 97 + 13);
    var cities = L.cities;

    var deco = '';
    /* sea along the right and bottom edge */
    deco += '<path d="M1000 0 L1000 620 L0 620 L0 590 C160 575 260 600 420 585 C600 570 720 600 830 560 C900 530 930 440 950 350 C965 260 940 160 960 80 C970 40 985 10 1000 0 Z" fill="url(#sea)" opacity=".9"/>';
    deco += '<path d="M0 590 C160 575 260 600 420 585 C600 570 720 600 830 560 C900 530 930 440 950 350 C965 260 940 160 960 80 C970 40 985 10 1000 0" stroke="#7a5a32" stroke-width="2" fill="none" opacity=".6"/>';
    for (var w = 0; w < 10; w++) {
      var wx = 600 + rand() * 360, wy = 560 + rand() * 50;
      deco += '<path d="M' + wx + ' ' + wy + ' q6 -5 12 0 q6 -5 12 0" stroke="#4a6a7a" stroke-width="1.5" fill="none" opacity=".6"/>';
    }
    /* river */
    deco += '<path d="M60 0 C120 120 40 200 140 280 C230 350 300 330 330 420 C350 500 300 560 340 620" stroke="#6f93a6" stroke-width="9" fill="none" opacity=".75" stroke-linecap="round"/>';
    /* mountains and forests */
    for (var i = 0; i < 26; i++) {
      var mx = 40 + rand() * 900, my = 40 + rand() * 500;
      if (cities.some(function (c) { return Math.abs(c.x - mx) < 140 && my > c.y - 110 && my < c.y + 130; }) || mx + my * 0.6 > 1180) continue;
      var s = 0.7 + rand() * 0.8;
      if (rand() < 0.5) {
        deco += '<g transform="translate(' + mx + ' ' + my + ') scale(' + s + ')"><path d="M-30 20 L0 -26 L30 20 Z" fill="#a8916a" stroke="#5a4428" stroke-width="2"/><path d="M0 -26 L-8 -12 L-2 -14 L4 -8 L9 -13 Z" fill="#f4ecdc"/><path d="M0 -26 L10 20" stroke="#5a4428" stroke-width="1" opacity=".5"/></g>';
      } else {
        for (var t = 0; t < 4; t++) {
          var tx = mx + (rand() - 0.5) * 50, ty = my + (rand() - 0.5) * 26;
          deco += '<g transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')"><path d="M0 -18 L10 6 L-10 6 Z" fill="#4f6b3a" stroke="#2e3f22" stroke-width="1.5"/><rect x="-1.5" y="6" width="3" height="5" fill="#5a4428"/></g>';
        }
      }
    }
    /* roads between cities, in order */
    var road = 'M' + cities[0].x + ' ' + cities[0].y;
    for (var r = 1; r < cities.length; r++) {
      var a = cities[r - 1], b = cities[r];
      road += ' Q' + ((a.x + b.x) / 2 + (r % 2 ? 40 : -40)) + ' ' + ((a.y + b.y) / 2 + (r % 2 ? -50 : 50)) + ' ' + b.x + ' ' + b.y;
    }
    deco += '<path d="' + road + '" stroke="#7a5a32" stroke-width="4" stroke-dasharray="10 8" fill="none" opacity=".8"/>';

    var citySvg = cities.map(function (c, i) {
      var p = prog(c.id), crest = p.exam !== null && p.exam >= CONFIG.examPassMark ? (p.exam === CONFIG.examQuestions ? 'gold' : 'silver') : null;
      return '<g class="city" tabindex="0" role="button" data-c="' + c.id + '" aria-label="' + esc(c.name + ': ' + c.topic) + '" transform="translate(' + c.x + ' ' + c.y + ')">' +
        '<ellipse cx="0" cy="34" rx="62" ry="12" fill="#5a4428" opacity=".18"/>' +
        '<g class="castle">' +
        '<rect x="-40" y="-10" width="80" height="44" fill="#d9c7a0" stroke="#4a3520" stroke-width="2.5"/>' +
        '<path d="M-40 -10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8" fill="#d9c7a0" stroke="#4a3520" stroke-width="2.5"/>' +
        '<rect x="-56" y="-34" width="22" height="68" fill="#cbb68c" stroke="#4a3520" stroke-width="2.5"/>' +
        '<rect x="34" y="-34" width="22" height="68" fill="#cbb68c" stroke="#4a3520" stroke-width="2.5"/>' +
        '<path d="M-60 -34 L-45 -56 L-30 -34 Z M30 -34 L45 -56 L60 -34 Z" fill="' + c.banner + '" stroke="#4a3520" stroke-width="2"/>' +
        '<path d="M-14 34 v-20 a14 14 0 0 1 28 0 v20 Z" fill="#4a3520"/>' +
        '<rect x="-50" y="-20" width="8" height="12" rx="4" fill="#4a3520"/><rect x="42" y="-20" width="8" height="12" rx="4" fill="#4a3520"/>' +
        '<path d="M0 -18 v-40" stroke="#4a3520" stroke-width="2.5"/><path d="M0 -58 l26 7 -26 7 Z" fill="' + c.banner + '" class="flag"/>' +
        '</g>' +
        (crest ? '<g transform="translate(46 -60)"><circle r="16" fill="' + (crest === 'gold' ? '#e0b84a' : '#c9ccd2') + '" stroke="#4a3520" stroke-width="2.5"/><path d="M0 -9 l2.6 5.6 6.1.7-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.7z" fill="#fff8e6"/></g>' : '') +
        '<g transform="translate(0 64)"><rect x="-92" y="-17" width="184" height="46" rx="6" fill="#f5e8c8" stroke="#4a3520" stroke-width="2"/>' +
        '<text y="2" text-anchor="middle" class="city-name">' + esc(c.name) + '</text>' +
        '<text y="20" text-anchor="middle" class="city-topic">' + esc(c.topic) + '</text></g>' +
        '<text x="-82" y="-24" text-anchor="middle" class="city-num">' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i] + '</text>' +
        '</g>';
    }).join('');

    var done = cities.filter(function (c) { var p = prog(c.id); return p.exam !== null && p.exam >= CONFIG.examPassMark; }).length;
    var el = h(
      '<section class="map-screen">' +
      '<div class="map-head"><div><div class="kicker">' + esc(L.full) + ' · ' + esc(L.ages) + '</div><h1>' + esc(L.region) + '</h1></div>' +
      '<div class="map-meta"><span class="crests">' + done + ' / ' + cities.length + ' crests</span><button class="btn ghost small-btn" data-a="level">Change level</button></div></div>' +
      '<p class="hint">Choose a city. Each city teaches one part of mathematics, then tests thee with its Exam.</p>' +
      '<div class="map-wrap parchment-map"><svg viewBox="0 0 1000 640" class="map-svg" role="group" aria-label="Map of ' + esc(L.region) + '">' +
      '<defs><radialGradient id="parch" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#f6e7c1"/><stop offset=".7" stop-color="#e8d2a0"/><stop offset="1" stop-color="#b98f55"/></radialGradient>' +
      '<linearGradient id="sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fbcc4"/><stop offset="1" stop-color="#6f93a6"/></linearGradient></defs>' +
      '<rect width="1000" height="640" fill="url(#parch)"/>' + deco +
      '<g transform="translate(880 110)" class="compass"><circle r="44" fill="#f5e8c8" stroke="#4a3520" stroke-width="2"/><path d="M0 -40 L8 0 L0 40 L-8 0 Z" fill="#8c1c24"/><path d="M-40 0 L0 -8 L40 0 L0 8 Z" fill="#4a3520"/><text y="-48" text-anchor="middle" class="city-topic">N</text></g>' +
      citySvg + '</svg></div>' +
      '</section>');
    show(el, true);
    el.querySelector('[data-a=level]').onclick = function () { intro(true); };
    el.querySelectorAll('.city').forEach(function (g) {
      var open = function () { cityPanel(findCity(g.dataset.c)); };
      g.addEventListener('click', open);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }

  function cityPanel(c) {
    var p = prog(c.id), host = Characters.get(c.host);
    var practiced = p.practice !== null;
    var m = modal(
      '<div class="city-panel"><div class="cp-portrait">' + Characters.svg(c.host) + '</div><div>' +
      '<div class="kicker">The city of</div><h2>' + esc(c.name) + '</h2><div class="topic">' + esc(c.topic) + '</div>' +
      '<p class="greet">“Welcome, traveller. I am <b>' + esc(host.name) + '</b>, ' + esc(host.title.toLowerCase()) + '. I shall be thy guide in ' + esc(c.name) + '.”</p>' +
      '<ul class="status"><li class="' + (p.lesson ? 'ok' : '') + '">Lesson</li><li class="' + (practiced ? 'ok' : '') + '">Questions' + (practiced ? ' · best ' + p.practice + '/' + CONFIG.practiceQuestions : '') + '</li>' +
      '<li class="' + (p.exam !== null && p.exam >= CONFIG.examPassMark ? 'ok' : '') + '">Exam' + (p.exam !== null ? ' · best ' + p.exam + '/' + CONFIG.examQuestions : '') + '</li></ul>' +
      '</div></div>' +
      '<div class="row"><button class="btn gold" data-a="lesson">Enter the city · Lesson</button>' +
      '<button class="btn" data-a="practice">Skip to questions</button>' +
      '<button class="btn" data-a="exam"' + (practiced ? '' : ' disabled title="Answer the questions first"') + '>' + (practiced ? 'Take the Exam' : 'Exam 🔒') + '</button>' +
      '<button class="btn ghost" data-a="x">Close</button></div>');
    m.el.querySelector('[data-a=lesson]').onclick = function () { m.close(); lesson(c); };
    m.el.querySelector('[data-a=practice]').onclick = function () { m.close(); p.lesson = true; save(); quiz(c, 'practice'); };
    m.el.querySelector('[data-a=exam]').onclick = function () { m.close(); quiz(c, 'exam'); };
    m.el.querySelector('[data-a=x]').onclick = m.close;
  }

  /* ======================================================================
     LESSON
     ====================================================================== */
  function lesson(c) {
    var i = 0, steps = c.lesson;
    var el = h(
      '<section class="lesson">' +
      '<div class="lesson-head"><button class="btn ghost small-btn" data-a="map">◂ Map</button><div><div class="kicker">Lesson</div><h1>' + esc(c.name) + ' · ' + esc(c.topic) + '</h1></div>' +
      '<button class="btn small-btn" data-a="skip">Skip lesson ▸</button></div>' +
      '<div class="stage"><div class="hall"><div class="window"></div><div class="banner b1"></div></div>' +
      '<div class="actor"><div class="frame portrait-slot"></div><div class="nameplate"></div></div>' +
      '<div class="scroll parchment"><p class="text"></p><div class="ex" hidden></div></div></div>' +
      '<div class="lesson-foot"><button class="btn ghost" data-a="back">◂ Back</button><div class="dots"></div><button class="btn gold" data-a="next">Next ▸</button></div>' +
      '</section>');
    show(el, true);
    var slot = el.querySelector('.portrait-slot'), plate = el.querySelector('.nameplate'), text = el.querySelector('.text'), ex = el.querySelector('.ex');
    var dots = el.querySelector('.dots'), next = el.querySelector('[data-a=next]'), back = el.querySelector('[data-a=back]');
    var current = null, talkTimer = null;
    function render() {
      var s = steps[i], who = Characters.get(s.who);
      if (current !== s.who) { slot.innerHTML = Characters.svg(s.who); current = s.who; slot.classList.remove('enter'); void slot.offsetWidth; slot.classList.add('enter'); }
      plate.innerHTML = '<b>' + esc(who.name) + '</b><span>' + esc(who.title) + '</span>';
      text.innerHTML = s.text;
      if (s.ex) { ex.hidden = false; ex.innerHTML = '<div class="ex-label">Example</div>' + s.ex; } else ex.hidden = true;
      var svg = slot.querySelector('svg'); svg.classList.add('talking');
      clearTimeout(talkTimer); talkTimer = setTimeout(function () { svg.classList.remove('talking'); }, 1600);
      dots.innerHTML = steps.map(function (_, k) { return '<span class="' + (k === i ? 'on' : k < i ? 'seen' : '') + '"></span>'; }).join('');
      back.disabled = i === 0;
      next.textContent = i === steps.length - 1 ? 'Begin the questions ▸' : 'Next ▸';
      el.querySelector('.scroll').classList.remove('unfurl'); void el.offsetWidth; el.querySelector('.scroll').classList.add('unfurl');
    }
    function finish() { prog(c.id).lesson = true; save(); quiz(c, 'practice'); }
    next.onclick = function () { if (i < steps.length - 1) { i++; render(); } else finish(); };
    back.onclick = function () { if (i > 0) { i--; render(); } };
    el.querySelector('[data-a=skip]').onclick = finish;
    el.querySelector('[data-a=map]').onclick = map;
    render();
  }

  /* ======================================================================
     QUESTIONS & EXAM
     ====================================================================== */
  function makeQuestions(gens, count) {
    var out = [], order = [];
    while (order.length < count) order = order.concat(U.shuffle(gens.map(function (_, k) { return k; })));
    order = order.slice(0, count);
    var seen = {};
    order.forEach(function (k) {
      var q, tries = 0;
      do { q = gens[k](); tries++; } while (seen[q.q] && tries < 10);
      seen[q.q] = true; out.push(q);
    });
    return out;
  }

  function quiz(c, mode) {
    var exam = mode === 'exam';
    var total = exam ? CONFIG.examQuestions : CONFIG.practiceQuestions;
    var qs = makeQuestions(exam ? c.exam : c.practice, total);
    var idx = 0, score = 0;
    var host = Characters.get(c.host);
    var cheers = ['Steady now…', 'Think it through.', 'Take thy time.', 'Show thy working on parchment!', 'Courage, scholar.'];

    var el = h(
      '<section class="quiz ' + (exam ? 'is-exam' : '') + '">' +
      '<div class="quiz-head"><button class="btn ghost small-btn" data-a="leave">◂ Leave</button>' +
      '<div class="qtitle"><div class="kicker">' + (exam ? 'The Exam of ' : 'Questions · ') + esc(c.name) + '</div><div class="qcount"></div></div>' +
      '<div class="score-chip"></div></div>' +
      '<div class="progress"><div class="bar"></div></div>' +
      '<div class="quiz-body"><div class="mini-host"><div class="frame">' + Characters.svg(c.host) + '</div><div class="bubble"></div></div>' +
      '<div class="qcard parchment"><div class="qtext"></div><div class="answers"></div><div class="feedback" hidden></div></div></div>' +
      '</section>');

    function startUp() {
      show(el, true);
      el.querySelector('[data-a=leave]').onclick = function () {
        var m = modal('<h2>Leave ' + esc(c.name) + '?</h2><p>Thy progress in this ' + (exam ? 'exam' : 'round') + ' will be lost. Lives already spent stay spent.</p>' +
          '<div class="row"><button class="btn gold" data-a="stay">Stay</button><button class="btn ghost" data-a="go">Leave to the map</button></div>');
        m.el.querySelector('[data-a=stay]').onclick = m.close;
        m.el.querySelector('[data-a=go]').onclick = function () { m.close(); map(); };
      };
      render();
    }

    function render() {
      var q = qs[idx];
      el.querySelector('.qcount').textContent = 'Question ' + (idx + 1) + ' of ' + total;
      el.querySelector('.score-chip').textContent = score + ' correct';
      el.querySelector('.bar').style.width = (idx / total * 100) + '%';
      el.querySelector('.bubble').innerHTML = '<b>' + esc(host.name) + ':</b> ' + (exam && idx === 0 ? 'These questions are hard. Prove thy mastery!' : U.pick(cheers));
      el.querySelector('.qtext').innerHTML = q.q;
      var fb = el.querySelector('.feedback'); fb.hidden = true; fb.className = 'feedback';
      var box = el.querySelector('.answers');
      box.innerHTML = '';
      if (q.type === 'mc') {
        box.className = 'answers mc';
        q.options.forEach(function (o, k) {
          var b = h('<button class="opt"><span class="letter">' + 'ABCD'[k] + '</span><span class="otext">' + o + '</span></button>');
          b.onclick = function () { answer(o === q.answer, b); };
          box.appendChild(b);
        });
      } else {
        box.className = 'answers typed';
        box.appendChild(h('<form class="typed-form" autocomplete="off"><input class="ans-input" inputmode="text" aria-label="Your answer" placeholder="Thy answer"><button class="btn gold" type="submit">Submit</button></form>'));
        box.appendChild(h('<div class="small">Whole numbers, negatives, decimals or fractions like <b>7/12</b> are all accepted.</div>'));
        var f = box.querySelector('form'), inp = box.querySelector('input');
        f.onsubmit = function (e) {
          e.preventDefault();
          if (!inp.value.trim()) { inp.focus(); return; }
          if (!isFinite(U.parseAnswer(inp.value))) { toast('Please enter a number, e.g. 12, −3, 2.5 or 7/12'); return; }
          answer(U.checkNum(inp.value, q.answer), null, inp);
        };
        setTimeout(function () { inp.focus(); }, 50);
      }
    }

    function answer(correct, btn, inp) {
      var q = qs[idx], fb = el.querySelector('.feedback');
      el.querySelectorAll('.answers button, .answers input').forEach(function (b) { b.disabled = true; });
      if (q.type === 'mc') {
        var opts = el.querySelectorAll('.opt');
        q.options.forEach(function (o, k) { if (o === q.answer) opts[k].classList.add('right'); });
        if (!correct && btn) btn.classList.add('wrong');
      } else if (inp) inp.classList.add(correct ? 'right' : 'wrong');

      if (correct) { score++; Sfx.right(); } else { Sfx.wrong(); Lives.lose(); }
      var outOfLives = !correct && S.lives === 0;
      fb.hidden = false;
      fb.className = 'feedback ' + (correct ? 'good' : 'bad');
      fb.innerHTML = '<div class="verdict">' + (correct ? '✔ Correct! Well reckoned.' : '✘ Not quite — thou hast lost a life.') + '</div>' +
        (correct ? '' : '<div class="the-answer">The answer is <b>' + (q.type === 'mc' ? q.answer : q.answerText) + '</b></div>') +
        '<div class="explain">' + q.explain + '</div>' +
        '<button class="btn gold next-q">' + (idx === total - 1 ? 'See results ▸' : 'Next question ▸') + '</button>';
      el.querySelector('.score-chip').textContent = score + ' correct';
      var nb = fb.querySelector('.next-q');
      nb.focus({ preventScroll: true });
      fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      nb.onclick = async function () {
        if (idx === total - 1) return results(c, mode, score, total);
        if (outOfLives || S.lives === 0) {
          var ok = await needLife();
          if (!ok) return map();
        }
        idx++; render();
      };
    }

    needLife().then(function (ok) { if (ok) startUp(); else map(); });
  }

  /* ======================================================================
     RESULTS
     ====================================================================== */
  function results(c, mode, score, total) {
    var p = prog(c.id), exam = mode === 'exam';
    if (exam) p.exam = Math.max(p.exam === null ? 0 : p.exam, score); else p.practice = Math.max(p.practice === null ? 0 : p.practice, score);
    save();
    var passed = exam && score >= CONFIG.examPassMark, perfect = score === total;
    var host = Characters.get(c.host);
    var title, line;
    if (!exam) { title = 'Questions complete'; line = score === total ? 'Flawless! Thou art ready for the Exam.' : score >= total / 2 ? 'Well done. Now face the Exam of ' + c.name + ' — it is far harder.' : 'A shaky start. Perhaps revisit the lesson before the Exam.'; }
    else if (perfect) { title = 'A Golden Crest!'; line = 'Every answer true. Thy name shall be sung in ' + c.name + '!'; }
    else if (passed) { title = 'Exam passed!'; line = 'Thou hast earned the Silver Crest of ' + c.name + '. Score full marks to turn it gold.'; }
    else { title = 'The Exam bested thee'; line = 'Thou needest ' + CONFIG.examPassMark + ' of ' + total + ' to pass. Study the lesson and return.'; }
    var el = h(
      '<section class="results">' +
      '<div class="res-card parchment">' +
      '<div class="res-portrait">' + Characters.svg(c.host) + '</div>' +
      (exam && passed ? '<div class="crest ' + (perfect ? 'gold' : 'silver') + '"><svg viewBox="-20 -20 40 40"><circle r="18"/><path d="M0 -10 l3 6.3 6.9.8-5.1 4.6 1.4 6.8-6.2-3.5-6.2 3.5 1.4-6.8-5.1-4.6 6.9-.8z"/></svg></div>' : '') +
      '<div class="kicker">' + esc(c.name) + ' · ' + (exam ? 'Exam' : 'Questions') + '</div>' +
      '<h1>' + title + '</h1><div class="big-score">' + score + ' / ' + total + '</div>' +
      '<p class="said">“' + esc(line) + '”<br><span class="small">— ' + esc(host.name) + '</span></p>' +
      '<div class="row">' +
      (exam ? '<button class="btn gold" data-a="exam">' + (passed ? 'Retake for a better score' : 'Retake the Exam') + '</button><button class="btn" data-a="lesson">Review the lesson</button>'
        : '<button class="btn gold" data-a="exam">Take the Exam ▸</button><button class="btn" data-a="practice">More questions</button>') +
      '<button class="btn ghost" data-a="map">Return to the map</button></div>' +
      '</div></section>');
    show(el, true);
    if (passed) Sfx.fanfare();
    var b;
    if ((b = el.querySelector('[data-a=exam]'))) b.onclick = function () { quiz(c, 'exam'); };
    if ((b = el.querySelector('[data-a=practice]'))) b.onclick = function () { quiz(c, 'practice'); };
    if ((b = el.querySelector('[data-a=lesson]'))) b.onclick = function () { lesson(c); };
    el.querySelector('[data-a=map]').onclick = map;
  }

  /* ---------------- top bar ---------------- */
  document.getElementById('hearts-btn').onclick = livesPanel;
  document.getElementById('home-btn').onclick = function () { if (S.level) map(); else intro(true); };
  document.getElementById('sound-btn').onclick = function () { S.sound = !S.sound; save(); renderHearts(); };

  /* Expose a tiny API for debugging and for wiring real payments later. */
  window.Realm = { state: S, lives: Lives, addLife: function () { Lives.add(); }, map: map, intro: intro };

  intro(false);
})();

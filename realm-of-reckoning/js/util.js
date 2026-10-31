/* Shared helpers for question generators and the UI. Plain script (no modules) so the
   app also works when index.html is opened straight from disk. */
var U = (function () {
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }

  /* Display a number with a typographic minus sign. */
  function n(x) { return x < 0 ? '−' + Math.abs(x) : String(x); }

  /* Simplified fraction string, e.g. fr(6, -8) -> "−3/4", fr(4, 2) -> "2". */
  function fr(a, b) {
    if (b < 0) { a = -a; b = -b; }
    var g = gcd(a, b) || 1;
    a /= g; b /= g;
    return b === 1 ? n(a) : n(a) + '/' + b;
  }

  function sup(p) {
    return String(p).split('').map(function (d) { return d === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]; }).join('');
  }

  /* Polynomial from coefficients, highest power first: poly([1,-2,-15]) -> "x² − 2x − 15". */
  function poly(coefs, v) {
    v = v || 'x';
    var deg = coefs.length - 1, out = '';
    coefs.forEach(function (c, i) {
      var p = deg - i;
      if (c === 0) return;
      var abs = Math.abs(c);
      var term = (abs === 1 && p > 0) ? '' : String(abs);
      if (p === 1) term += v; else if (p > 1) term += v + sup(p);
      if (out === '') out = (c < 0 ? '−' : '') + term;
      else out += (c < 0 ? ' − ' : ' + ') + term;
    });
    return out || '0';
  }

  /* " + 5" / " − 5" for appending a constant. */
  function sgn(c) { return c < 0 ? ' − ' + Math.abs(c) : ' + ' + c; }

  function mat(rows) {
    return '<span class="mat"><table>' + rows.map(function (r) {
      return '<tr>' + r.map(function (x) { return '<td>' + n(x) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</table></span>';
  }

  /* Multiple choice with string options. */
  function mcStr(q, correct, distractors, explain) {
    var opts = [String(correct)];
    distractors.forEach(function (d) {
      var s = String(d);
      if (opts.length < 4 && opts.indexOf(s) === -1) opts.push(s);
    });
    return { q: q, type: 'mc', options: shuffle(opts), answer: String(correct), explain: explain };
  }

  /* Multiple choice with numeric options; pads with nearby wrong values if needed. */
  function mcNum(q, correct, distractors, explain) {
    var list = distractors.filter(function (d) { return d !== correct && isFinite(d); });
    var pads = [1, -1, 2, 10, -10, -2, 3, 5];
    for (var i = 0; list.length < 6 && i < pads.length; i++) list.push(correct + pads[i]);
    return mcStr(q, n(correct), list.map(n), explain);
  }

  /* Typed numeric answer. `answer` is a number; `answerText` how we display it. */
  function num(q, answer, explain, answerText) {
    return { q: q, type: 'num', answer: answer, answerText: answerText || n(answer), explain: explain };
  }
  /* Typed answer that is a fraction a/b (accepts any equivalent form). */
  function numFr(q, a, b, explain) { return num(q, a / b, explain, fr(a, b)); }

  /* Parse what a learner types: integers, decimals, fractions, with £ p ° x= etc stripped. */
  function parseAnswer(s) {
    s = String(s).trim().replace(/[−–—]/g, '-').replace(/^[a-z]\s*=\s*/i, '')
      .replace(/[£°\s,]/g, '').replace(/(p|pence|cm|m|degrees|tiles|days)$/i, '');
    var m = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (m) { var d = Number(m[2]); return d === 0 ? NaN : Number(m[1]) / d; }
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
    return NaN;
  }
  function checkNum(input, answer) {
    var v = parseAnswer(input);
    if (!isFinite(v)) return false;
    return Math.abs(v - answer) <= 0.005 + 1e-9 * Math.abs(answer);
  }

  function isPrime(x) {
    if (x < 2) return false;
    for (var i = 2; i * i <= x; i++) if (x % i === 0) return false;
    return true;
  }
  function divisors(x) { var d = []; for (var i = 1; i <= x; i++) if (x % i === 0) d.push(i); return d; }
  function primeFactors(x) { var f = []; for (var p = 2; x > 1; p++) while (x % p === 0) { f.push(p); x /= p; } return f; }
  function phi(x) { var c = 0; for (var k = 1; k <= x; k++) if (gcd(k, x) === 1) c++; return c; }
  function modpow(b, e, m) { var r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; }
  function choose(a, b) { var r = 1; for (var i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); }

  return {
    rnd: rnd, pick: pick, shuffle: shuffle, gcd: gcd, lcm: lcm, n: n, fr: fr, sup: sup, poly: poly, sgn: sgn, mat: mat,
    mcStr: mcStr, mcNum: mcNum, num: num, numFr: numFr, parseAnswer: parseAnswer, checkNum: checkNum,
    isPrime: isPrime, divisors: divisors, primeFactors: primeFactors, phi: phi, modpow: modpow, choose: choose
  };
})();

/* Registry the content files add their levels to. */
var MQ = { levels: [], addLevel: function (l) { this.levels.push(l); } };

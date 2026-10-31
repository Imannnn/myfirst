(function () {
  var rnd = U.rnd, pick = U.pick, shuffle = U.shuffle, mcNum = U.mcNum, mcStr = U.mcStr, num = U.num, numFr = U.numFr, fr = U.fr, n = U.n, poly = U.poly, sup = U.sup, mat = U.mat;

  function nz(a, b) { var x; do { x = rnd(a, b); } while (x === 0); return x; }
  function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }
  function rank(M) {
    var A = M.map(function (r) { return r.slice(); }), rows = A.length, cols = A[0].length, rk = 0;
    for (var c = 0; c < cols && rk < rows; c++) {
      var p = -1;
      for (var r = rk; r < rows; r++) if (Math.abs(A[r][c]) > 1e-9) { p = r; break; }
      if (p < 0) continue;
      var t = A[p]; A[p] = A[rk]; A[rk] = t;
      for (r = 0; r < rows; r++) if (r !== rk) {
        var f = A[r][c] / A[rk][c];
        for (var k = c; k < cols; k++) A[r][k] -= f * A[rk][k];
      }
      rk++;
    }
    return rk;
  }
  /* "y″ − 5y′ + 6y" from coefficients of y′ and y. */
  function ode(b, c) {
    var out = 'y″';
    if (b) out += (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y′';
    if (c) out += (c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'y';
    return out;
  }
  /* 2×2 integer matrix with prescribed integer eigenvalues l1, l2. */
  function eigMatrix(l1, l2) {
    var k = nz(-3, 3), P = k * (l2 - l1 - k), m, q;
    if (P === 0) { m = nz(-4, 4); q = 0; if (Math.random() < 0.5) { q = m; m = 0; } }
    else {
      var ds = U.divisors(Math.abs(P)).filter(function (d) { return d <= 9 && Math.abs(P) / d <= 12; });
      if (!ds.length) ds = [1];
      m = pick(ds) * pick([1, -1]); q = P / m;
    }
    return [[l1 + k, m], [q, l2 - k]];
  }

  MQ.addLevel({
    id: 'uni', name: 'University', full: 'University', ages: 'Undergraduate', region: 'The Far Reaches of Abstraction',
    cities: [
      {
        id: 'matrixburgh', name: 'Matrixburgh', topic: 'Linear Algebra', host: 'edmund', x: 170, y: 280, banner: '#1c2a5a',
        lesson: [
          { who: 'edmund', text: 'The streets of <b>Matrixburgh</b> form a perfect grid. Its scholars study <b>matrices</b>: arrays that encode linear maps.' },
          { who: 'edmund', text: 'Multiply row by column: entry (i, j) of AB is row i of A dotted with column j of B. In general AB ≠ BA.' },
          { who: 'eleanor', text: 'The <b>determinant</b> of [[a, b], [c, d]] is ad − bc. For 3×3, expand along a row using cofactors. A is invertible ⇔ det A ≠ 0.', ex: 'det [[2, 1], [5, 3]] = 6 − 5 = 1 → inverse [[3, −1], [−5, 2]]' },
          { who: 'rowena', text: 'Properties: det(AB) = det A · det B, det(Aᵀ) = det A, det(A⁻¹) = 1/det A, and det(kA) = kⁿ det A for an n × n matrix.' },
          { who: 'edmund', text: '<b>Eigenvalues</b> solve det(A − λI) = 0. For 2×2: λ² − (tr A)λ + det A = 0. Their sum is the trace, their product is the determinant. Aᵏ has eigenvalues λᵏ.' },
          { who: 'aldric', text: '<b>Rank–nullity</b>: for an m × n matrix, rank + dim(null space) = n. Row-reduce to find the rank.' }
        ],
        practice: [
          function () {
            var A = [[rnd(-5, 7), rnd(-5, 7)], [rnd(-5, 7), rnd(-5, 7)]], d = det2(A);
            return mcNum('Find the determinant of ' + mat(A), d, [A[0][0] * A[1][1] + A[0][1] * A[1][0], A[0][1] * A[1][0] - A[0][0] * A[1][1], A[0][0] * A[0][1] - A[1][0] * A[1][1]],
              'ad − bc = ' + n(A[0][0]) + '×' + n(A[1][1]) + ' − ' + n(A[0][1]) + '×' + n(A[1][0]) + ' = <b>' + n(d) + '</b>.');
          },
          function () {
            var A = [[rnd(-6, 9), rnd(-6, 9), rnd(-6, 9)], [rnd(-6, 9), rnd(-6, 9), rnd(-6, 9)], [rnd(-6, 9), rnd(-6, 9), rnd(-6, 9)]], t = A[0][0] + A[1][1] + A[2][2];
            return mcNum('Find the <b>trace</b> of ' + mat(A), t, [A[0][2] + A[1][1] + A[2][0], t + A[0][1], A[0][0] * A[1][1] * A[2][2]],
              'Sum of the diagonal: <b>' + n(t) + '</b>.');
          },
          function () {
            var A = [[rnd(-4, 5), rnd(-4, 5)], [rnd(-4, 5), rnd(-4, 5)]], B = [[rnd(-4, 5), rnd(-4, 5)], [rnd(-4, 5), rnd(-4, 5)]];
            var v = A[0][0] * B[0][0] + A[0][1] * B[1][0];
            return mcNum('Let A = ' + mat(A) + ' and B = ' + mat(B) + '. Find the <b>top-left</b> entry of <b>AB</b>.', v, [A[0][0] * B[0][0] + A[0][1] * B[0][1], A[0][0] * B[0][0], A[0][0] * B[0][0] + A[1][0] * B[0][1]],
              'Row 1 of A · column 1 of B = ' + n(A[0][0]) + '×' + n(B[0][0]) + ' + ' + n(A[0][1]) + '×' + n(B[1][0]) + ' = <b>' + n(v) + '</b>.');
          },
          function () {
            var a = nz(-4, 4), b = nz(-4, 4), k = nz(-3, 3), S = [[a, b], [k * a, k * b]], opts = [S];
            while (opts.length < 4) { var M = [[nz(-5, 5), nz(-5, 5)], [nz(-5, 5), nz(-5, 5)]]; if (det2(M) !== 0) opts.push(M); }
            return mcStr('Which matrix is <b>singular</b> (not invertible)?', mat(S), opts.slice(1).map(mat),
              'Its determinant is ' + n(a) + '×' + n(k * b) + ' − ' + n(b) + '×' + n(k * a) + ' = 0 (row 2 = ' + n(k) + ' × row 1). The others have non-zero determinant.');
          },
          function () {
            var d = nz(-6, 6), k = rnd(2, 4), sz = pick([2, 3]);
            return mcNum('A is a ' + sz + ' × ' + sz + ' matrix with <b>det A = ' + n(d) + '</b>. Find <b>det(' + k + 'A)</b>.', Math.pow(k, sz) * d, [k * d, k * k * k * k * d, d + k, sz * k * d],
              'det(kA) = k' + sup(sz) + ' det A = ' + Math.pow(k, sz) + ' × ' + n(d) + ' = <b>' + n(Math.pow(k, sz) * d) + '</b>.');
          }
        ],
        exam: [
          function () {
            var A; do { A = [[rnd(-3, 4), rnd(-3, 4), rnd(-3, 4)], [rnd(-3, 4), rnd(-3, 4), rnd(-3, 4)], [rnd(-3, 4), rnd(-3, 4), rnd(-3, 4)]]; } while (det3(A) === 0);
            return num('Find the determinant of ' + mat(A), det3(A), 'Cofactor expansion along the first row gives <b>' + n(det3(A)) + '</b>.');
          },
          function () {
            var l1 = rnd(-5, 6), l2; do { l2 = rnd(-5, 7); } while (l2 === l1);
            var A = eigMatrix(l1, l2);
            return num('Find the <b>largest eigenvalue</b> of ' + mat(A), Math.max(l1, l2),
              'Characteristic equation: λ² − (' + n(l1 + l2) + ')λ + (' + n(l1 * l2) + ') = 0 → λ = ' + n(Math.min(l1, l2)) + ' or ' + n(Math.max(l1, l2)) + '. Largest: <b>' + n(Math.max(l1, l2)) + '</b>.');
          },
          function () {
            var sz = pick([2, 3, 4]), a = nz(-5, 5), b = nz(-5, 5), k = pick([2, 3, -2]);
            return num('A and B are ' + sz + ' × ' + sz + ' matrices with <b>det A = ' + n(a) + '</b> and <b>det B = ' + n(b) + '</b>. Find <b>det(' + n(k) + ' A Bᵀ A⁻¹)</b>.', Math.pow(k, sz) * b,
              'det(' + n(k) + 'M) = (' + n(k) + ')' + sup(sz) + ' det M, and det(A Bᵀ A⁻¹) = det A · det B · (1/det A) = ' + n(b) + '. Answer: ' + n(Math.pow(k, sz)) + ' × ' + n(b) + ' = <b>' + n(Math.pow(k, sz) * b) + '</b>.');
          },
          function () {
            var r = rnd(1, 3), v1 = [rnd(-3, 3), nz(-3, 3), rnd(-3, 3), rnd(-3, 3)], v2 = [nz(-3, 3), rnd(-3, 3), rnd(-3, 3), rnd(-3, 3)], M;
            function comb(x, y, p, q) { return x.map(function (_, i) { return p * x[i] + q * y[i]; }); }
            if (r === 1) M = [v1, comb(v1, v1, nz(-2, 2), 0), comb(v1, v1, nz(-2, 2), 0)];
            else if (r === 2) M = [v1, v2, comb(v1, v2, nz(-2, 2), nz(-2, 2))];
            else M = [v1, v2, [rnd(-3, 3), rnd(-3, 3), rnd(-3, 3), nz(-3, 3)]];
            M = shuffle(M);
            var rk = rank(M);
            return num('Find the <b>dimension of the null space</b> of the 3 × 4 matrix ' + mat(M), 4 - rk,
              'Row reduction shows rank ' + rk + '. By rank–nullity, nullity = 4 − ' + rk + ' = <b>' + (4 - rk) + '</b>.');
          },
          function () {
            var l1 = rnd(-4, 4), l2; do { l2 = rnd(-4, 4); } while (l2 === l1);
            var A = eigMatrix(l1, l2), v = (l1 * l1 + 1) * (l2 * l2 + 1);
            return num('Let A = ' + mat(A) + '. Find <b>det(A² + I)</b>.', v,
              'A has eigenvalues ' + n(l1) + ' and ' + n(l2) + ' (trace ' + n(l1 + l2) + ', det ' + n(l1 * l2) + '). A² + I has eigenvalues λ² + 1: ' + (l1 * l1 + 1) + ' and ' + (l2 * l2 + 1) + '. Product = <b>' + v + '</b>.');
          },
          function () {
            var k = nz(-5, 5), m = nz(-5, 5), A = [[k * m + 1, k], [m, 1]], inv = [[1, -k], [-m, k * m + 1]], s = 2 + k * m - k - m;
            return num('Let A = ' + mat(A) + '. Find the <b>sum of all four entries</b> of <b>A⁻¹</b>.', s,
              'det A = ' + n(k * m + 1) + ' − (' + n(k * m) + ') = 1, so A⁻¹ = ' + mat(inv) + '. Sum = <b>' + n(s) + '</b>.');
          },
          function () {
            var l1 = rnd(-3, 3), l2; do { l2 = rnd(-3, 3); } while (l2 === l1);
            var A = eigMatrix(l1, l2), v = l1 * l1 * l1 + l2 * l2 * l2;
            return num('Let A = ' + mat(A) + '. Find the <b>trace of A³</b>.', v,
              'Eigenvalues ' + n(l1) + ', ' + n(l2) + '. tr(A³) = λ₁³ + λ₂³ = ' + n(l1 * l1 * l1) + ' + ' + n(l2 * l2 * l2) + ' = <b>' + n(v) + '</b>.');
          }
        ]
      },
      {
        id: 'limitsby', name: 'Limitsby', topic: 'Limits & Series (Analysis)', host: 'isolde', x: 420, y: 470, banner: '#8c1c24',
        lesson: [
          { who: 'isolde', text: '<b>Limitsby</b> lies at the edge of the map: you may approach it ever closer, but you must reason precisely about what happens there.' },
          { who: 'edmund', text: 'lim f(x) = L as x → a means: for every ε > 0 there is δ > 0 such that 0 &lt; |x − a| &lt; δ ⇒ |f(x) − L| &lt; ε.' },
          { who: 'edmund', text: 'Standard limits as x → 0: sin x / x → 1, (eˣ − 1)/x → 1. As n → ∞: (1 + a/n)ⁿ → eᵃ. Taylor series are your best tool: sin x = x − x³/6 + …, cos x = 1 − x²/2 + …' },
          { who: 'isolde', text: '<b>L\'Hôpital</b>: for 0/0 or ∞/∞ forms, lim f/g = lim f′/g′ (when that limit exists).', ex: 'lim (1 − cos x)/x² = lim sin x/(2x) = <b>½</b>' },
          { who: 'rowena', text: 'Σ rⁿ converges iff |r| &lt; 1. Σ 1/nᵖ converges iff p > 1. <b>Telescoping</b>: Σ 1/(n(n+1)) = Σ (1/n − 1/(n+1)) = 1.' },
          { who: 'edmund', text: '<b>Radius of convergence</b> of Σ cₙxⁿ: R = lim |cₙ/cₙ₊₁| (ratio test). Differentiating Σ xⁿ = 1/(1 − x) gives Σ n xⁿ = x/(1 − x)².', ex: 'Σ xⁿ/3ⁿ has R = 3' }
        ],
        practice: [
          function () {
            var a = nz(-6, 9), b = rnd(-9, 9), c = nz(-6, 9), d = rnd(-9, 9);
            return mcStr('Find <b>lim<sub>n→∞</sub> (' + poly([a, b], 'n') + ')/(' + poly([c, d], 'n') + ')</b>.', fr(a, c), [d ? fr(b, d) : '0', '∞', fr(c, a), '0'],
              'Divide top and bottom by n: → ' + n(a) + '/' + n(c) + ' = <b>' + fr(a, c) + '</b>.');
          },
          function () {
            var k = nz(-7, 9);
            return mcNum('Find <b>lim<sub>x→0</sub> sin(' + poly([k, 0]) + ')/x</b>.', k, [1, 0, 1 / k > 0 ? k + 1 : k - 1],
              'sin(' + poly([k, 0]) + ')/x = ' + n(k) + ' · sin(' + poly([k, 0]) + ')/(' + poly([k, 0]) + ') → <b>' + n(k) + '</b>.');
          },
          function () {
            var k = rnd(2, 9);
            return mcStr('Evaluate <b>Σ<sub>n=0</sub><sup>∞</sup> (1/' + k + ')ⁿ</b>.', fr(k, k - 1), [fr(1, k - 1), fr(k - 1, k), '∞'],
              'Geometric: 1/(1 − 1/' + k + ') = <b>' + fr(k, k - 1) + '</b>.');
          },
          function () {
            var div = pick(['Σ 1/n', 'Σ 1/√n', 'Σ n/(n + 1)', 'Σ 1/(2n + 1)']);
            return mcStr('Which series <b>diverges</b>?', div, shuffle(['Σ 1/n²', 'Σ 1/2ⁿ', 'Σ 1/n!', 'Σ (−1)ⁿ/n', 'Σ 1/n³']),
              '<b>' + div + '</b> diverges (compare with the harmonic series, or the terms do not tend to 0). The others converge.');
          },
          function () {
            var a = nz(-4, 5);
            return mcStr('Find <b>lim<sub>n→∞</sub> (1 + ' + (a < 0 ? '(' + n(a) + ')' : a) + '/n)ⁿ</b>.', a === 1 ? 'e' : 'e' + sup(a), ['1', '∞', a === 1 ? 'e²' : 'e', String(a)],
              'The standard limit (1 + a/n)ⁿ → eᵃ gives <b>' + (a === 1 ? 'e' : 'e' + sup(a)) + '</b>.');
          }
        ],
        exam: [
          function () {
            var a = nz(-6, 6);
            return numFr('Evaluate <b>lim<sub>x→0</sub> (1 − cos ' + poly([a, 0]) + ')/x²</b>.', a * a, 2,
              'cos ' + poly([a, 0]) + ' ≈ 1 − (' + poly([a, 0]) + ')²/2, so the limit is ' + (a * a) + '/2 = <b>' + fr(a * a, 2) + '</b>.');
          },
          function () {
            var a = nz(-8, 8), b = nz(-6, 6);
            return numFr('Evaluate <b>lim<sub>x→0</sub> (e<sup>' + poly([a, 0]) + '</sup> − 1)/(' + poly([b, 0]) + ')</b>.', a, b,
              'e<sup>' + n(a) + 'x</sup> − 1 ≈ ' + poly([a, 0]) + ', so the limit is ' + n(a) + '/' + n(b) + ' = <b>' + fr(a, b) + '</b>.');
          },
          function () {
            var k = rnd(1, 4), H = [0, [1, 1], [3, 2], [11, 6], [25, 12]][k];
            return numFr('Evaluate <b>Σ<sub>n=1</sub><sup>∞</sup> 1/(n(n + ' + k + '))</b>.', H[0], H[1] * k,
              'Partial fractions: 1/(n(n+' + k + ')) = (1/' + k + ')(1/n − 1/(n+' + k + ')). It telescopes to (1/' + k + ')(1 + … + 1/' + k + ') = <b>' + fr(H[0], H[1] * k) + '</b>.');
          },
          function () {
            var m = rnd(2, 6);
            return numFr('Evaluate <b>Σ<sub>n=1</sub><sup>∞</sup> n/' + m + 'ⁿ</b>.', m, (m - 1) * (m - 1),
              'Σ n xⁿ = x/(1 − x)² with x = 1/' + m + ': (1/' + m + ')/((' + (m - 1) + '/' + m + ')²) = <b>' + fr(m, (m - 1) * (m - 1)) + '</b>.');
          },
          function () {
            var k = rnd(2, 9), p = rnd(1, 3);
            return num('Find the <b>radius of convergence</b> of <b>Σ<sub>n≥1</sub> n' + sup(p) + ' xⁿ / ' + k + 'ⁿ</b>.', k,
              'Ratio test: |cₙ/cₙ₊₁| = ' + k + ' · (n/(n+1))' + sup(p) + ' → ' + k + '. R = <b>' + k + '</b>. (Polynomial factors never change R.)');
          },
          function () {
            var a = nz(-5, 5);
            return num('Evaluate <b>lim<sub>x→' + n(a) + '</sub> (x³ ' + (a < 0 ? '+ ' + (-a * a * a) : '− ' + (a * a * a)) + ')/(x ' + (a < 0 ? '+ ' + (-a) : '− ' + a) + ')</b>.', 3 * a * a,
              '0/0 form. L\'Hôpital: lim 3x²/1 = 3(' + n(a) + ')² = <b>' + (3 * a * a) + '</b>.');
          },
          function () {
            var k = nz(-9, 9);
            return numFr('Evaluate <b>lim<sub>n→∞</sub> (√(n² ' + (k < 0 ? '− ' + (-k) : '+ ' + k) + 'n) − n)</b>.', k, 2,
              'Multiply by the conjugate: ' + n(k) + 'n/(√(n² ' + (k < 0 ? '− ' + (-k) : '+ ' + k) + 'n) + n) → ' + n(k) + '/2 = <b>' + fr(k, 2) + '</b>.');
          },
          function () {
            var a = nz(-3, 3);
            var P = poly([a, 0]), Q = a < 0 ? '(' + P + ')' : P;
            return numFr('Evaluate <b>lim<sub>x→0</sub> (sin(' + P + ') − ' + Q + ')/x³</b>.', -a * a * a, 6,
              'sin u = u − u³/6 + …, so sin(' + P + ') − ' + Q + ' ≈ −(' + n(a) + ')³x³/6. Limit = <b>' + fr(-a * a * a, 6) + '</b>.');
          }
        ]
      },
      {
        id: 'diffeqwick', name: 'Diffeqwick', topic: 'Differential Equations', host: 'rowena', x: 660, y: 280, banner: '#1f5a5a',
        lesson: [
          { who: 'rowena', text: 'In <b>Diffeqwick</b> the alchemists brew equations whose unknowns are whole <b>functions</b>.' },
          { who: 'rowena', text: '<b>Separable</b>: dy/dx = f(x)g(y) → ∫ dy/g(y) = ∫ f(x) dx.', ex: 'dy/dx = ky → ln|y| = kx + C → y = Aeᵏˣ' },
          { who: 'edmund', text: '<b>First-order linear</b>: dy/dx + P(x)y = Q(x). Multiply by the integrating factor e^(∫P dx); the left side becomes (IF · y)′.', ex: 'dy/dx + y/x = 3 → IF = x → (xy)′ = 3x' },
          { who: 'rowena', text: '<b>Second-order, constant coefficients</b>: ay″ + by′ + cy = 0. Solve am² + bm + c = 0.', ex: 'Distinct real roots → Ae^(m₁x) + Be^(m₂x)<br>Complex α ± βi → e^(αx)(A cos βx + B sin βx)' },
          { who: 'eleanor', text: 'For ay″ + by′ + cy = f(x), add a <b>particular integral</b> to the complementary function. If f is a constant K (and c ≠ 0), try y = K/c.' },
          { who: 'rowena', text: '<b>Initial conditions</b> such as y(0) and y′(0) fix the arbitrary constants.' }
        ],
        practice: [
          function () {
            var o = pick([['y″ + 3y′ − y = x', 2], ['dy/dx = xy²', 1], ['y‴ − y = 0', 3], ['(y′)² + y = 1', 1], ['y⁗ = sin x', 4]]);
            return mcNum('What is the <b>order</b> of the differential equation <b>' + o[0] + '</b>?', o[1], [1, 2, 3, 4], 'The order is the highest derivative present: <b>' + o[1] + '</b>.');
          },
          function () {
            var r1 = nz(-5, 5), r2; do { r2 = nz(-5, 5); } while (r2 === r1);
            var lo = Math.min(r1, r2), hi = Math.max(r1, r2);
            return mcStr('Find the roots of the auxiliary equation for <b>' + ode(-(r1 + r2), r1 * r2) + ' = 0</b>.',
              'm = ' + n(lo) + ', ' + n(hi), ['m = ' + n(-hi) + ', ' + n(-lo), 'm = ' + n(lo) + ', ' + n(-hi), 'm = ' + n(r1 + r2) + ', ' + n(r1 * r2)],
              poly([1, -(r1 + r2), r1 * r2], 'm') + ' = (m − ' + n(r1) + ')(m − ' + n(r2) + ') → <b>m = ' + n(lo) + ', ' + n(hi) + '</b>.');
          },
          function () {
            var k = nz(-5, 5), e = 'e<sup>' + poly([k, 0]) + '</sup>';
            return mcStr('What is the general solution of <b>dy/dx = ' + poly([k, 0], 'y') + '</b>?', 'y = A' + e, ['y = ' + poly([k, 0]) + ' + C', 'y = A' + 'e<sup>x</sup> + ' + n(k), 'y = Ax' + sup(Math.abs(k))],
              'Separate: dy/y = ' + n(k) + ' dx → ln|y| = ' + poly([k, 0]) + ' + C → <b>y = A' + e + '</b>.');
          },
          function () {
            var a = rnd(2, 5);
            return mcStr('What is the integrating factor for <b>dy/dx + (' + a + '/x) y = x</b>, x > 0?', 'x' + sup(a), ['e' + sup(a), 'e<sup>' + a + 'x</sup>', a + 'x', 'ln x'],
              'e^(∫' + a + '/x dx) = e^(' + a + ' ln x) = <b>x' + sup(a) + '</b>.');
          },
          function () {
            var w = rnd(2, 6);
            return mcStr('What is the general solution of <b>y″ + ' + (w * w) + 'y = 0</b>?', 'A cos ' + w + 'x + B sin ' + w + 'x', ['Ae<sup>' + w + 'x</sup> + Be<sup>−' + w + 'x</sup>', 'A cos ' + (w * w) + 'x + B sin ' + (w * w) + 'x', '(A + Bx)e<sup>' + w + 'x</sup>'],
              'm² + ' + (w * w) + ' = 0 → m = ±' + w + 'i → <b>A cos ' + w + 'x + B sin ' + w + 'x</b>.');
          }
        ],
        exam: [
          function () {
            var k = nz(-3, 4), A = nz(-6, 8);
            return numFr('Solve <b>dy/dx = ' + poly([k, 0], 'y') + '</b> with <b>y(0) = ' + n(A) + '</b>. Find <b>y(ln 2)</b>.', A * Math.pow(2, k + 3), 8,
              'y = ' + n(A) + 'e<sup>' + n(k) + 'x</sup>. y(ln 2) = ' + n(A) + ' × 2<sup>' + n(k) + '</sup> = <b>' + fr(A * Math.pow(2, k + 3), 8) + '</b>.');
          },
          function () {
            var w = rnd(2, 6), v = nz(-12, 12);
            return numFr('Solve <b>y″ + ' + (w * w) + 'y = 0</b> with <b>y(0) = 0</b>, <b>y′(0) = ' + n(v) + '</b>. Find <b>y(π/' + (2 * w) + ')</b>.', v, w,
              'y = A cos ' + w + 'x + B sin ' + w + 'x. y(0) = 0 → A = 0. y′(0) = ' + w + 'B = ' + n(v) + ' → B = ' + fr(v, w) + '. At x = π/' + (2 * w) + ', sin(π/2) = 1, so y = <b>' + fr(v, w) + '</b>.');
          },
          function () {
            var a = rnd(3, 9), x0 = rnd(1, a - 1);
            return numFr('Solve <b>dy/dx = y²</b> with <b>y(0) = 1/' + a + '</b>. Find <b>y(' + x0 + ')</b>.', 1, a - x0,
              'Separate: −1/y = x + C. y(0) = 1/' + a + ' → C = −' + a + '. So y = 1/(' + a + ' − x), and y(' + x0 + ') = <b>' + fr(1, a - x0) + '</b>.');
          },
          function () {
            var b = rnd(-6, 6), c = nz(-8, 8), K = c * nz(-5, 5) * pick([1, 1, 3]);
            return numFr('Find the constant particular integral of <b>' + ode(b, c) + ' = ' + n(K) + '</b>.', K, c,
              'Try y = k: y′ = y″ = 0, so ' + n(c) + 'k = ' + n(K) + ' → k = <b>' + fr(K, c) + '</b>.');
          },
          function () {
            var pr = pick([[1, 2], [1, 3], [2, 3], [-1, 1], [-1, 2]]), r1 = pr[0], r2 = pr[1], A = nz(-4, 4), B = nz(-4, 4);
            var p = A + B, q = r1 * A + r2 * B, v = A * Math.pow(2, r1) + B * Math.pow(2, r2);
            var top = r1 < 0 ? A + 2 * B * Math.pow(2, r2) : v * 1, bot = r1 < 0 ? 2 : 1;
            return numFr('Solve <b>' + ode(-(r1 + r2), r1 * r2) + ' = 0</b> with <b>y(0) = ' + n(p) + '</b>, <b>y′(0) = ' + n(q) + '</b>. Find <b>y(ln 2)</b>.', top, bot,
              'Roots ' + n(r1) + ', ' + n(r2) + ': y = Ae<sup>' + poly([r1, 0]) + '</sup> + Be<sup>' + poly([r2, 0]) + '</sup>. A + B = ' + n(p) + ' and ' + poly([r1, r2], 'A').replace(/A$/, 'B').replace(/A /, 'A ') + ' = ' + n(q) + ' → A = ' + n(A) + ', B = ' + n(B) + '. y(ln 2) = (' + n(A) + ')·2<sup>' + n(r1) + '</sup> + (' + n(B) + ')·2<sup>' + n(r2) + '</sup> = <b>' + fr(top, bot) + '</b>.');
          },
          function () {
            var c = nz(-6, 6), y1 = nz(-6, 6), C = 2 * y1 - c, top = 4 * c + C; /* xy = c x²/2 + C/2 */
            return numFr('Solve <b>dy/dx + y/x = ' + n(c) + '</b> (x > 0) with <b>y(1) = ' + n(y1) + '</b>. Find <b>y(2)</b>.', top, 4,
              'IF = x: (xy)′ = ' + poly([c, 0]) + ' → xy = (' + fr(c, 2) + ')x² + D. y(1) = ' + n(y1) + ' → D = ' + fr(C, 2) + '. y(2) = (' + (2 * c) + ' + ' + fr(C, 2) + ')/2 = <b>' + fr(top, 4) + '</b>.');
          },
          function () {
            var A = nz(-6, 6), k = rnd(2, 9);
            return num('Solve <b>dy/dx = 2xy</b> with <b>y(0) = ' + n(A) + '</b>. Find <b>y(√(ln ' + k + '))</b>.', A * k,
              'Separate: ln|y| = x² + C → y = ' + n(A) + 'e<sup>x²</sup>. At x² = ln ' + k + ': y = ' + n(A) + ' × ' + k + ' = <b>' + n(A * k) + '</b>.');
          }
        ]
      },
      {
        id: 'primewater', name: 'Primewater', topic: 'Number Theory', host: 'tobias', x: 870, y: 470, banner: '#7a2e1a',
        lesson: [
          { who: 'tobias', text: 'The merchants of <b>Primewater</b> trade in primes — the atoms of the integers.' },
          { who: 'edmund', text: 'Every integer > 1 factorises uniquely into primes. Read gcd and lcm off the factorisations.', ex: '84 = 2²·3·7, 90 = 2·3²·5 → gcd 6, lcm 1260' },
          { who: 'tobias', text: '<b>Euclid\'s algorithm</b>: gcd(a, b) = gcd(b, a mod b). Working backwards gives Bézout: ax + by = gcd(a, b).' },
          { who: 'rowena', text: '<b>Modular arithmetic</b>: a ≡ b (mod n) if n | (a − b). a has an inverse mod n iff gcd(a, n) = 1.', ex: '3 · 5 = 15 ≡ 1 (mod 7), so 3⁻¹ ≡ 5 (mod 7)' },
          { who: 'edmund', text: '<b>Euler\'s φ(n)</b> counts 1 ≤ k ≤ n coprime to n: φ(n) = n Π(1 − 1/p). Euler: a^φ(n) ≡ 1 (mod n) when gcd(a, n) = 1. Fermat: aᵖ⁻¹ ≡ 1 (mod p).', ex: 'φ(12) = 12 · ½ · ⅔ = 4' },
          { who: 'tobias', text: 'If n = p₁^a₁ ⋯ pₖ^aₖ then the number of divisors is d(n) = (a₁ + 1)⋯(aₖ + 1), and the sum of divisors σ(n) = Π (pᵢ^(aᵢ+1) − 1)/(pᵢ − 1).' }
        ],
        practice: [
          function () {
            var g = rnd(2, 12), a, b; do { a = rnd(2, 15); b = rnd(2, 15); } while (U.gcd(a, b) !== 1 || a === b);
            return mcNum('Find <b>gcd(' + (g * a) + ', ' + (g * b) + ')</b>.', g, [g * a * b, g * 2, U.gcd(a, b) + g - 1 || 1, g * Math.min(a, b)],
              (g * a) + ' = ' + g + '×' + a + ' and ' + (g * b) + ' = ' + g + '×' + b + ' with ' + a + ', ' + b + ' coprime: <b>' + g + '</b>.');
          },
          function () {
            var a = rnd(4, 24), b = rnd(4, 24);
            return mcNum('Find <b>lcm(' + a + ', ' + b + ')</b>.', U.lcm(a, b), [a * b === U.lcm(a, b) ? a * b * 2 : a * b, U.gcd(a, b), a + b],
              'lcm = ab/gcd = ' + (a * b) + '/' + U.gcd(a, b) + ' = <b>' + U.lcm(a, b) + '</b>.');
          },
          function () {
            var m = rnd(5, 13), a = rnd(30, 400) * pick([1, -1]), r = ((a % m) + m) % m;
            return mcNum('Find <b>' + n(a) + ' mod ' + m + '</b> (as a value from 0 to ' + (m - 1) + ').', r, [Math.abs(a) % m, m - r, r + 1],
              n(a) + ' = ' + m + ' × ' + n(Math.floor(a / m)) + ' + ' + r + ', so the residue is <b>' + r + '</b>.');
          },
          function () {
            var p = pick([101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157]);
            return mcNum('Which of these is <b>prime</b>?', p, shuffle([91, 119, 133, 143, 161, 187, 209, 221]).slice(0, 3),
              '<b>' + p + '</b> has no prime factor ≤ √' + p + '. (91 = 7·13, 119 = 7·17, 133 = 7·19, 143 = 11·13, 161 = 7·23, 187 = 11·17, 209 = 11·19, 221 = 13·17.)');
          },
          function () {
            var p = pick([2, 3, 5, 7]), a = rnd(2, 8);
            return mcNum('How many positive divisors does <b>' + p + sup(a) + '</b> have?', a + 1, [a, p * a, Math.pow(2, a)],
              'They are 1, ' + p + ', ' + p + '², …, ' + p + sup(a) + ': <b>' + (a + 1) + '</b> divisors.');
          }
        ],
        exam: [
          function () {
            var N = rnd(30, 300), f = U.primeFactors(N).filter(function (v, i, a) { return a.indexOf(v) === i; });
            return num('Compute <b>φ(' + N + ')</b>, Euler\'s totient.', U.phi(N),
              N + ' has prime factors ' + f.join(', ') + '. φ = ' + N + f.map(function (p) { return ' × (1 − 1/' + p + ')'; }).join('') + ' = <b>' + U.phi(N) + '</b>.');
          },
          function () {
            var m = pick([7, 11, 13, 17]), a = rnd(2, 9), e = rnd(100, 999);
            if (a % m === 0) a++;
            return num('Find <b>' + a + sup(e) + ' mod ' + m + '</b>.', U.modpow(a, e, m),
              'By Fermat, ' + a + sup(m - 1) + ' ≡ 1 (mod ' + m + '). ' + e + ' mod ' + (m - 1) + ' = ' + (e % (m - 1)) + ', so ' + a + sup(e) + ' ≡ ' + a + sup(e % (m - 1)) + ' ≡ <b>' + U.modpow(a, e, m) + '</b>.');
          },
          function () {
            var m = pick([11, 13, 17, 19, 23, 29, 31]), a = rnd(2, m - 1), inv = 1;
            while ((a * inv) % m !== 1) inv++;
            return num('Find the inverse of <b>' + a + ' modulo ' + m + '</b> (as a value from 1 to ' + (m - 1) + ').', inv,
              a + ' × ' + inv + ' = ' + (a * inv) + ' = ' + m + '×' + Math.floor(a * inv / m) + ' + 1 ≡ 1. Inverse: <b>' + inv + '</b>.');
          },
          function () {
            var N = pick([2, 4, 8, 16]) * pick([3, 9, 27]) * pick([1, 5, 25]) * pick([1, 7]), d = U.divisors(N).length;
            var f = U.primeFactors(N), cnt = {}; f.forEach(function (p) { cnt[p] = (cnt[p] || 0) + 1; });
            return num('How many positive divisors does <b>' + N + '</b> have?', d,
              N + ' = ' + Object.keys(cnt).map(function (p) { return p + (cnt[p] > 1 ? sup(cnt[p]) : ''); }).join('·') + '. d = ' + Object.keys(cnt).map(function (p) { return '(' + cnt[p] + ' + 1)'; }).join('') + ' = <b>' + d + '</b>.');
          },
          function () {
            var a = rnd(2, 9), e = rnd(100, 9999), d = U.modpow(a, e, 10);
            return num('What is the <b>last digit</b> of <b>' + a + sup(e) + '</b>?', d,
              'Last digits of powers of ' + a + ' repeat with period dividing 4. ' + e + ' mod 4 = ' + (e % 4) + ' → last digit <b>' + d + '</b>.');
          },
          function () {
            var N = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 72, 84, 90, 96, 100]), s = U.divisors(N).reduce(function (a, b) { return a + b; }, 0);
            return num('Compute <b>σ(' + N + ')</b>, the sum of all positive divisors of ' + N + '.', s,
              'Divisors: ' + U.divisors(N).join(', ') + '. Sum = <b>' + s + '</b>.');
          },
          function () {
            var m = pick([11, 13, 17, 19, 23]), a = rnd(2, m - 1), x = rnd(1, m - 1), b = (a * x) % m;
            return num('Find the smallest positive x with <b>' + a + 'x ≡ ' + b + ' (mod ' + m + ')</b>.', x,
              'Multiply both sides by the inverse of ' + a + ' mod ' + m + '. Check: ' + a + ' × ' + x + ' = ' + (a * x) + ' ≡ ' + b + '. x = <b>' + x + '</b>.');
          },
          function () {
            var g = rnd(7, 60), a, b; do { a = rnd(20, 90); b = rnd(20, 90); } while (U.gcd(a, b) !== 1);
            return num('Use Euclid\'s algorithm to find <b>gcd(' + (g * a) + ', ' + (g * b) + ')</b>.', g,
              'Repeated division with remainder ends at <b>' + g + '</b> (since ' + (g * a) + ' = ' + g + '×' + a + ', ' + (g * b) + ' = ' + g + '×' + b + ', and gcd(' + a + ', ' + b + ') = 1).');
          }
        ]
      }
    ]
  });
})();

(function () {
  var rnd = U.rnd, pick = U.pick, shuffle = U.shuffle, mcNum = U.mcNum, mcStr = U.mcStr, num = U.num, numFr = U.numFr, fr = U.fr, n = U.n, poly = U.poly, sup = U.sup;

  function nz(a, b) { var x; do { x = rnd(a, b); } while (x === 0); return x; }
  function term(a, p) { return poly([a].concat(new Array(p).fill(0))); }

  MQ.addLevel({
    id: 'alevel', name: 'A Level', full: 'A Level', ages: 'Ages 16–18', region: 'The Highlands of Calculus',
    cities: [
      {
        id: 'derivale', name: 'Derivale', topic: 'Differentiation', host: 'rowena', x: 160, y: 430, banner: '#1f5a5a',
        lesson: [
          { who: 'rowena', text: 'In the alchemist\'s tower of <b>Derivale</b> we study change. The derivative dy/dx is the gradient of a curve at a point.' },
          { who: 'edmund', text: '<b>Power rule</b>: d/dx (axⁿ) = naxⁿ⁻¹. Differentiate term by term.', ex: 'y = 4x³ − 5x + 2 → dy/dx = 12x² − 5' },
          { who: 'rowena', text: '<b>Stationary points</b>: solve dy/dx = 0. Classify with d²y/dx²: positive → minimum, negative → maximum.', ex: 'y = x³ − 12x → 3x² − 12 = 0 → x = ±2. y″ = 6x: x = −2 is a maximum' },
          { who: 'edmund', text: '<b>Chain rule</b>: d/dx f(g(x)) = f′(g(x)) · g′(x).', ex: 'd/dx (3x + 1)⁴ = 4(3x + 1)³ · 3' },
          { who: 'rowena', text: '<b>Product rule</b>: (uv)′ = u′v + uv′. <b>Quotient rule</b>: (u/v)′ = (u′v − uv′)/v².', ex: 'd/dx (x eˣ) = eˣ + x eˣ' },
          { who: 'aldric', text: 'Know these by heart: d/dx eᵏˣ = keᵏˣ, d/dx ln x = 1/x, d/dx sin x = cos x, d/dx cos x = −sin x.' },
          { who: 'edmund', text: '<b>Tangent</b> at x = a: y − f(a) = f′(a)(x − a). The <b>normal</b> has gradient −1/f′(a). For implicit curves, differentiate both sides with respect to x.', ex: 'x² + y² = 25 → 2x + 2y·dy/dx = 0 → dy/dx = −x/y' }
        ],
        practice: [
          function () {
            var a = nz(-6, 6), p = rnd(2, 4), k = nz(-3, 3), v = a * p * Math.pow(k, p - 1);
            return mcNum('If <b>y = ' + term(a, p) + '</b>, find dy/dx when <b>x = ' + n(k) + '</b>.', v, [a * Math.pow(k, p), a * p * Math.pow(k, p), a * (p - 1) * Math.pow(k, p - 1)],
              'dy/dx = ' + term(a * p, p - 1) + '. At x = ' + n(k) + ': <b>' + n(v) + '</b>.');
          },
          function () {
            var a = nz(-9, 9), p = rnd(2, 7);
            return mcStr('Differentiate <b>' + term(a, p) + '</b>.', term(a * p, p - 1), [term(a, p - 1), term(a * p, p + 1), term(a * (p - 1), p - 1), term(a * p, p)],
              'Multiply by the power, then reduce the power by one: <b>' + term(a * p, p - 1) + '</b>.');
          },
          function () {
            var a = rnd(1, 4), x0 = nz(-6, 6), b = -2 * a * x0, c = rnd(-10, 10);
            return mcNum('Find the x-coordinate of the stationary point of <b>y = ' + poly([a, b, c]) + '</b>.', x0, [-x0, b, x0 * 2],
              'dy/dx = ' + poly([2 * a, b]) + ' = 0 → x = <b>' + n(x0) + '</b>.');
          },
          function () {
            var k = nz(-6, 6);
            return mcNum('Find the gradient of <b>y = e<sup>' + (k === 1 ? '' : k === -1 ? '−' : n(k)) + 'x</sup></b> at x = 0.', k, [1, -k, k * k, 0],
              'dy/dx = ' + n(k) + 'e<sup>' + n(k) + 'x</sup>; at x = 0, e⁰ = 1, so the gradient is <b>' + n(k) + '</b>.');
          },
          function () {
            var f = pick([['sin x', 'cos x', ['−cos x', '−sin x', 'sin x']], ['cos x', '−sin x', ['sin x', 'cos x', '−cos x']], ['ln x', '1/x', ['x ln x − x', 'eˣ', 'ln(1/x)']], ['eˣ', 'eˣ', ['xeˣ⁻¹', 'ln x', 'eˣ⁻¹']]]);
            return mcStr('What is d/dx of <b>' + f[0] + '</b>?', f[1], f[2], 'd/dx ' + f[0] + ' = <b>' + f[1] + '</b>.');
          }
        ],
        exam: [
          function () {
            var a = nz(-3, 3), b = nz(-4, 4), p = rnd(3, 5), x0 = rnd(-2, 2), inner = a * x0 + b, v = p * a * Math.pow(inner, p - 1);
            return num('Find dy/dx at <b>x = ' + n(x0) + '</b> for <b>y = (' + poly([a, b]) + ')' + sup(p) + '</b>.', v,
              'Chain rule: dy/dx = ' + p + '(' + poly([a, b]) + ')' + sup(p - 1) + ' × ' + n(a) + '. At x = ' + n(x0) + ': ' + p + ' × (' + n(inner) + ')' + sup(p - 1) + ' × ' + n(a) + ' = <b>' + n(v) + '</b>.');
          },
          function () {
            var a = nz(-6, 6), b = nz(-5, 5);
            return num('Find the gradient of <b>y = (' + poly([1, a]) + ')e<sup>' + (b === 1 ? '' : b === -1 ? '−' : n(b)) + 'x</sup></b> at <b>x = 0</b>.', 1 + a * b,
              'Product rule: dy/dx = e<sup>' + n(b) + 'x</sup> + ' + n(b) + '(' + poly([1, a]) + ')e<sup>' + n(b) + 'x</sup>. At x = 0: 1 + ' + n(b) + ' × ' + n(a) + ' = <b>' + n(1 + a * b) + '</b>.');
          },
          function () {
            var a = rnd(1, 9);
            return numFr('Find the gradient of <b>y = x / (x + ' + a + ')</b> at <b>x = 1</b>.', a, (1 + a) * (1 + a),
              'Quotient rule: dy/dx = [(x + ' + a + ') − x]/(x + ' + a + ')² = ' + a + '/(x + ' + a + ')². At x = 1: <b>' + fr(a, (1 + a) * (1 + a)) + '</b>.');
          },
          function () {
            var k = rnd(1, 4), c = rnd(-20, 20);
            return num('Find the <b>local maximum value</b> of <b>y = ' + poly([1, 0, -3 * k * k, c]) + '</b>.', 2 * k * k * k + c,
              'dy/dx = 3x² − ' + (3 * k * k) + ' = 0 → x = ±' + k + '. y″ = 6x &lt; 0 at x = −' + k + ' (maximum). y(−' + k + ') = ' + n(-k * k * k) + ' + ' + (3 * k * k * k) + sgnText(c) + ' = <b>' + n(2 * k * k * k + c) + '</b>.');
          },
          function () {
            var a = nz(-5, 5), b = rnd(-6, 6), c = rnd(-10, 10);
            return num('The tangent to <b>y = ' + poly([1, b, c]) + '</b> at <b>x = ' + n(a) + '</b> crosses the y-axis at (0, k). Find <b>k</b>.', c - a * a,
              'f(' + n(a) + ') = ' + n(a * a + a * b + c) + ', f′(' + n(a) + ') = ' + n(2 * a + b) + '. At x = 0 the tangent gives y = f(a) − a·f′(a) = ' + n(a * a + a * b + c) + ' − (' + n(a) + ')(' + n(2 * a + b) + ') = <b>' + n(c - a * a) + '</b>.');
          },
          function () {
            var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]]), sx = pick([1, -1]), sy = pick([1, -1]), x = sx * t[0], y = sy * t[1];
            return numFr('Find dy/dx for the circle <b>x² + y² = ' + (t[2] * t[2]) + '</b> at the point <b>(' + n(x) + ', ' + n(y) + ')</b>.', -x, y,
              'Implicitly: 2x + 2y·dy/dx = 0 → dy/dx = −x/y = <b>' + fr(-x, y) + '</b>.');
          },
          function () {
            var a = nz(-3, 3);
            return numFr('Find the gradient of the <b>normal</b> to <b>y = x³</b> at <b>x = ' + n(a) + '</b>.', -1, 3 * a * a,
              'dy/dx = 3x² = ' + (3 * a * a) + '. Normal gradient = −1/' + (3 * a * a) + ' = <b>' + fr(-1, 3 * a * a) + '</b>.');
          },
          function () {
            var a = nz(-3, 3), b = nz(-4, 4), k = nz(-2, 2), v = 12 * a * k * k + 6 * b * k;
            return num('Find <b>d²y/dx²</b> at <b>x = ' + n(k) + '</b> for <b>y = ' + poly([a, b, 0, 0, 0]) + '</b>.', v,
              'dy/dx = ' + poly([4 * a, 3 * b, 0, 0]) + ', d²y/dx² = ' + poly([12 * a, 6 * b, 0]) + '. At x = ' + n(k) + ': <b>' + n(v) + '</b>.');
          }
        ]
      },
      {
        id: 'integrum', name: 'Integrum', topic: 'Integration', host: 'anselm', x: 400, y: 260, banner: '#6b4a2e',
        lesson: [
          { who: 'anselm', text: 'Peace, scholar. In <b>Integrum</b> we reverse differentiation, and in doing so we measure the area beneath curves.' },
          { who: 'edmund', text: '∫xⁿ dx = xⁿ⁺¹/(n + 1) + C for n ≠ −1, and ∫1/x dx = ln|x| + C. Never forget the + C!', ex: '∫6x² dx = 2x³ + C' },
          { who: 'anselm', text: '<b>Definite integrals</b>: evaluate at the upper limit, subtract the value at the lower limit.', ex: '∫₁³ 2x dx = [x²]₁³ = 9 − 1 = <b>8</b>' },
          { who: 'rowena', text: '<b>Area between curves</b>: integrate (top − bottom) between the points where they meet.', ex: 'y = 2x and y = x² meet at x = 0, 2 → ∫₀² (2x − x²) dx = 4/3' },
          { who: 'edmund', text: '<b>Substitution</b> undoes the chain rule. <b>By parts</b> undoes the product rule: ∫u dv = uv − ∫v du.', ex: '∫x eˣ dx = x eˣ − eˣ + C' },
          { who: 'anselm', text: 'Also: ∫eᵏˣ dx = (1/k)eᵏˣ, ∫sin x dx = −cos x, ∫cos x dx = sin x. <b>Volume of revolution</b> about the x-axis: V = π∫y² dx.' }
        ],
        practice: [
          function () {
            var a = 2 * rnd(1, 6), k = rnd(1, 6);
            return mcNum('Evaluate <b>∫₀<sup>' + k + '</sup> ' + a + 'x dx</b>.', a * k * k / 2, [a * k * k, a * k, a], '[' + (a / 2 === 1 ? '' : a / 2) + 'x²]₀<sup>' + k + '</sup> = <b>' + (a * k * k / 2) + '</b>.');
          },
          function () {
            var p = rnd(1, 5), a = (p + 1) * nz(-4, 4);
            return mcStr('Find <b>∫' + term(a, p) + ' dx</b>.', term(a / (p + 1), p + 1) + ' + C', [term(a * p, p - 1) + ' + C', term(a, p + 1) + ' + C', term(a * (p + 1), p + 1) + ' + C', term(a / (p + 1), p) + ' + C'],
              'Raise the power by one and divide by the new power: <b>' + term(a / (p + 1), p + 1) + ' + C</b>.');
          },
          function () {
            var p = rnd(1, 9);
            return mcStr('Evaluate <b>∫₀¹ x' + sup(p) + ' dx</b>.', fr(1, p + 1), [fr(1, p), String(p), fr(p, p + 1), fr(1, p + 2)], '[x' + sup(p + 1) + '/' + (p + 1) + ']₀¹ = <b>' + fr(1, p + 1) + '</b>.');
          },
          function () {
            var k = rnd(2, 9);
            return mcStr('Evaluate <b>∫₁<sup>' + k + '</sup> (1/x) dx</b>.', 'ln ' + k, ['1/' + k, 'ln ' + (k - 1), String(k - 1), fr(-1, k * k) + ' + 1'], '[ln x]₁<sup>' + k + '</sup> = ln ' + k + ' − ln 1 = <b>ln ' + k + '</b>.');
          },
          function () {
            var k = rnd(1, 5);
            return mcNum('Evaluate <b>∫₀<sup>' + k + '</sup> 3x² dx</b>.', k * k * k, [3 * k * k * k, 6 * k, k * k], '[x³]₀<sup>' + k + '</sup> = <b>' + (k * k * k) + '</b>.');
          }
        ],
        exam: [
          function () {
            var a = rnd(-2, 1), b = a + rnd(1, 3), F = function (x) { return x * x * x + x * x; };
            return num('Evaluate <b>∫<sub>' + n(a) + '</sub><sup>' + b + '</sup> (3x² + 2x) dx</b>.', F(b) - F(a),
              '[x³ + x²] from ' + n(a) + ' to ' + b + ' = ' + n(F(b)) + ' − (' + n(F(a)) + ') = <b>' + n(F(b) - F(a)) + '</b>.');
          },
          function () {
            var k = rnd(1, 6);
            return numFr('Find the area enclosed between <b>y = x²</b> and <b>y = ' + k + 'x</b>.', k * k * k, 6,
              'They meet at x = 0 and x = ' + k + '. ∫₀<sup>' + k + '</sup> (' + k + 'x − x²) dx = ' + k + '³/2 − ' + k + '³/3 = ' + k + '³/6 = <b>' + fr(k * k * k, 6) + '</b>.');
          },
          function () {
            var k = rnd(1, 4);
            return numFr('Evaluate <b>∫₀<sup>ln 2</sup> e<sup>' + (k === 1 ? '' : k) + 'x</sup> dx</b>.', Math.pow(2, k) - 1, k,
              '[(1/' + k + ')e<sup>' + k + 'x</sup>]₀<sup>ln 2</sup> = (2' + sup(k) + ' − 1)/' + k + ' = <b>' + fr(Math.pow(2, k) - 1, k) + '</b>.');
          },
          function () {
            var p = rnd(1, 4);
            return numFr('Evaluate <b>∫₀¹ 2x(x² + 1)' + sup(p) + ' dx</b>.', Math.pow(2, p + 1) - 1, p + 1,
              'Let u = x² + 1, du = 2x dx, u from 1 to 2: ∫₁² u' + sup(p) + ' du = (2' + sup(p + 1) + ' − 1)/' + (p + 1) + ' = <b>' + fr(Math.pow(2, p + 1) - 1, p + 1) + '</b>.');
          },
          function () {
            var a = nz(-6, 6), b = nz(-6, 6);
            return num('Evaluate <b>∫₀<sup>π/2</sup> (' + n(a) + ' sin x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' cos x) dx</b>.', a + b,
              'An antiderivative is ' + n(-a) + ' cos x + (' + n(b) + ') sin x. At π/2 it is ' + n(b) + '; at 0 it is ' + n(-a) + '. Difference: <b>' + n(a + b) + '</b>.');
          },
          function () {
            var k = rnd(1, 3), h = rnd(1, 4);
            return numFr('The line <b>y = ' + (k === 1 ? '' : k) + 'x</b> from x = 0 to x = ' + h + ' is rotated 360° about the x-axis. The volume is Vπ. Find <b>V</b>.', k * k * h * h * h, 3,
              'V = π∫₀<sup>' + h + '</sup> ' + (k * k) + 'x² dx = π·' + (k * k) + '·' + h + '³/3, so V = <b>' + fr(k * k * h * h * h, 3) + '</b>.');
          },
          function () {
            var a = rnd(1, 6);
            return num('Evaluate <b>∫₀<sup>π</sup> ' + (a === 1 ? '' : a) + 'x sin x dx</b>, giving your answer as a multiple of π (enter the multiple).', a,
              'By parts with u = x: [−x cos x]₀<sup>π</sup> + ∫₀<sup>π</sup> cos x dx = π + 0. Times ' + a + ' gives ' + a + 'π, so enter <b>' + a + '</b>.');
          },
          function () {
            var a = rnd(1, 9);
            return num('Evaluate <b>∫₁<sup>4</sup> ' + a + '/√x dx</b>.', 2 * a,
              '∫' + a + 'x<sup>−½</sup> dx = ' + (2 * a) + '√x. [' + (2 * a) + '√x]₁⁴ = ' + (4 * a) + ' − ' + (2 * a) + ' = <b>' + (2 * a) + '</b>.');
          }
        ]
      },
      {
        id: 'sequenceport', name: 'Sequenceport', topic: 'Sequences & Series', host: 'tobias', x: 640, y: 450, banner: '#7a2e1a',
        lesson: [
          { who: 'tobias', text: 'Ships leave <b>Sequenceport</b> as regularly as a sequence. An <b>arithmetic</b> sequence adds a common difference d.' },
          { who: 'edmund', text: 'Arithmetic: uₙ = a + (n − 1)d and Sₙ = n/2 [2a + (n − 1)d].', ex: '3, 7, 11, …: u₁₀ = 39, S₁₀ = 5 × (6 + 36) = 210' },
          { who: 'edmund', text: 'A <b>geometric</b> sequence multiplies by a common ratio r: uₙ = arⁿ⁻¹ and Sₙ = a(rⁿ − 1)/(r − 1).', ex: '2, 6, 18, …: u₅ = 2 × 3⁴ = 162' },
          { who: 'rowena', text: 'If |r| &lt; 1 the geometric series converges: S∞ = a/(1 − r).', ex: '8 + 4 + 2 + … = 8/(1 − ½) = <b>16</b>' },
          { who: 'tobias', text: '<b>Binomial expansion</b>: (a + b)ⁿ = Σ ⁿCₖ aⁿ⁻ᵏ bᵏ.', ex: 'Coefficient of x² in (1 + 2x)⁵ = ⁵C₂ · 2² = 10 × 4 = <b>40</b>' },
          { who: 'edmund', text: '<b>Recurrence relations</b> define each term from the one before. Useful sums: Σr = n(n+1)/2, Σr² = n(n+1)(2n+1)/6.', ex: 'uₙ₊₁ = 2uₙ − 1, u₁ = 3 → 3, 5, 9, 17, …' }
        ],
        practice: [
          function () {
            var a = rnd(-10, 20), d = nz(-6, 9), k = rnd(10, 40);
            return mcNum('An arithmetic sequence has first term <b>' + n(a) + '</b> and common difference <b>' + n(d) + '</b>. Find the <b>' + k + 'th</b> term.', a + (k - 1) * d, [a + k * d, a * k + d, a + (k - 2) * d],
              'u' + '<sub>' + k + '</sub> = ' + n(a) + ' + ' + (k - 1) + ' × ' + n(d) + ' = <b>' + n(a + (k - 1) * d) + '</b>.');
          },
          function () {
            var a = rnd(1, 5), r = pick([2, 3, -2]), k = rnd(4, 6);
            return mcNum('A geometric sequence has first term <b>' + a + '</b> and common ratio <b>' + n(r) + '</b>. Find the <b>' + k + 'th</b> term.', a * Math.pow(r, k - 1), [a * Math.pow(r, k), Math.pow(a * r, k - 1), a + (k - 1) * r],
              a + ' × (' + n(r) + ')' + sup(k - 1) + ' = <b>' + n(a * Math.pow(r, k - 1)) + '</b>.');
          },
          function () {
            var a = rnd(1, 12), q = rnd(2, 5), p = rnd(1, q - 1);
            return mcStr('Find the sum to infinity of the geometric series with <b>a = ' + a + '</b> and <b>r = ' + fr(p, q) + '</b>.', fr(a * q, q - p), [fr(a * p, q), fr(a * q, q + p), fr(a, q - p)],
              'S∞ = ' + a + ' ÷ (1 − ' + fr(p, q) + ') = ' + a + ' ÷ ' + fr(q - p, q) + ' = <b>' + fr(a * q, q - p) + '</b>.');
          },
          function () {
            var a = rnd(1, 10), d = rnd(1, 6), k = rnd(10, 30), S = k * (2 * a + (k - 1) * d) / 2;
            return mcNum('Find the sum of the first <b>' + k + '</b> terms of the arithmetic series <b>' + a + ' + ' + (a + d) + ' + ' + (a + 2 * d) + ' + …</b>', S, [k * (a + (k - 1) * d), S + k * d, S - a],
              'Sₙ = ' + k + '/2 × (2×' + a + ' + ' + (k - 1) + '×' + d + ') = <b>' + S + '</b>.');
          },
          function () {
            var m = rnd(4, 12);
            return mcNum('Find the coefficient of <b>x²</b> in the expansion of <b>(1 + x)' + sup(m) + '</b>.', U.choose(m, 2), [m, m * m, 2 * m],
              sup(m) + 'C₂ = ' + m + ' × ' + (m - 1) + ' ÷ 2 = <b>' + U.choose(m, 2) + '</b>.');
          }
        ],
        exam: [
          function () {
            var a = rnd(-10, 15), d = nz(-4, 7), p = rnd(2, 5), q = p + rnd(3, 7), N = rnd(15, 30), S = N * (2 * a + (N - 1) * d) / 2;
            return num('In an arithmetic sequence, <b>u' + '<sub>' + p + '</sub> = ' + n(a + (p - 1) * d) + '</b> and <b>u<sub>' + q + '</sub> = ' + n(a + (q - 1) * d) + '</b>. Find <b>S<sub>' + N + '</sub></b>, the sum of the first ' + N + ' terms.', S,
              'd = (' + n(a + (q - 1) * d) + ' − (' + n(a + (p - 1) * d) + '))/' + (q - p) + ' = ' + n(d) + ', a = ' + n(a) + '. S<sub>' + N + '</sub> = ' + N + '/2 × (2×(' + n(a) + ') + ' + (N - 1) + '×(' + n(d) + ')) = <b>' + n(S) + '</b>.');
          },
          function () {
            var q = rnd(3, 7), p = rnd(1, q - 1), A = q * rnd(1, 4), S = A * q / (q - p);
            if (S !== Math.round(S)) { p = q - 1; S = A * q; }
            return numFr('A geometric series has first term <b>' + A + '</b> and sum to infinity <b>' + S + '</b>. Find the common ratio r.', S - A, S,
              S + ' = ' + A + '/(1 − r) → 1 − r = ' + fr(A, S) + ' → r = <b>' + fr(S - A, S) + '</b>.');
          },
          function () {
            var m = rnd(5, 9), k = rnd(2, 4), c = pick([2, 3, -2]), v = U.choose(m, k) * Math.pow(c, k);
            return num('Find the coefficient of <b>x' + sup(k) + '</b> in the expansion of <b>(1 ' + (c < 0 ? '− ' + (-c) : '+ ' + c) + 'x)' + sup(m) + '</b>.', v,
              sup(m) + 'C' + '<sub>' + k + '</sub> × (' + n(c) + ')' + sup(k) + ' = ' + U.choose(m, k) + ' × ' + n(Math.pow(c, k)) + ' = <b>' + n(v) + '</b>.');
          },
          function () {
            var N = rnd(10, 25), v = N * (N + 1) * (2 * N + 1) / 6;
            return num('Evaluate <b>Σ<sub>r=1</sub><sup>' + N + '</sup> r²</b>.', v, 'n(n + 1)(2n + 1)/6 with n = ' + N + ': ' + N + '×' + (N + 1) + '×' + (2 * N + 1) + '/6 = <b>' + v + '</b>.');
          },
          function () {
            var N = rnd(15, 40), a = nz(-5, 6), b = rnd(-9, 9), v = a * N * (N + 1) / 2 + b * N;
            return num('Evaluate <b>Σ<sub>r=1</sub><sup>' + N + '</sup> (' + poly([a, b], 'r') + ')</b>.', v,
              n(a) + ' × ' + N + '×' + (N + 1) + '/2 + (' + n(b) + ') × ' + N + ' = <b>' + n(v) + '</b>.');
          },
          function () {
            var p = pick([2, 3, -1, -2]), q = rnd(-5, 5), u = rnd(1, 5), seq = [u];
            for (var i = 0; i < 4; i++) seq.push(p * seq[i] + q);
            return num('A sequence is defined by <b>u<sub>n+1</sub> = ' + poly([p, q], 'u<sub>n</sub>') + '</b> with <b>u₁ = ' + u + '</b>. Find <b>u₅</b>.', seq[4],
              'u₁ to u₅: ' + seq.map(n).join(', ') + '. So u₅ = <b>' + n(seq[4]) + '</b>.');
          },
          function () {
            var a = rnd(1, 6), r = pick([2, 3, -2]), u3 = a * r * r, u6 = a * Math.pow(r, 5);
            return num('A geometric sequence has third term <b>' + n(u3) + '</b> and sixth term <b>' + n(u6) + '</b>. Find the <b>first term</b>.', a,
              'r³ = ' + n(u6) + ' ÷ ' + n(u3) + ' = ' + n(r * r * r) + ', so r = ' + n(r) + '. a = ' + n(u3) + ' ÷ ' + n(r) + '² = <b>' + a + '</b>.');
          },
          function () {
            var a = rnd(1, 5), N = rnd(500, 50000), k = 1;
            while (a * (Math.pow(2, k) - 1) <= N) k++;
            return num('The geometric series <b>' + a + ' + ' + (2 * a) + ' + ' + (4 * a) + ' + …</b> is summed. What is the <b>smallest</b> number of terms for the sum to exceed <b>' + N + '</b>?', k,
              'Sₙ = ' + a + '(2ⁿ − 1) > ' + N + ' → 2ⁿ > ' + fr(N + a, a) + '. n = ' + (k - 1) + ' gives ' + (a * (Math.pow(2, k - 1) - 1)) + '; n = ' + k + ' gives ' + (a * (Math.pow(2, k) - 1)) + '. Answer <b>' + k + '</b>.');
          }
        ]
      },
      {
        id: 'exponhold', name: 'Exponhold', topic: 'Exponentials & Logarithms', host: 'eleanor', x: 860, y: 260, banner: '#4b1f6b',
        lesson: [
          { who: 'eleanor', text: 'The treasury of <b>Exponhold</b> grows exponentially. <b>Logarithms</b> answer the question: "what power?"' },
          { who: 'edmund', text: 'log<sub>b</sub> x = y means bʸ = x.', ex: 'log₂ 32 = 5 because 2⁵ = 32' },
          { who: 'rowena', text: '<b>Laws</b>: log(ab) = log a + log b, log(a/b) = log a − log b, log(aⁿ) = n log a.', ex: 'log₂ 12 + log₂ 6 − log₂ 9 = log₂ (72/9) = log₂ 8 = <b>3</b>' },
          { who: 'eleanor', text: 'To solve aˣ = b, write both sides with the same base, or take logs of both sides.', ex: '4ˣ = 8ˣ⁻¹ → 2²ˣ = 2³ˣ⁻³ → 2x = 3x − 3 → x = <b>3</b>' },
          { who: 'edmund', text: 'Spot <b>hidden quadratics</b>: let u = eˣ. Always check that log arguments stay positive!', ex: 'e²ˣ − 5eˣ + 6 = 0 → (u − 2)(u − 3) = 0 → x = ln 2 or ln 3' },
          { who: 'eleanor', text: '<b>Exponential decay</b>: N = N₀e⁻ᵏᵗ. The half-life is the time for N to halve.', ex: '800 → 400 → 200 → 100 after three half-lives' }
        ],
        practice: [
          function () {
            var b = pick([2, 3, 5, 10]), k = rnd(1, 5), x = Math.pow(b, k);
            return mcNum('Evaluate <b>log<sub>' + b + '</sub> ' + x + '</b>.', k, [x / b, k + 1, b * k], b + sup(k) + ' = ' + x + ', so the answer is <b>' + k + '</b>.');
          },
          function () {
            var a = rnd(2, 9), b = rnd(2, 9);
            return mcNum('Simplify <b>2' + sup(a) + ' × 2' + sup(b) + '</b> = 2<sup>?</sup>', a + b, [a * b, Math.abs(a - b), a + b + 1], 'Add the powers: ' + a + ' + ' + b + ' = <b>' + (a + b) + '</b>.');
          },
          function () {
            var b = pick([2, 3, 5]), k = rnd(2, 5);
            return mcNum('Solve <b>' + b + 'ˣ = ' + Math.pow(b, k) + '</b>.', k, [Math.pow(b, k) / b, k + 1, k - 1], b + sup(k) + ' = ' + Math.pow(b, k) + ', so x = <b>' + k + '</b>.');
          },
          function () {
            var k = nz(-6, 9);
            return mcNum('Evaluate <b>ln(e<sup>' + n(k) + '</sup>)</b>.', k, [1, -k, k + 1, 0], 'ln and e cancel: <b>' + n(k) + '</b>.');
          },
          function () {
            var x = rnd(2, 9), y = rnd(2, 9);
            return mcStr('Write <b>log ' + x + ' + log ' + y + '</b> as a single logarithm.', 'log ' + (x * y), ['log ' + (x + y), 'log ' + fr(x, y), '(log ' + x + ')(log ' + y + ')'],
              'log a + log b = log(ab) = <b>log ' + (x * y) + '</b>.');
          }
        ],
        exam: [
          function () {
            var p = pick([3, 5, 7]), q = pick([3, 5, 7]), i = rnd(0, 3), j = rnd(1, 4), a = p * Math.pow(2, i), b = q * Math.pow(2, j), c = p * q;
            return num('Evaluate <b>log₂ ' + a + ' + log₂ ' + b + ' − log₂ ' + c + '</b>.', i + j,
              'Combine: log₂ (' + a + ' × ' + b + ' ÷ ' + c + ') = log₂ ' + Math.pow(2, i + j) + ' = <b>' + (i + j) + '</b>.');
          },
          function () {
            var p, q; do { p = rnd(1, 4); q = rnd(1, 5); } while (p === q);
            var k = rnd(1, 4), bp = Math.pow(2, p), bq = Math.pow(2, q);
            return numFr('Solve <b>' + bp + 'ˣ = ' + bq + '<sup>x − ' + k + '</sup></b>. Give an exact answer.', q * k, q - p,
              'Write as powers of 2: ' + p + 'x = ' + q + '(x − ' + k + ') → ' + (q - p) + 'x = ' + (q * k) + ' → x = <b>' + fr(q * k, q - p) + '</b>.');
          },
          function () {
            var u1 = rnd(1, 6), u2; do { u2 = rnd(1, 8); } while (u2 === u1);
            return num('The equation <b>e²ˣ − ' + (u1 + u2) + 'eˣ + ' + (u1 * u2) + ' = 0</b> has solutions x₁ and x₂. Find the exact value of <b>e<sup>x₁ + x₂</sup></b>.', u1 * u2,
              'Let u = eˣ: u² − ' + (u1 + u2) + 'u + ' + (u1 * u2) + ' = 0 → u = ' + u1 + ' or ' + u2 + '. e<sup>x₁+x₂</sup> = e<sup>x₁</sup>·e<sup>x₂</sup> = ' + u1 + ' × ' + u2 + ' = <b>' + (u1 * u2) + '</b>.');
          },
          function () {
            var M = rnd(3, 30), k = rnd(3, 6), T = pick([5, 8, 12, 20]), N0 = M * Math.pow(2, k);
            return num('A batch of ' + N0 + ' g of an alchemical salt has a half-life of <b>' + T + ' days</b>. How many grams remain after <b>' + (k * T) + ' days</b>?', M,
              (k * T) + ' ÷ ' + T + ' = ' + k + ' half-lives. ' + N0 + ' ÷ 2' + sup(k) + ' = <b>' + M + ' g</b>.');
          },
          function () {
            var d = rnd(1, 6), x = d + rnd(1, 6), M = x * (x - d), b = pick([2, 3, 5, 10]);
            return num('Solve <b>log<sub>' + b + '</sub> x + log<sub>' + b + '</sub> (x − ' + d + ') = log<sub>' + b + '</sub> ' + M + '</b>.', x,
              'x(x − ' + d + ') = ' + M + ' → x² − ' + d + 'x − ' + M + ' = 0 → (x − ' + x + ')(x + ' + (x - d) + ') = 0. Reject x = ' + n(-(x - d)) + ' (log of a negative), so x = <b>' + x + '</b>.');
          },
          function () {
            var q = pick([[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [12, 24, 8], [6, 30, 5], [20, 30, 12], [5, 20, 4]]), K = q[0] + q[1];
            return num('Find the <b>larger</b> solution of <b>2 log₃ x − log₃ (x − ' + q[2] + ') = log₃ ' + K + '</b>.', q[1],
              'x²/(x − ' + q[2] + ') = ' + K + ' → x² − ' + K + 'x + ' + (K * q[2]) + ' = 0 → x = ' + q[0] + ' or ' + q[1] + ' (both valid). Larger: <b>' + q[1] + '</b>.');
          },
          function () {
            var b = rnd(2, 6), k = rnd(2, 4), N = Math.pow(b, k);
            return num('Solve <b>log<sub>x</sub> ' + N + ' = ' + k + '</b>.', b, 'x' + sup(k) + ' = ' + N + ', so x = <b>' + b + '</b>.');
          }
        ]
      }
    ]
  });

  function sgnText(c) { return c === 0 ? '' : (c < 0 ? ' − ' + (-c) : ' + ' + c); }
})();

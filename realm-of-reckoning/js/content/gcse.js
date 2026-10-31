(function () {
  var rnd = U.rnd, pick = U.pick, shuffle = U.shuffle, mcNum = U.mcNum, mcStr = U.mcStr, num = U.num, numFr = U.numFr, fr = U.fr, n = U.n, poly = U.poly, sgn = U.sgn;

  function nz(a, b) { var x; do { x = rnd(a, b); } while (x === 0); return x; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];

  MQ.addLevel({
    id: 'gcse', name: 'GCSE', full: 'GCSE', ages: 'Ages 14–16', region: 'The March of Scholars',
    cities: [
      {
        id: 'algebrook', name: 'Algebrook', topic: 'Algebra & Equations', host: 'edmund', x: 170, y: 250, banner: '#1c2a5a',
        lesson: [
          { who: 'edmund', text: 'Welcome to <b>Algebrook</b>, scholar. Algebra lets us reason about numbers we do not yet know.' },
          { who: 'edmund', text: 'Solve linear equations by doing the same to both sides. Gather the unknown on one side.', ex: '5x + 3 = 2x + 18 → 3x = 15 → x = <b>5</b>' },
          { who: 'rowena', text: '<b>Expanding</b> double brackets: multiply every term by every term.', ex: '(x + 3)(x − 5) = x² − 5x + 3x − 15 = <b>x² − 2x − 15</b>' },
          { who: 'rowena', text: '<b>Factorising</b> reverses expanding. For x² + bx + c, find two numbers that multiply to c and add to b.', ex: 'x² + x − 12 = (x + 4)(x − 3) = 0 → x = −4 or x = 3' },
          { who: 'edmund', text: '<b>Simultaneous equations</b>: eliminate one unknown by adding or subtracting (scaled) equations.', ex: 'x + y = 10, x − y = 4 → 2x = 14 → x = 7, y = 3' },
          { who: 'isolde', text: '<b>Inequalities</b> behave like equations — except multiplying or dividing by a negative flips the sign.', ex: '−2x &lt; 6 → x > −3' },
          { who: 'edmund', text: 'Look for shortcuts! The difference of two squares: x² − y² = (x + y)(x − y).' }
        ],
        practice: [
          function () {
            var a = rnd(2, 9), x = nz(-9, 12), b = rnd(-15, 15);
            return mcNum('Solve <b>' + poly([a, b]) + ' = ' + n(a * x + b) + '</b>', x, [x + 1, -x, (a * x + b + b) / a | 0, x * a],
              'Subtract ' + n(b) + ', then divide by ' + a + ': x = <b>' + n(x) + '</b>.');
          },
          function () {
            var a = nz(-7, 7), b = nz(-7, 7);
            return mcStr('Expand <b>(' + poly([1, a]) + ')(' + poly([1, b]) + ')</b>', poly([1, a + b, a * b]),
              [poly([1, a * b, a + b]), poly([1, a + b, -a * b]), poly([1, -(a + b), a * b]), poly([1, a * b])],
              'x·x + x·' + n(b) + ' + ' + n(a) + '·x + ' + n(a) + '·' + n(b) + ' = <b>' + poly([1, a + b, a * b]) + '</b>.');
          },
          function () {
            var r = nz(-8, 8), s; do { s = nz(-8, 8); } while (s === r || s === -r);
            var lo = Math.min(r, s), hi = Math.max(r, s), ans = 'x = ' + n(lo) + ' or x = ' + n(hi);
            return mcStr('Solve <b>' + poly([1, -(r + s), r * s]) + ' = 0</b>', ans,
              ['x = ' + n(-hi) + ' or x = ' + n(-lo), 'x = ' + n(lo) + ' or x = ' + n(-hi), 'x = ' + n(-lo) + ' or x = ' + n(hi)],
              poly([1, -(r + s), r * s]) + ' = (' + poly([1, -r]) + ')(' + poly([1, -s]) + '), so <b>' + ans + '</b>.');
          },
          function () {
            var a = nz(-5, 5), b = nz(-6, 6);
            return mcNum('If <b>a = ' + n(a) + '</b> and <b>b = ' + n(b) + '</b>, find <b>3a² − 2b</b>.', 3 * a * a - 2 * b, [9 * a * a - 2 * b, 3 * a * a + 2 * b, -3 * a * a - 2 * b, 6 * a - 2 * b],
              '3 × (' + n(a) + ')² − 2 × ' + n(b) + ' = ' + (3 * a * a) + ' − ' + n(2 * b) + ' = <b>' + n(3 * a * a - 2 * b) + '</b>. Square before multiplying!');
          },
          function () {
            var a = rnd(2, 9), b = rnd(1, 9), c = rnd(1, a - 1), d = rnd(1, 9);
            var ans = poly([a - c, 0]) + ' + ' + poly([b + d, 0]).replace('x', 'y');
            return mcStr('Simplify <b>' + a + 'x + ' + b + 'y − ' + c + 'x + ' + d + 'y</b>', ans,
              [poly([a + c, 0]) + ' + ' + poly([b + d, 0]).replace('x', 'y'), poly([a - c, 0]) + ' + ' + poly([b + d + 1, 0]).replace('x', 'y'), (a - c + b + d) + 'xy'],
              'Collect like terms: (' + a + ' − ' + c + ')x + (' + b + ' + ' + d + ')y = <b>' + ans + '</b>.');
          }
        ],
        exam: [
          function () {
            var x = nz(-9, 9), a = rnd(3, 9), c; do { c = rnd(1, 8); } while (c === a);
            var b = rnd(-20, 20), d = (a - c) * x + b;
            return num('Solve <b>' + poly([a, b]) + ' = ' + poly([c, d]) + '</b>', x,
              'Subtract ' + c + 'x: ' + poly([a - c, b]) + ' = ' + n(d) + '. So ' + (a - c) + 'x = ' + n(d - b) + ' and x = <b>' + n(x) + '</b>.');
          },
          function () {
            var a = rnd(1, 9), b, c = rnd(1, 9), d; do { b = rnd(2, 7); d = rnd(2, 7); } while (b === d);
            var top = -b * c - a * d, bot = d - b;
            return numFr('Solve <b>(x + ' + a + ')/' + b + ' = (x − ' + c + ')/' + d + '</b>. Give an exact answer.', top, bot,
              'Cross-multiply: ' + d + '(x + ' + a + ') = ' + b + '(x − ' + c + ') → ' + d + 'x + ' + (a * d) + ' = ' + b + 'x − ' + (b * c) + ' → ' + n(bot) + 'x = ' + n(top) + ' → x = <b>' + fr(top, bot) + '</b>.');
          },
          function () {
            var r = rnd(2, 12), s = rnd(2, 12); if (s === r) s++;
            var p = s - r, q = r * s;
            return num('Find the <b>positive</b> solution of <b>' + poly([1, p, -q]) + ' = 0</b>.', r,
              'Two numbers multiplying to ' + n(-q) + ' and adding to ' + n(p) + ' are ' + n(s) + ' and ' + n(-r) + ', so (' + poly([1, -r]) + ')(' + poly([1, s]) + ') = 0 → x = <b>' + r + '</b> (or ' + n(-s) + ').');
          },
          function () {
            var x = nz(-6, 8), y = nz(-6, 8), a, b, c, d;
            do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); } while (a * d - b * c === 0);
            var e = a * x + b * y, f = c * x + d * y;
            return num('Solve the simultaneous equations and give <b>x + y</b>:<br><b>' + poly([a, 0]) + (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y = ' + n(e) + '</b><br><b>' + poly([c, 0]) + (d < 0 ? ' − ' : ' + ') + (Math.abs(d) === 1 ? '' : Math.abs(d)) + 'y = ' + n(f) + '</b>', x + y,
              'Eliminate one variable to get x = ' + n(x) + ', y = ' + n(y) + '. So x + y = <b>' + n(x + y) + '</b>.');
          },
          function () {
            var S = rnd(8, 30), D = rnd(2, 12);
            return num('Given that <b>x + y = ' + S + '</b> and <b>x − y = ' + D + '</b>, find <b>x² − y²</b>.', S * D,
              'Difference of two squares: x² − y² = (x + y)(x − y) = ' + S + ' × ' + D + ' = <b>' + (S * D) + '</b>.');
          },
          function () {
            var m = rnd(2, 5), c = rnd(-5, 5), a = rnd(-15, 0), b = rnd(10, 30), cnt = 0, list = [];
            for (var x = -40; x <= 40; x++) if (a < m * x + c && m * x + c <= b) { cnt++; list.push(x); }
            return num('How many <b>integers</b> x satisfy <b>' + n(a) + ' &lt; ' + poly([m, c]) + ' ≤ ' + b + '</b>?', cnt,
              'Rearrange: ' + fr(a - c, m) + ' &lt; x ≤ ' + fr(b - c, m) + '. The integers are ' + list[0] + ' to ' + list[list.length - 1] + ': <b>' + cnt + '</b> of them.');
          },
          function () {
            var a = pick([2, 3]), p; do { p = nz(-9, 9); } while (p % a === 0);
            var q; do { q = nz(-6, 6); } while (q * a === p);
            var big = Math.max(p / a, q);
            return num('Find the <b>larger</b> solution of <b>' + poly([a, -(p + a * q), p * q]) + ' = 0</b>. Give an exact answer.', big,
              'Factorise: (' + poly([a, -p]) + ')(' + poly([1, -q]) + ') = 0 → x = ' + fr(p, a) + ' or x = ' + n(q) + '. Larger: <b>' + (big === q ? n(q) : fr(p, a)) + '</b>.',
              big === q ? n(q) : fr(p, a));
          }
        ]
      },
      {
        id: 'trigminster', name: 'Trigminster', topic: 'Pythagoras & Trigonometry', host: 'gareth', x: 420, y: 430, banner: '#1d3c78',
        lesson: [
          { who: 'gareth', text: 'The towers of <b>Trigminster</b> are tall and the ladders are long. Here we measure what we cannot reach.' },
          { who: 'edmund', text: '<b>Pythagoras</b>: in a right-angled triangle, a² + b² = c², where c is the hypotenuse (the longest side, opposite the right angle).', ex: '6² + 8² = 36 + 64 = 100 → c = <b>10</b>' },
          { who: 'edmund', text: '<b>SOH CAH TOA</b>: sin = opposite ÷ hypotenuse, cos = adjacent ÷ hypotenuse, tan = opposite ÷ adjacent.', ex: 'opposite 5, hypotenuse 10 → sin θ = 0.5 → θ = 30°' },
          { who: 'rowena', text: 'Learn the exact values by heart.', ex: 'sin 30° = cos 60° = ½<br>sin 60° = cos 30° = √3/2<br>sin 45° = cos 45° = √2/2 · tan 45° = 1' },
          { who: 'gareth', text: 'For any triangle: the <b>cosine rule</b> a² = b² + c² − 2bc·cos A, and <b>area</b> = ½ab·sin C.', ex: 'b = 5, c = 8, A = 60° → a² = 25 + 64 − 40 = 49 → a = <b>7</b>' },
          { who: 'edmund', text: 'In 3-D, use Pythagoras twice. A cuboid\'s space diagonal is √(a² + b² + c²).', ex: '2 × 3 × 6 cuboid → √(4 + 9 + 36) = √49 = <b>7</b>' }
        ],
        practice: [
          function () {
            var t = pick(TRIPLES), k = rnd(1, 3);
            return mcNum('A right-angled triangle has shorter sides <b>' + (t[0] * k) + '</b> and <b>' + (t[1] * k) + '</b>. How long is the hypotenuse?', t[2] * k, [(t[0] + t[1]) * k, t[2] * k + 1, t[1] * k + 1],
              '√(' + (t[0] * k) + '² + ' + (t[1] * k) + '²) = √' + (t[2] * t[2] * k * k) + ' = <b>' + (t[2] * k) + '</b>.');
          },
          function () {
            var t = pick(TRIPLES), k = rnd(1, 3);
            return mcNum('A right-angled triangle has hypotenuse <b>' + (t[2] * k) + '</b> and one side <b>' + (t[0] * k) + '</b>. How long is the other side?', t[1] * k, [(t[2] - t[0]) * k, t[1] * k + 2, t[2] * k + t[0] * k],
              '√(' + (t[2] * k) + '² − ' + (t[0] * k) + '²) = <b>' + (t[1] * k) + '</b>. Subtract when finding a shorter side.');
          },
          function () {
            var v = pick([['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 60°', '√3/2'], ['cos 30°', '√3/2'], ['tan 45°', '1'], ['sin 45°', '√2/2'], ['tan 60°', '√3'], ['tan 30°', '1/√3'], ['sin 90°', '1'], ['cos 90°', '0']]);
            return mcStr('What is the exact value of <b>' + v[0] + '</b>?', v[1], shuffle(['1/2', '√3/2', '√2/2', '1', '√3', '0', '1/√3']), v[0] + ' = <b>' + v[1] + '</b>.');
          },
          function () {
            var c = pick([['opposite and hypotenuse', 'sin'], ['adjacent and hypotenuse', 'cos'], ['opposite and adjacent', 'tan']]);
            return mcStr('You know an angle and want to link the <b>' + c[0] + '</b>. Which ratio do you use?', c[1], ['sin', 'cos', 'tan', 'Pythagoras'],
              'SOH CAH TOA → <b>' + c[1] + '</b>.');
          },
          function () {
            var t = pick(TRIPLES);
            return mcStr('In a right-angled triangle the side opposite θ is <b>' + t[0] + '</b>, the adjacent side is <b>' + t[1] + '</b>, and the hypotenuse is <b>' + t[2] + '</b>. What is <b>tan θ</b>?', fr(t[0], t[1]),
              [fr(t[0], t[2]), fr(t[1], t[2]), fr(t[1], t[0])], 'tan = opposite ÷ adjacent = <b>' + fr(t[0], t[1]) + '</b>.');
          }
        ],
        exam: [
          function () {
            var q = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [1, 12, 12, 17], [8, 9, 12, 17]]), k = rnd(1, 2);
            return num('A treasure chest is a cuboid measuring <b>' + (q[0] * k) + ' × ' + (q[1] * k) + ' × ' + (q[2] * k) + '</b> cm. What is the length of the longest straight rod that fits inside (corner to opposite corner)?', q[3] * k,
              '√(' + (q[0] * k) + '² + ' + (q[1] * k) + '² + ' + (q[2] * k) + '²) = √' + (q[3] * q[3] * k * k) + ' = <b>' + (q[3] * k) + '</b> cm.');
          },
          function () {
            var q = pick([[5, 8, 60, 7], [3, 8, 60, 7], [7, 15, 60, 13], [7, 8, 120, 13], [3, 5, 120, 7], [16, 6, 60, 14]]), k = rnd(1, 3);
            return num('In triangle ABC, <b>AB = ' + (q[0] * k) + '</b>, <b>AC = ' + (q[1] * k) + '</b> and angle <b>BAC = ' + q[2] + '°</b>. Find the exact length of <b>BC</b>.', q[3] * k,
              'Cosine rule: BC² = ' + (q[0] * k) + '² + ' + (q[1] * k) + '² − 2·' + (q[0] * k) + '·' + (q[1] * k) + '·cos ' + q[2] + '° = ' + (q[3] * q[3] * k * k) + '. BC = <b>' + (q[3] * k) + '</b>.');
          },
          function () {
            var a = rnd(4, 20), b = rnd(4, 20), C = pick([30, 150]);
            return numFr('A triangular banner has two sides <b>' + a + ' cm</b> and <b>' + b + ' cm</b> with an angle of <b>' + C + '°</b> between them. Find its exact area in cm².', a * b, 4,
              'Area = ½ab sin C = ½ × ' + a + ' × ' + b + ' × sin ' + C + '° = ½ × ' + (a * b) + ' × ½ = <b>' + fr(a * b, 4) + '</b> cm².');
          },
          function () {
            var A = rnd(1, 6) * pick([4, 8]), B = rnd(1, 6), Cc = rnd(-4, 4);
            return numFr('Find the exact value of <b>' + A + ' sin²60° + ' + B + ' cos²45° ' + (Cc < 0 ? '− ' + (-Cc) : '+ ' + Cc) + ' tan 45°</b>.', 3 * A + 2 * B + 4 * Cc, 4,
              'sin²60° = 3/4, cos²45° = 1/2, tan 45° = 1. So ' + A + '·¾ + ' + B + '·½ ' + (Cc < 0 ? '− ' + (-Cc) : '+ ' + Cc) + ' = <b>' + fr(3 * A + 2 * B + 4 * Cc, 4) + '</b>.');
          },
          function () {
            var q = pick([[25, 7, 15], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 15, 20], [25, 7, 20]]);
            var h1 = Math.round(Math.sqrt(q[0] * q[0] - q[1] * q[1])), h2 = Math.round(Math.sqrt(q[0] * q[0] - q[2] * q[2]));
            return num('A <b>' + q[0] + ' m</b> siege ladder leans against a castle wall with its foot <b>' + q[1] + ' m</b> from the wall. The foot slips until it is <b>' + q[2] + ' m</b> from the wall. How many metres does the top of the ladder slide down?', h1 - h2,
              'Height before: √(' + q[0] + '² − ' + q[1] + '²) = ' + h1 + '. After: √(' + q[0] + '² − ' + q[2] + '²) = ' + h2 + '. Slide = <b>' + (h1 - h2) + ' m</b>.');
          },
          function () {
            var q = pick([[13, 10, 12], [5, 6, 4], [5, 8, 3], [17, 16, 15], [17, 30, 8], [25, 14, 24], [10, 12, 8], [25, 48, 7]]);
            return num('An isosceles triangle has two equal sides of <b>' + q[0] + '</b> and a base of <b>' + q[1] + '</b>. What is its area?', q[1] * q[2] / 2,
              'The height splits the base in half: √(' + q[0] + '² − ' + (q[1] / 2) + '²) = ' + q[2] + '. Area = ½ × ' + q[1] + ' × ' + q[2] + ' = <b>' + (q[1] * q[2] / 2) + '</b>.');
          }
        ]
      },
      {
        id: 'probabilshire', name: 'Probabilshire', topic: 'Probability', host: 'tobias', x: 670, y: 250, banner: '#7a2e1a',
        lesson: [
          { who: 'tobias', text: 'Wager your wits, not your gold! In <b>Probabilshire</b> we measure how likely things are, from 0 (impossible) to 1 (certain).' },
          { who: 'tobias', text: 'P(event) = favourable outcomes ÷ total equally likely outcomes.', ex: 'Bag: 3 red, 5 blue → P(red) = <b>3/8</b>' },
          { who: 'isolde', text: 'P(not A) = 1 − P(A).', ex: 'P(rain) = 0.3 → P(no rain) = 0.7' },
          { who: 'rowena', text: 'Independent events: <b>multiply</b>. Without replacement, the second probability changes because one item is gone.', ex: 'Two reds from 3R, 5B without replacement: 3/8 × 2/7 = <b>3/28</b>' },
          { who: 'edmund', text: '"At least one" is usually easiest as 1 − P(none). Use a Venn diagram or a two-way table to organise information.', ex: 'P(at least one six in 2 rolls) = 1 − (5/6)² = <b>11/36</b>' },
          { who: 'tobias', text: 'Conditional probability: "given that" shrinks the set of outcomes you count from.', ex: 'Two dice, given the total is 10: (4,6), (5,5), (6,4) → P(a six) = 2/3' }
        ],
        practice: [
          function () {
            var r = rnd(1, 9), b = rnd(1, 9), g = rnd(1, 9), t = r + b + g, c = pick([['red', r], ['blue', b], ['green', g]]);
            return mcStr('A bag holds <b>' + r + ' red</b>, <b>' + b + ' blue</b> and <b>' + g + ' green</b> gems. One is picked at random. What is P(<b>' + c[0] + '</b>)?', fr(c[1], t),
              [fr(c[1], t - c[1]), fr(t - c[1], t), fr(c[1] + 1, t), c[1] + '/' + (t + 1)], c[1] + ' out of ' + t + ' gems: <b>' + fr(c[1], t) + '</b>.');
          },
          function () {
            var p = rnd(1, 99) / 100;
            return mcStr('The probability that a knight wins a joust is <b>' + p + '</b>. What is the probability he does <b>not</b> win?', String(+(1 - p).toFixed(2)),
              [String(+(p / 2).toFixed(3)), String(+(1 + p).toFixed(2)), String(+(0.5 - p / 2 + 0.05).toFixed(3)), String(+(1 - p + 0.1).toFixed(2))], '1 − ' + p + ' = <b>' + (+(1 - p).toFixed(2)) + '</b>.');
          },
          function () {
            var k = rnd(1, 5);
            return mcStr('A fair six-sided die is rolled. What is the probability of a number <b>greater than ' + k + '</b>?', fr(6 - k, 6), [fr(k, 6), fr(6 - k + 1, 6), fr(6 - k, 5)],
              'The numbers ' + (k + 1) + ' to 6: ' + (6 - k) + ' outcomes out of 6 → <b>' + fr(6 - k, 6) + '</b>.');
          },
          function () {
            var p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.15]), N = 20 * rnd(2, 15);
            return mcNum('The probability a spinner lands on gold is <b>' + p + '</b>. It is spun <b>' + N + '</b> times. How many golds would you expect?', Math.round(p * N), [Math.round(p * N) * 2, Math.round(p * N) + 5, N - Math.round(p * N)],
              p + ' × ' + N + ' = <b>' + Math.round(p * N) + '</b>.');
          },
          function () {
            var c = pick([['two heads in two flips', '1/4'], ['three heads in three flips', '1/8'], ['heads then tails (in that order)', '1/4'], ['exactly one head in two flips', '1/2']]);
            return mcStr('A fair coin is flipped. What is the probability of <b>' + c[0] + '</b>?', c[1], ['1/2', '1/4', '1/8', '3/4', '1/3'], 'List the equally likely outcomes and count: <b>' + c[1] + '</b>.');
          }
        ],
        exam: [
          function () {
            var r = rnd(3, 9), b = rnd(3, 9), t = r + b;
            return numFr('A bag has <b>' + r + ' red</b> and <b>' + b + ' blue</b> tokens. Two are taken <b>without replacement</b>. Find P(both red).', r * (r - 1), t * (t - 1),
              r + '/' + t + ' × ' + (r - 1) + '/' + (t - 1) + ' = ' + (r * (r - 1)) + '/' + (t * (t - 1)) + ' = <b>' + fr(r * (r - 1), t * (t - 1)) + '</b>.');
          },
          function () {
            var r = rnd(3, 9), b = rnd(3, 9), t = r + b;
            return numFr('A bag has <b>' + r + ' red</b> and <b>' + b + ' blue</b> tokens. Two are taken <b>without replacement</b>. Find P(one of each colour).', 2 * r * b, t * (t - 1),
              'RB or BR: 2 × (' + r + '/' + t + ' × ' + b + '/' + (t - 1) + ') = <b>' + fr(2 * r * b, t * (t - 1)) + '</b>. Don\'t forget both orders!');
          },
          function () {
            var s = rnd(3, 11), c = 6 - Math.abs(7 - s);
            return numFr('Two fair dice are rolled and their scores added. What is P(total = <b>' + s + '</b>)?', c, 36,
              'There are 36 equally likely pairs; ' + c + ' of them total ' + s + '. P = <b>' + fr(c, 36) + '</b>.');
          },
          function () {
            var k = rnd(2, 3), num6 = Math.pow(6, k) - Math.pow(5, k);
            return numFr('A fair die is rolled <b>' + k + '</b> times. What is the probability of getting <b>at least one six</b>?', num6, Math.pow(6, k),
              '1 − P(no sixes) = 1 − (5/6)' + U.sup(k) + ' = 1 − ' + Math.pow(5, k) + '/' + Math.pow(6, k) + ' = <b>' + fr(num6, Math.pow(6, k)) + '</b>.');
          },
          function () {
            var a, b; do { b = rnd(3, 9); a = rnd(1, b - 1); } while (U.gcd(a, b) !== 1);
            var m = rnd(2, 5);
            return num('A chest holds <b>' + (a * m) + ' rubies</b> and some emeralds. The probability of picking a ruby is <b>' + a + '/' + b + '</b>. How many <b>emeralds</b> are there?', (b - a) * m,
              a + '/' + b + ' = ' + (a * m) + '/' + (b * m) + ', so there are ' + (b * m) + ' gems in total and ' + (b * m) + ' − ' + (a * m) + ' = <b>' + ((b - a) * m) + '</b> emeralds.');
          },
          function () {
            var N = rnd(30, 60), A = rnd(10, 25), B = rnd(8, 20), C = rnd(2, Math.min(A, B) - 2), neither = N - A - B + C;
            if (neither < 1) { N = A + B; neither = C; }
            return numFr('Of <b>' + N + '</b> courtiers, <b>' + A + '</b> play the lute, <b>' + B + '</b> play the harp, and <b>' + C + '</b> play both. One courtier is chosen at random. Find P(plays <b>neither</b>).', neither, N,
              'Lute or harp: ' + A + ' + ' + B + ' − ' + C + ' = ' + (A + B - C) + '. Neither: ' + N + ' − ' + (A + B - C) + ' = ' + neither + '. P = <b>' + fr(neither, N) + '</b>.');
          },
          function () {
            var s = rnd(7, 11), tot = 0, six = 0;
            for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) if (i + j === s) { tot++; if (i === 6 || j === 6) six++; }
            return numFr('Two fair dice are rolled. <b>Given that</b> the total is <b>' + s + '</b>, what is the probability that at least one die shows a <b>6</b>?', six, tot,
              'Pairs totalling ' + s + ': ' + tot + '. Of these, ' + six + ' include a 6. P = <b>' + fr(six, tot) + '</b>.');
          }
        ]
      },
      {
        id: 'graphton', name: 'Graphton', topic: 'Coordinates & Graphs', host: 'eleanor', x: 860, y: 450, banner: '#4b1f6b',
        lesson: [
          { who: 'eleanor', text: 'From the tower of <b>Graphton</b> we map the kingdom on a grid. Every place has coordinates (x, y).' },
          { who: 'edmund', text: '<b>Gradient</b> = change in y ÷ change in x.', ex: '(1, 2) to (4, 11): gradient = 9 ÷ 3 = <b>3</b>' },
          { who: 'eleanor', text: 'A straight line is <b>y = mx + c</b>: m is the gradient, c is where it crosses the y-axis.', ex: 'y = 2x − 5: gradient 2, y-intercept −5' },
          { who: 'rowena', text: '<b>Parallel</b> lines have equal gradients. <b>Perpendicular</b> gradients multiply to −1.', ex: 'Gradient 2 is perpendicular to gradient −½' },
          { who: 'edmund', text: '<b>Midpoint</b> = average of the coordinates. <b>Distance</b> uses Pythagoras. Where two lines meet, solve them simultaneously.', ex: '(1, 2) and (7, 10): midpoint (4, 6), distance √(36 + 64) = 10' },
          { who: 'eleanor', text: '<b>Completing the square</b> finds a parabola\'s turning point: y = (x − a)² + b has its minimum at (a, b).', ex: 'x² − 6x + 11 = (x − 3)² + 2 → minimum value <b>2</b> at x = 3' }
        ],
        practice: [
          function () {
            var x1 = rnd(-5, 5), y1 = rnd(-5, 5), dx = nz(-5, 5), m = nz(-4, 4);
            return mcNum('What is the gradient of the line through <b>(' + n(x1) + ', ' + n(y1) + ')</b> and <b>(' + n(x1 + dx) + ', ' + n(y1 + m * dx) + ')</b>?', m, [-m, m * 2, m + 1, dx],
              '(' + n(y1 + m * dx) + ' − ' + n(y1) + ') ÷ (' + n(x1 + dx) + ' − ' + n(x1) + ') = ' + n(m * dx) + ' ÷ ' + n(dx) + ' = <b>' + n(m) + '</b>.');
          },
          function () {
            var m = nz(-6, 6), c = nz(-9, 9);
            return mcNum('Where does <b>y = ' + poly([m, c]) + '</b> cross the y-axis? (Give the y-value.)', c, [m, -c, c + m],
              'When x = 0, y = c = <b>' + n(c) + '</b>.');
          },
          function () {
            var x1 = rnd(-8, 8), x2 = x1 + 2 * nz(-6, 6), y1 = rnd(-8, 8), y2 = rnd(-8, 8);
            return mcNum('What is the <b>x-coordinate</b> of the midpoint of <b>(' + n(x1) + ', ' + n(y1) + ')</b> and <b>(' + n(x2) + ', ' + n(y2) + ')</b>?', (x1 + x2) / 2, [x2 - x1, (x2 - x1) / 2, x1 + x2],
              '(' + n(x1) + ' + ' + n(x2) + ') ÷ 2 = <b>' + n((x1 + x2) / 2) + '</b>.');
          },
          function () {
            var m = nz(-4, 4), c = nz(-6, 6), x = rnd(-4, 4), y = m * x + c;
            return mcStr('Which point lies on the line <b>y = ' + poly([m, c]) + '</b>?', '(' + n(x) + ', ' + n(y) + ')',
              ['(' + n(y) + ', ' + n(x) + ')', '(' + n(x) + ', ' + n(y + 1) + ')', '(' + n(x + 1) + ', ' + n(y - m - 1) + ')', '(' + n(-x) + ', ' + n(y + 2) + ')'],
              'Substitute x = ' + n(x) + ': y = ' + n(m) + ' × ' + n(x) + ' + ' + n(c) + ' = ' + n(y) + '. So <b>(' + n(x) + ', ' + n(y) + ')</b>.');
          },
          function () {
            var m = nz(-5, 5), c = nz(-6, 6), c2; do { c2 = nz(-9, 9); } while (c2 === c);
            return mcStr('Which line is <b>parallel</b> to <b>y = ' + poly([m, c]) + '</b>?', 'y = ' + poly([m, c2]),
              ['y = ' + poly([-m, c]), 'y = ' + poly([c, m]), 'y = ' + poly([m + 1, c2]), 'y = ' + poly([-m, c2])],
              'Parallel lines share the gradient ' + n(m) + ': <b>y = ' + poly([m, c2]) + '</b>.');
          }
        ],
        exam: [
          function () {
            var p = nz(-5, 5), q; do { q = rnd(1, 5); } while (U.gcd(p, q) !== 1);
            var x1 = rnd(-5, 5), y1 = rnd(-5, 5);
            return numFr('A line passes through <b>(' + n(x1) + ', ' + n(y1) + ')</b> and <b>(' + n(x1 + q) + ', ' + n(y1 + p) + ')</b>. Find the gradient of a line <b>perpendicular</b> to it.', -q, p,
              'Gradient = ' + fr(p, q) + '. Perpendicular gradient = −1 ÷ (' + fr(p, q) + ') = <b>' + fr(-q, p) + '</b>.');
          },
          function () {
            var m = nz(-5, 5), c = rnd(-12, 12), x1 = rnd(1, 6), x2 = x1 + rnd(1, 5);
            return num('A line passes through <b>(' + x1 + ', ' + n(m * x1 + c) + ')</b> and <b>(' + x2 + ', ' + n(m * x2 + c) + ')</b>. Where does it cross the <b>y-axis</b>? (Give the y-value.)', c,
              'Gradient = ' + n(m * (x2 - x1)) + ' ÷ ' + (x2 - x1) + ' = ' + n(m) + '. Then c = y − mx = ' + n(m * x1 + c) + ' − ' + n(m) + '×' + x1 + ' = <b>' + n(c) + '</b>.');
          },
          function () {
            var x0 = rnd(-6, 6), y0 = rnd(-6, 6), m1 = nz(-4, 4), m2; do { m2 = nz(-4, 4); } while (m2 === m1);
            var c1 = y0 - m1 * x0, c2 = y0 - m2 * x0;
            return num('The lines <b>y = ' + poly([m1, c1]) + '</b> and <b>y = ' + poly([m2, c2]) + '</b> meet at the point (x, y). Find <b>x + y</b>.', x0 + y0,
              'Set equal: ' + poly([m1, c1]) + ' = ' + poly([m2, c2]) + ' → x = ' + n(x0) + ', then y = ' + n(y0) + '. x + y = <b>' + n(x0 + y0) + '</b>.');
          },
          function () {
            var t = pick(TRIPLES), x1 = rnd(-6, 6), y1 = rnd(-6, 6), sx = pick([1, -1]), sy = pick([1, -1]);
            return num('Find the distance between <b>(' + n(x1) + ', ' + n(y1) + ')</b> and <b>(' + n(x1 + sx * t[0]) + ', ' + n(y1 + sy * t[1]) + ')</b>.', t[2],
              '√(' + t[0] + '² + ' + t[1] + '²) = √' + (t[2] * t[2]) + ' = <b>' + t[2] + '</b>.');
          },
          function () {
            var a = nz(-7, 7), c = rnd(-20, 20), b = -2 * a;
            return num('Find the <b>minimum value</b> of <b>y = ' + poly([1, b, c]) + '</b>.', c - a * a,
              'Complete the square: (' + poly([1, -a]) + ')² ' + (c - a * a < 0 ? '− ' + (a * a - c) : '+ ' + (c - a * a)) + '. Minimum = <b>' + n(c - a * a) + '</b> at x = ' + n(a) + '.');
          },
          function () {
            var a = rnd(2, 6), b; do { b = rnd(2, 6); } while (b === a);
            var k = U.lcm(a, b) * rnd(1, 3);
            return num('The line <b>' + a + 'x + ' + b + 'y = ' + k + '</b> and the two axes form a triangle. What is its area?', (k / a) * (k / b) / 2,
              'Crosses the x-axis at ' + (k / a) + ' and the y-axis at ' + (k / b) + '. Area = ½ × ' + (k / a) + ' × ' + (k / b) + ' = <b>' + ((k / a) * (k / b) / 2) + '</b>.');
          }
        ]
      }
    ]
  });
})();

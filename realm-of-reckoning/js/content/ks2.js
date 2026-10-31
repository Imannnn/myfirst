(function () {
  var rnd = U.rnd, pick = U.pick, shuffle = U.shuffle, mcNum = U.mcNum, mcStr = U.mcStr, num = U.num, numFr = U.numFr, fr = U.fr;

  MQ.addLevel({
    id: 'ks2', name: 'KS2', full: 'Key Stage 2', ages: 'Ages 7–11', region: 'The Duchy of Reckoning',
    cities: [
      {
        id: 'multiplicester', name: 'Multiplicester', topic: 'Multiplication & Division', host: 'eleanor', x: 160, y: 300, banner: '#4b1f6b',
        lesson: [
          { who: 'eleanor', text: 'Welcome to <b>Multiplicester</b>, where the royal granaries are counted in rows and columns. Multiplying is fast repeated adding.' },
          { who: 'eleanor', text: 'Know your times tables to 12 × 12 — they are the keys to the kingdom.', ex: '7 × 8 = 56 · 9 × 12 = 108 · 6 × 7 = 42' },
          { who: 'anselm', text: 'For big numbers, <b>partition</b>: split them into parts, multiply each, then add.', ex: '34 × 26 = 34 × 20 + 34 × 6 = 680 + 204 = <b>884</b>' },
          { who: 'gareth', text: '<b>Division</b> shares equally. Anything left over is the <b>remainder</b>. In real life, think whether to round up!', ex: '47 ÷ 5 = 9 remainder 2<br>47 knights, 5 per tent → you need <b>10</b> tents' },
          { who: 'eleanor', text: '<b>Order of operations</b> (BIDMAS): Brackets, Indices, Division & Multiplication, then Addition & Subtraction.', ex: '3 + 4 × 5 = 3 + 20 = <b>23</b> (not 35)' },
          { who: 'anselm', text: '<b>Factors</b> divide a number exactly. <b>Multiples</b> are in its times table. A <b>prime</b> has exactly two factors: 1 and itself.', ex: 'Factors of 12: 1, 2, 3, 4, 6, 12<br>Primes: 2, 3, 5, 7, 11, 13, 17, 19 …<br>360 = 2 × 2 × 2 × 3 × 3 × 5' }
        ],
        practice: [
          function () {
            var a = rnd(3, 12), b = rnd(3, 12);
            return mcNum('What is <b>' + a + ' × ' + b + '</b>?', a * b, [a * b + a, a * b - b, a + b], a + ' × ' + b + ' = <b>' + (a * b) + '</b>.');
          },
          function () {
            var a = rnd(3, 12), b = rnd(3, 12);
            return mcNum('What is <b>' + (a * b) + ' ÷ ' + a + '</b>?', b, [b + 1, b - 1, a], 'Because ' + a + ' × ' + b + ' = ' + (a * b) + ', the answer is <b>' + b + '</b>.');
          },
          function () {
            var a = rnd(13, 49), b = rnd(3, 9);
            return mcNum('What is <b>' + a + ' × ' + b + '</b>?', a * b, [a * b + 10, a * b - b, (a % 10) * b + Math.floor(a / 10) * 10],
              Math.floor(a / 10) * 10 + ' × ' + b + ' = ' + (Math.floor(a / 10) * 10 * b) + ' and ' + (a % 10) + ' × ' + b + ' = ' + ((a % 10) * b) + '. Total <b>' + (a * b) + '</b>.');
          },
          function () {
            var d = rnd(3, 9), q = rnd(4, 12), r = rnd(1, d - 1), N = d * q + r;
            return mcNum('What is the <b>remainder</b> when <b>' + N + '</b> is divided by <b>' + d + '</b>?', r, [q, r + 1, d - r],
              d + ' × ' + q + ' = ' + (d * q) + ', and ' + N + ' − ' + (d * q) + ' = <b>' + r + '</b>.');
          },
          function () {
            var a = rnd(2, 20), b = rnd(2, 9), c = rnd(2, 9);
            return mcNum('Using BIDMAS, what is <b>' + a + ' + ' + b + ' × ' + c + '</b>?', a + b * c, [(a + b) * c, a + b + c, a * b + c],
              'Multiply first: ' + b + ' × ' + c + ' = ' + (b * c) + ', then add ' + a + ': <b>' + (a + b * c) + '</b>.');
          },
          function () {
            var p = pick([29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
            var comps = shuffle([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93]).slice(0, 3);
            return mcNum('Which of these numbers is <b>prime</b>?', p, comps, '<b>' + p + '</b> has no factors other than 1 and itself. ' + comps.map(function (c) { var f = U.primeFactors(c); return c + ' = ' + f[0] + ' × ' + (c / f[0]); }).join(', ') + '.');
          }
        ],
        exam: [
          function () {
            var a = rnd(123, 789), b = rnd(23, 89);
            return num('Calculate <b>' + a + ' × ' + b + '</b>.', a * b,
              a + ' × ' + Math.floor(b / 10) * 10 + ' = ' + (a * Math.floor(b / 10) * 10) + ', ' + a + ' × ' + (b % 10) + ' = ' + (a * (b % 10)) + '. Total <b>' + (a * b) + '</b>.');
          },
          function () {
            var d = rnd(12, 29), q = rnd(101, 399);
            return num('Calculate <b>' + (d * q) + ' ÷ ' + d + '</b>.', q, 'Long division: ' + d + ' × ' + q + ' = ' + (d * q) + ', so the answer is <b>' + q + '</b>.');
          },
          function () {
            var s = shuffle([4, 6, 8, 9, 10, 12, 14, 15]).slice(0, 3), L = U.lcm(U.lcm(s[0], s[1]), s[2]);
            return num('What is the <b>smallest</b> number that is a multiple of <b>' + s.join('</b>, <b>') + '</b>?', L,
              'This is the lowest common multiple. Using prime factors (' + s.map(function (x) { return x + ' = ' + U.primeFactors(x).join('×'); }).join(', ') + '), take the highest power of each prime: <b>' + L + '</b>.');
          },
          function () {
            var a = rnd(3, 9), b = rnd(2, 9), c = rnd(2, 9), e = rnd(2, 6), k = rnd(2, 9), d = e * k, v = a * (b + c) - d / e;
            return num('Calculate <b>' + a + ' × (' + b + ' + ' + c + ') − ' + d + ' ÷ ' + e + '</b>.', v,
              'Brackets: ' + (b + c) + '. Then ' + a + ' × ' + (b + c) + ' = ' + (a * (b + c)) + ' and ' + d + ' ÷ ' + e + ' = ' + k + '. ' + (a * (b + c)) + ' − ' + k + ' = <b>' + v + '</b>.');
          },
          function () {
            var N = pick([36, 48, 60, 72, 84, 90, 96, 100, 120, 144]), dv = U.divisors(N);
            return num('How many <b>factors</b> does <b>' + N + '</b> have?', dv.length, 'The factors are ' + dv.join(', ') + ' — that is <b>' + dv.length + '</b> factors.');
          },
          function () {
            var N = pick([2, 3]) * pick([4, 6, 9, 10]) * pick([5, 7, 3, 2]) * pick([1, 2, 3]), f = U.primeFactors(N), s = f.reduce(function (a, b) { return a + b; }, 0);
            return num('Write <b>' + N + '</b> as a product of prime numbers. What is the <b>sum</b> of all the primes in the product (count repeats)?', s,
              N + ' = ' + f.join(' × ') + '. Sum = <b>' + s + '</b>.');
          },
          function () {
            var k = rnd(6, 12), N = k * rnd(12, 40) + rnd(1, k - 1), t = Math.ceil(N / k);
            return num('A castle has <b>' + N + '</b> soldiers. Each tent sleeps <b>' + k + '</b>. How many tents are needed so that every soldier has a bed?', t,
              N + ' ÷ ' + k + ' = ' + Math.floor(N / k) + ' remainder ' + (N % k) + '. The leftover soldiers need one more tent: <b>' + t + '</b>.');
          }
        ]
      },
      {
        id: 'fractonbury', name: 'Fractonbury', topic: 'Fractions, Decimals & Percentages', host: 'isolde', x: 420, y: 470, banner: '#8c1c24',
        lesson: [
          { who: 'isolde', text: 'In <b>Fractonbury</b> the royal pie is always being shared. A fraction is part of a whole: the <b>denominator</b> (bottom) says how many equal parts; the <b>numerator</b> (top) says how many we take.' },
          { who: 'isolde', text: 'To find a fraction of an amount: divide by the bottom, multiply by the top.', ex: '¾ of 20 = 20 ÷ 4 × 3 = <b>15</b>' },
          { who: 'anselm', text: '<b>Equivalent fractions</b>: multiply or divide top and bottom by the same number. Simplify by dividing by the highest common factor.', ex: '12/18 = 2/3 (divide both by 6)' },
          { who: 'tobias', text: 'To add or subtract fractions, first make the denominators the same.', ex: '1/3 + 1/4 = 4/12 + 3/12 = <b>7/12</b>' },
          { who: 'tobias', text: '<b>Percent</b> means "out of 100". 10% → divide by 10. 5% → half of 10%. To increase by 35%, multiply by 1.35.', ex: '35% of 240 = 72 + 12 = <b>84</b><br>After 20% off, £48 is 80% of the price → £48 ÷ 0.8 = <b>£60</b>' },
          { who: 'isolde', text: 'Decimals, fractions and percentages are three ways to say the same thing.', ex: '½ = 0.5 = 50% · ¼ = 0.25 = 25% · ⅕ = 0.2 = 20% · ⅛ = 0.125 = 12.5%' }
        ],
        practice: [
          function () {
            var b = pick([3, 4, 5, 6, 8, 10]), a = rnd(1, b - 1), k = rnd(2, 12), N = b * k;
            return mcNum('What is <b>' + a + '/' + b + ' of ' + N + '</b>?', a * k, [k, N - a * k, a * k + k], N + ' ÷ ' + b + ' = ' + k + ', then × ' + a + ' = <b>' + (a * k) + '</b>.');
          },
          function () {
            var a, b; do { b = rnd(3, 9); a = rnd(1, b - 1); } while (U.gcd(a, b) !== 1);
            var k = rnd(2, 6);
            return mcStr('Simplify <b>' + (a * k) + '/' + (b * k) + '</b> fully.', a + '/' + b, [(a * k / U.gcd(a * k, 2) === a * k ? a + 1 : a) + '/' + (b + 1), b + '/' + a, (a * k) + '/' + b, a + '/' + (b * k), (a + 1) + '/' + b],
              'Divide top and bottom by ' + k + ': <b>' + a + '/' + b + '</b>.');
          },
          function () {
            var p = pick([10, 20, 25, 50, 75, 5, 15]), N = 20 * rnd(2, 15), v = N * p / 100;
            return mcNum('What is <b>' + p + '% of ' + N + '</b>?', v, [v * 2, N - v, v + 10], p + '% of ' + N + ' = ' + N + ' × ' + p + ' ÷ 100 = <b>' + v + '</b>.');
          },
          function () {
            var f = pick([['1/2', '0.5'], ['1/4', '0.25'], ['3/4', '0.75'], ['1/5', '0.2'], ['2/5', '0.4'], ['3/5', '0.6'], ['1/10', '0.1'], ['3/10', '0.3'], ['1/8', '0.125'], ['7/10', '0.7']]);
            return mcStr('Write <b>' + f[0] + '</b> as a decimal.', f[1], ['0.' + f[0].replace('/', ''), f[0].split('/')[1] / 100, '1.' + f[0].split('/')[0], '0.15', '0.35'],
              f[0] + ' = ' + f[0].split('/')[0] + ' ÷ ' + f[0].split('/')[1] + ' = <b>' + f[1] + '</b>.');
          },
          function () {
            var d = pick([5, 7, 8, 9, 11, 12]), a = rnd(1, d - 2), b = rnd(1, d - 1 - a);
            return mcStr('What is <b>' + a + '/' + d + ' + ' + b + '/' + d + '</b>?', fr(a + b, d), [(a + b) + '/' + (2 * d), fr(a + b + 1, d), fr(a * b, d), fr(Math.abs(a - b) || 1, d)],
              'Same denominator, so add the tops: ' + (a + b) + '/' + d + (fr(a + b, d) !== (a + b) + '/' + d ? ' = ' + fr(a + b, d) : '') + '. Answer <b>' + fr(a + b, d) + '</b>.');
          }
        ],
        exam: [
          function () {
            var b = pick([3, 4, 5, 6, 8]), d; do { d = pick([3, 4, 5, 6, 8]); } while (d === b);
            var a = rnd(1, b - 1), c = rnd(1, d - 1), L = U.lcm(b, d), top = a * L / b + c * L / d;
            return numFr('Calculate <b>' + a + '/' + b + ' + ' + c + '/' + d + '</b>. Give your answer as a fraction.', top, L,
              'Common denominator ' + L + ': ' + (a * L / b) + '/' + L + ' + ' + (c * L / d) + '/' + L + ' = ' + top + '/' + L + ' = <b>' + fr(top, L) + '</b>.');
          },
          function () {
            var N = 20 * rnd(3, 20), p = pick([15, 35, 45, 65, 85, 120]), v = N * (100 + p) / 100;
            return num('Increase <b>' + N + '</b> by <b>' + p + '%</b>.', v, 'Multiply by ' + (1 + p / 100) + ': ' + N + ' × ' + (1 + p / 100) + ' = <b>' + v + '</b>.');
          },
          function () {
            var p = pick([10, 20, 25, 40, 15]), orig = 20 * rnd(2, 15), X = orig * (100 - p) / 100;
            return num('After a <b>' + p + '%</b> discount, a cloak costs <b>£' + X + '</b>. What was the original price in pounds?', orig,
              'The sale price is ' + (100 - p) + '% of the original. £' + X + ' ÷ ' + ((100 - p) / 100) + ' = <b>£' + orig + '</b>. (Not £' + X + ' + ' + p + '%!)');
          },
          function () {
            var b = rnd(3, 9), a = rnd(1, b - 1), k = rnd(3, 15);
            return num('<b>' + a + '/' + b + '</b> of a number is <b>' + (a * k) + '</b>. What is the number?', b * k,
              (a > 1 ? a + '/' + b + ' is ' + (a * k) + ', so 1/' + b + ' is ' + k + '. ' : '') + 'The whole is ' + b + ' × ' + k + ' = <b>' + (b * k) + '</b>.');
          },
          function () {
            var b = pick([3, 4, 5]), a = rnd(1, b - 1), d = pick([3, 4, 5]), c = rnd(1, d - 1), N = b * d * rnd(2, 6), rest = N * (b - a) / b, ride = rest * c / d;
            return num('There are <b>' + N + '</b> knights. <b>' + a + '/' + b + '</b> of them are archers. <b>' + c + '/' + d + '</b> of the <b>rest</b> ride horses. How many knights ride horses?', ride,
              'Archers: ' + (N * a / b) + '. The rest: ' + rest + '. ' + c + '/' + d + ' of ' + rest + ' = <b>' + ride + '</b>.');
          },
          function () {
            var N = 40 * rnd(2, 12), v = N * 17.5 / 100;
            return num('What is <b>17.5% of ' + N + '</b>?', v, '10% = ' + (N / 10) + ', 5% = ' + (N / 20) + ', 2.5% = ' + (N / 40) + '. Add: <b>' + v + '</b>.');
          },
          function () {
            var b = pick([4, 5, 8]), a = rnd(1, b - 1), p = pick([10, 20, 30, 40, 60]), N = 20 * b * rnd(1, 4);
            var v = N * a / b * p / 100;
            return num('What is <b>' + p + '%</b> of <b>' + a + '/' + b + '</b> of <b>' + N + '</b>?', v,
              a + '/' + b + ' of ' + N + ' = ' + (N * a / b) + '. ' + p + '% of that = <b>' + v + '</b>.');
          }
        ]
      },
      {
        id: 'angleford', name: 'Angleford', topic: 'Angles, Area & Volume', host: 'gareth', x: 660, y: 280, banner: '#1d3c78',
        lesson: [
          { who: 'gareth', text: 'The walls of <b>Angleford</b> were built by careful knights. An <b>angle</b> measures turn, in degrees (°).' },
          { who: 'gareth', text: 'A right angle is 90°. Angles on a <b>straight line</b> add to 180°. Angles <b>around a point</b> add to 360°.', ex: 'One angle on a line is 115° → the other is 180 − 115 = <b>65°</b>' },
          { who: 'anselm', text: 'Angles in a <b>triangle</b> add to 180°. In a <b>quadrilateral</b>, 360°. An isosceles triangle has two equal base angles.', ex: '50° + 60° + ? = 180° → ? = <b>70°</b>' },
          { who: 'eleanor', text: '<b>Perimeter</b> is the distance around the edge. <b>Area</b> is the space inside, in square units.', ex: 'Rectangle 7 × 4: perimeter 7 + 4 + 7 + 4 = 22, area 28' },
          { who: 'eleanor', text: 'Triangle area = ½ × base × height. Cuboid <b>volume</b> = length × width × height.', ex: 'Base 10, height 6 → area 30<br>Cuboid 4 × 3 × 2 → volume 24' },
          { who: 'gareth', text: 'Each interior angle of a <b>regular polygon</b> with n sides is 180 × (n − 2) ÷ n.', ex: 'Regular hexagon: 180 × 4 ÷ 6 = <b>120°</b>' }
        ],
        practice: [
          function () {
            var a = rnd(20, 160);
            return mcNum('Two angles sit on a straight line. One is <b>' + a + '°</b>. What is the other, in degrees?', 180 - a, [360 - a, 90 - a > 0 ? 90 - a : 200 - a, 180 - a + 10],
              'Angles on a straight line add to 180°: 180 − ' + a + ' = <b>' + (180 - a) + '°</b>.');
          },
          function () {
            var a = rnd(20, 80), b = rnd(20, 80);
            return mcNum('A triangle has angles <b>' + a + '°</b> and <b>' + b + '°</b>. What is the third angle?', 180 - a - b, [360 - a - b, 90 - Math.abs(a - b), 180 - a - b + 10],
              '180 − ' + a + ' − ' + b + ' = <b>' + (180 - a - b) + '°</b>.');
          },
          function () {
            var w = rnd(3, 15), h = rnd(2, 12);
            return mcNum('A rectangle is <b>' + w + ' m</b> by <b>' + h + ' m</b>. What is its <b>perimeter</b> in metres?', 2 * (w + h), [w * h, w + h, 2 * w + h],
              w + ' + ' + h + ' + ' + w + ' + ' + h + ' = <b>' + (2 * (w + h)) + ' m</b>.');
          },
          function () {
            var w = rnd(3, 15), h = rnd(2, 12);
            return mcNum('A rectangular field is <b>' + w + ' m</b> by <b>' + h + ' m</b>. What is its <b>area</b> in m²?', w * h, [2 * (w + h), w + h, w * h + w],
              w + ' × ' + h + ' = <b>' + (w * h) + ' m²</b>.');
          },
          function () {
            var a = rnd(10, 80);
            return mcNum('A right angle is split into two parts. One part is <b>' + a + '°</b>. What is the other part?', 90 - a, [180 - a, 360 - a, 100 - a],
              '90 − ' + a + ' = <b>' + (90 - a) + '°</b>.');
          }
        ],
        exam: [
          function () {
            var W = rnd(10, 20), H = rnd(8, 16), w = rnd(2, W - 4), h = rnd(2, H - 4);
            return num('A courtyard is an <b>L-shape</b>: a <b>' + W + ' m × ' + H + ' m</b> rectangle with a <b>' + w + ' m × ' + h + ' m</b> rectangle cut out of one corner. What is its <b>area</b> in m²?', W * H - w * h,
              'Whole rectangle ' + (W * H) + ' m² minus the cut-out ' + (w * h) + ' m² = <b>' + (W * H - w * h) + ' m²</b>.');
          },
          function () {
            var W = rnd(10, 20), H = rnd(8, 16), w = rnd(2, W - 4), h = rnd(2, H - 4);
            return num('A garden is an <b>L-shape</b>: a <b>' + W + ' m × ' + H + ' m</b> rectangle with a <b>' + w + ' m × ' + h + ' m</b> rectangle cut out of one corner. What is its <b>perimeter</b> in metres?', 2 * (W + H),
              'Cutting a corner out pushes two edges inward but they keep the same total length! The perimeter is still 2 × (' + W + ' + ' + H + ') = <b>' + (2 * (W + H)) + ' m</b>.');
          },
          function () {
            var a = 2 * rnd(10, 70);
            return num('An isosceles triangle has a top (apex) angle of <b>' + a + '°</b>. What is the size of each base angle?', (180 - a) / 2,
              '(180 − ' + a + ') ÷ 2 = <b>' + ((180 - a) / 2) + '°</b>.');
          },
          function () {
            var p = pick([[5, 'pentagon'], [6, 'hexagon'], [8, 'octagon'], [9, 'nonagon'], [10, 'decagon'], [12, 'dodecagon'], [15, '15-sided polygon'], [20, '20-sided polygon']]);
            var v = 180 * (p[0] - 2) / p[0];
            return num('What is the size of each <b>interior angle</b> of a regular <b>' + p[1] + '</b>?', v,
              '180 × (' + p[0] + ' − 2) ÷ ' + p[0] + ' = <b>' + v + '°</b>. (Or: exterior angle 360 ÷ ' + p[0] + ' = ' + (360 / p[0]) + '°, so interior = 180 − ' + (360 / p[0]) + '.)');
          },
          function () {
            var x = rnd(20, 60), a = rnd(30, 100), b = 360 - a - 3 * x;
            if (b < 20) { a = 60; b = 360 - 60 - 3 * x; }
            return num('Four angles meet at a point: <b>' + a + '°</b>, <b>' + b + '°</b>, <b>x</b> and <b>2x</b>. Find <b>x</b>.', x,
              'They add to 360°: 3x = 360 − ' + a + ' − ' + b + ' = ' + (3 * x) + ', so x = <b>' + x + '°</b>.');
          },
          function () {
            var L = 2 * rnd(2, 8), W = 2 * rnd(2, 6), H = 2 * rnd(2, 5), c = (L / 2) * (W / 2) * (H / 2);
            return num('A chest is a cuboid <b>' + L + ' cm × ' + W + ' cm × ' + H + ' cm</b>. How many <b>2 cm cubes</b> fit inside exactly?', c,
              'Along each edge: ' + (L / 2) + ', ' + (W / 2) + ', ' + (H / 2) + ' cubes. ' + (L / 2) + ' × ' + (W / 2) + ' × ' + (H / 2) + ' = <b>' + c + '</b>. (Not ' + (L * W * H) + ' ÷ 2!)');
          },
          function () {
            var b = rnd(4, 20), h = rnd(3, 15);
            return num('A triangular flag has a base of <b>' + b + ' cm</b> and a perpendicular height of <b>' + h + ' cm</b>. What is its area in cm²?', b * h / 2,
              '½ × ' + b + ' × ' + h + ' = <b>' + (b * h / 2) + ' cm²</b>.');
          }
        ]
      },
      {
        id: 'patternholm', name: 'Patternholm', topic: 'Sequences & Simple Algebra', host: 'anselm', x: 860, y: 460, banner: '#6b4a2e',
        lesson: [
          { who: 'anselm', text: 'In the scriptorium of <b>Patternholm</b> monks copy patterns. A <b>sequence</b> is a list of numbers that follows a rule.' },
          { who: 'anselm', text: 'Find the difference between neighbouring terms to discover the rule.', ex: '4, 7, 10, 13 … → add 3 each time' },
          { who: 'edmund', text: 'The <b>nth term</b> lets you leap far ahead. If the rule is "+3, starting at 4", the nth term is 3n + 1.', ex: '100th term = 3 × 100 + 1 = <b>301</b>' },
          { who: 'isolde', text: 'In algebra a <b>letter</b> stands for an unknown number. Undo the operations in reverse order.', ex: '3n − 7 = 20 → 3n = 27 → n = <b>9</b>' },
          { who: 'edmund', text: 'A <b>formula</b> is a rule written with letters. Substitute numbers to use it.', ex: 'y = 2x + 5, when x = 4 → y = 8 + 5 = <b>13</b>' }
        ],
        practice: [
          function () {
            var a = rnd(1, 20), d = rnd(2, 9), s = [a, a + d, a + 2 * d, a + 3 * d];
            return mcNum('What is the next term?<br><b>' + s.join(', ') + ', …</b>', a + 4 * d, [a + 4 * d + 1, a + 5 * d, a + 3 * d + 2],
              'The rule is +' + d + ': ' + (a + 3 * d) + ' + ' + d + ' = <b>' + (a + 4 * d) + '</b>.');
          },
          function () {
            var a = rnd(5, 40), x = rnd(3, 40);
            return mcNum('Solve: <b>n + ' + a + ' = ' + (x + a) + '</b>', x, [x + 2 * a, x + 1, a], 'Subtract ' + a + ' from both sides: n = <b>' + x + '</b>.');
          },
          function () {
            var k = rnd(2, 12), x = rnd(2, 12);
            return mcNum('Solve: <b>' + k + 'n = ' + (k * x) + '</b>', x, [k * x - k, x + 1, k * x * k], 'Divide by ' + k + ': n = <b>' + x + '</b>.');
          },
          function () {
            var m = rnd(2, 9), c = rnd(1, 15), x = rnd(2, 10);
            return mcNum('If <b>y = ' + m + 'x + ' + c + '</b>, what is y when <b>x = ' + x + '</b>?', m * x + c, [m * (x + c), m + x + c, m * x - c],
              m + ' × ' + x + ' + ' + c + ' = <b>' + (m * x + c) + '</b>.');
          },
          function () {
            var a = rnd(60, 99), d = rnd(3, 9), s = [a, a - d, '?', a - 3 * d, a - 4 * d];
            return mcNum('Find the missing term:<br><b>' + s.join(', ') + '</b>', a - 2 * d, [a - 2 * d + 1, a - d - 1, a - 3 * d + 1],
              'The rule is −' + d + ': ' + (a - d) + ' − ' + d + ' = <b>' + (a - 2 * d) + '</b>.');
          }
        ],
        exam: [
          function () {
            var a = rnd(2, 15), d = rnd(3, 9), k = rnd(20, 50);
            return num('A sequence begins <b>' + a + ', ' + (a + d) + ', ' + (a + 2 * d) + ', ' + (a + 3 * d) + ', …</b><br>What is the <b>' + k + 'th</b> term?', a + (k - 1) * d,
              'nth term = ' + d + 'n ' + (a - d >= 0 ? '+ ' + (a - d) : '− ' + (d - a)) + '. For n = ' + k + ': ' + d + ' × ' + k + (a - d >= 0 ? ' + ' + (a - d) : ' − ' + (d - a)) + ' = <b>' + (a + (k - 1) * d) + '</b>.');
          },
          function () {
            var a = rnd(3, 12), x = rnd(4, 25), b = rnd(3, 30);
            return num('Solve: <b>' + a + 'n − ' + b + ' = ' + (a * x - b) + '</b>', x,
              'Add ' + b + ': ' + a + 'n = ' + (a * x) + '. Divide by ' + a + ': n = <b>' + x + '</b>.');
          },
          function () {
            var n = rnd(4, 20), m = rnd(3, 9), s = rnd(2, 20), R = n * m - s;
            return num('Brother Anselm thinks of a number. He multiplies it by <b>' + m + '</b>, then subtracts <b>' + s + '</b>. The answer is <b>' + R + '</b>. What was his number?', n,
              'Work backwards: ' + R + ' + ' + s + ' = ' + (R + s) + ', then ÷ ' + m + ' = <b>' + n + '</b>.');
          },
          function () {
            var a = rnd(4, 8), d = rnd(2, 5), k = rnd(15, 40), T = a + (k - 1) * d;
            return num('Pattern 1 uses <b>' + a + '</b> tiles, pattern 2 uses <b>' + (a + d) + '</b>, pattern 3 uses <b>' + (a + 2 * d) + '</b>, and so on. Which pattern number uses <b>' + T + '</b> tiles?', k,
              'Tiles = ' + d + 'n + ' + (a - d) + '. Solve ' + d + 'n + ' + (a - d) + ' = ' + T + ': n = (' + T + ' − ' + (a - d) + ') ÷ ' + d + ' = <b>' + k + '</b>.');
          },
          function () {
            var a = rnd(2, 9), b = rnd(2, 12), x = rnd(2, 15);
            return num('Solve: <b>' + a + '(n + ' + b + ') = ' + (a * (x + b)) + '</b>', x,
              'Divide by ' + a + ': n + ' + b + ' = ' + (x + b) + '. So n = <b>' + x + '</b>.');
          },
          function () {
            var m = rnd(10, 60), S = 3 * m + 3;
            return num('Three <b>consecutive</b> whole numbers add up to <b>' + S + '</b>. What is the <b>largest</b> of them?', m + 2,
              'Call them n, n + 1, n + 2: 3n + 3 = ' + S + ' → n = ' + m + '. Largest = <b>' + (m + 2) + '</b>.');
          }
        ]
      }
    ]
  });
})();

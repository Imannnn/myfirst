(function () {
  var rnd = U.rnd, pick = U.pick, shuffle = U.shuffle, mcNum = U.mcNum, mcStr = U.mcStr, num = U.num;

  var SHAPES2D = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]];
  /* name, faces, edges, vertices */
  var SOLIDS = [['cube', 6, 12, 8], ['cuboid', 6, 12, 8], ['square-based pyramid', 5, 8, 5], ['triangular prism', 5, 9, 6], ['tetrahedron', 4, 6, 4]];
  var DIRS = ['North', 'East', 'South', 'West'];
  var COINS = [200, 100, 50, 20, 10, 5, 2, 1];

  function time(h, m) { return h + ':' + (m < 10 ? '0' : '') + m; }
  function addMins(h, m, add) {
    var t = h * 60 + m + add, hh = Math.floor(t / 60), mm = t % 60;
    return [((hh - 1) % 12) + 1, mm];
  }
  function coinStr(p) { return p >= 100 ? '£' + (p / 100) : p + 'p'; }

  MQ.addLevel({
    id: 'ks1', name: 'KS1', full: 'Key Stage 1', ages: 'Ages 5–7', region: 'The Shire of Little Sums',
    cities: [
      {
        id: 'numbersby', name: 'Numbersby', topic: 'Counting & Place Value', host: 'isolde', x: 170, y: 470, banner: '#8c1c24',
        lesson: [
          { who: 'aldric', text: 'Welcome to <b>Numbersby</b>! Here every number lives in a house with two rooms: the <b>Tens</b> room and the <b>Ones</b> room.' },
          { who: 'isolde', text: 'Look at 47. The 4 sits in the Tens room, so it is worth <b>40</b>. The 7 sits in the Ones room, so it is worth <b>7</b>.', ex: '47 = 4 tens + 7 ones = 40 + 7' },
          { who: 'isolde', text: 'We can count in jumps of 2, 5 or 10 along the number line. We can count backwards too!', ex: '5, 10, 15, 20, 25 …<br>50, 47, 44, 41 … (back in 3s)' },
          { who: 'gareth', text: 'To compare numbers, look at the <b>tens</b> first. More tens means bigger. If the tens are the same, compare the ones.', ex: '62 > 58 because 6 tens is more than 5 tens' },
          { who: 'isolde', text: '<b>10 more</b> adds one to the tens digit. <b>10 less</b> takes one away. Halfway between two numbers is the middle of the jump.', ex: '34 + 10 = 44 · 34 − 10 = 24<br>Halfway between 10 and 20 is 15' }
        ],
        practice: [
          function () {
            var t, o; do { t = rnd(2, 9); o = rnd(1, 9); } while (t === o);
            var N = 10 * t + o;
            return mcNum('What is the value of the digit <b>' + t + '</b> in <b>' + N + '</b>?', 10 * t, [t, o * 10, t + o, 100 * t],
              'The ' + t + ' is in the tens place, so it is worth ' + t + ' tens = <b>' + (10 * t) + '</b>.');
          },
          function () {
            var a, b; do { a = rnd(1, 9); b = rnd(1, 9); } while (a === b);
            var set = [10 * a + b, 10 * b + a];
            while (set.length < 4) { var x = rnd(10, 99); if (set.indexOf(x) === -1) set.push(x); }
            var max = Math.max.apply(null, set);
            return mcNum('Which number is the <b>biggest</b>?', max, set, 'Compare the tens first, then the ones. <b>' + max + '</b> is the biggest.');
          },
          function () {
            var N = rnd(11, 89), more = Math.random() < 0.5, ans = more ? N + 10 : N - 10;
            return mcNum('What number is <b>10 ' + (more ? 'more' : 'less') + '</b> than <b>' + N + '</b>?', ans,
              more ? [N + 1, N + 11, N - 10] : [N - 1, N + 10, N - 11],
              (more ? 'Add' : 'Take away') + ' one ten: the tens digit changes. ' + N + (more ? ' + ' : ' − ') + '10 = <b>' + ans + '</b>.');
          },
          function () {
            var s = pick([2, 5, 10]), st = s * rnd(1, 6), seq = [st, st + s, st + 2 * s, st + 3 * s];
            return mcNum('Count in ' + s + 's. What comes next?<br><b>' + seq.join(', ') + ', …</b>', st + 4 * s, [st + 3 * s + 1, st + 5 * s, st + 4 * s + 1],
              'Each jump adds ' + s + ': ' + (st + 3 * s) + ' + ' + s + ' = <b>' + (st + 4 * s) + '</b>.');
          },
          function () {
            var t = rnd(1, 9), o = rnd(0, 9);
            return mcNum('What number has <b>' + t + ' tens</b> and <b>' + o + ' ones</b>?', 10 * t + o, [10 * o + t, t + o, 100 * t + o],
              t + ' tens = ' + (10 * t) + ', plus ' + o + ' ones makes <b>' + (10 * t + o) + '</b>.');
          }
        ],
        exam: [
          function () {
            var d = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), s = d.slice().sort(function (a, b) { return a - b; });
            var big = 10 * s[2] + s[1], small = 10 * s[0] + s[1];
            return num('Isolde has three digit cards: <b>' + d.join(', ') + '</b>. She makes the <b>biggest</b> 2-digit number she can, then the <b>smallest</b> 2-digit number she can. What is the difference between her two numbers?',
              big - small, 'Biggest: largest digit in the tens, next largest in the ones → ' + big + '. Smallest: ' + small + '. ' + big + ' − ' + small + ' = <b>' + (big - small) + '</b>.');
          },
          function () {
            var t = rnd(2, 7), o = rnd(11, 19);
            return num('What number is made of <b>' + t + ' tens</b> and <b>' + o + ' ones</b>?', 10 * t + o,
              o + ' ones is 1 ten and ' + (o - 10) + ' ones. So we have ' + (t + 1) + ' tens and ' + (o - 10) + ' ones = <b>' + (10 * t + o) + '</b>.');
          },
          function () {
            var N = rnd(45, 70);
            return num('Count back in 3s: <b>' + N + ', ' + (N - 3) + ', ' + (N - 6) + ', …</b><br>What is the <b>7th</b> number in the count?', N - 18,
              'From the 1st number to the 7th is 6 jumps back of 3, which is 18. ' + N + ' − 18 = <b>' + (N - 18) + '</b>.');
          },
          function () {
            var a = rnd(10, 40), b = a + 2 * rnd(5, 20), m = (a + b) / 2;
            return num('What number is exactly <b>halfway</b> between <b>' + a + '</b> and <b>' + b + '</b>?', m,
              'The gap is ' + (b - a) + '. Half of that is ' + ((b - a) / 2) + '. ' + a + ' + ' + ((b - a) / 2) + ' = <b>' + m + '</b>.');
          },
          function () {
            var o = rnd(1, 4), d = rnd(1, 4), t = o + d;
            return num('Riddle: I am a 2-digit number. My tens digit is <b>' + d + ' more</b> than my ones digit. My two digits add up to <b>' + (t + o) + '</b>. What number am I?',
              10 * t + o, 'Try ones digits: if the ones digit is ' + o + ', the tens digit is ' + t + ' and ' + t + ' + ' + o + ' = ' + (t + o) + '. So I am <b>' + (10 * t + o) + '</b>.');
          },
          function () {
            var k = rnd(2, 9);
            return num('How many whole numbers from <b>1 to 99</b> have the digit <b>' + k + '</b> in them at least once?', 19,
              'Ones digit ' + k + ': ' + k + ', 1' + k + ', 2' + k + ' … 9' + k + ' (10 numbers). Tens digit ' + k + ': ' + k + '0 … ' + k + '9 (10 numbers). ' + k + '' + k + ' was counted twice, so 10 + 10 − 1 = <b>19</b>.');
          }
        ]
      },
      {
        id: 'addlington', name: 'Addlington', topic: 'Addition & Subtraction', host: 'gareth', x: 400, y: 300, banner: '#1d3c78',
        lesson: [
          { who: 'gareth', text: 'Hail, young squire! In <b>Addlington</b> we gather supplies and give them away. <b>Adding</b> puts groups together. <b>Subtracting</b> takes some away or finds the difference.' },
          { who: 'gareth', text: 'Add the tens to the tens and the ones to the ones.', ex: '34 + 25 → 30 + 20 = 50 and 4 + 5 = 9 → <b>59</b>' },
          { who: 'tobias', text: 'When the ones make more than 9 we make a new ten. This is called <b>bridging</b> through ten.', ex: '38 + 5 = 38 + 2 + 3 = 40 + 3 = <b>43</b>' },
          { who: 'isolde', text: 'Adding and subtracting are <b>opposites</b>. Use one to undo the other and find missing numbers.', ex: '? + 8 = 20 → 20 − 8 = <b>12</b><br>? − 6 = 9 → 9 + 6 = <b>15</b>' },
          { who: 'gareth', text: 'In stories, words like <b>altogether</b> and <b>more</b> mean add; <b>left</b>, <b>fewer</b> and <b>difference</b> often mean subtract. Do one step at a time!' }
        ],
        practice: [
          function () {
            var a = rnd(10, 60), b = rnd(2, 30);
            return mcNum('What is <b>' + a + ' + ' + b + '</b>?', a + b, [a + b + 10, a + b - 10, a + b - 1], 'Tens then ones: ' + a + ' + ' + b + ' = <b>' + (a + b) + '</b>.');
          },
          function () {
            var a = rnd(20, 90), b = rnd(2, a - 5);
            return mcNum('What is <b>' + a + ' − ' + b + '</b>?', a - b, [a + b, a - b + 10, a - b - 10], a + ' − ' + b + ' = <b>' + (a - b) + '</b>.');
          },
          function () {
            var a = rnd(5, 40), m = rnd(3, 30), c = a + m;
            return mcNum('Find the missing number: <b>' + a + ' + ? = ' + c + '</b>', m, [c + a, m + 1, m - 1, m + 10], 'Use the opposite: ' + c + ' − ' + a + ' = <b>' + m + '</b>.');
          },
          function () {
            var A = rnd(20, 50), B = rnd(5, A - 5);
            return mcNum('Sir Gareth has <b>' + A + '</b> arrows. He fires <b>' + B + '</b> of them. How many are <b>left</b>?', A - B, [A + B, A - B + 1, A - B - 10],
              '"Left" means subtract: ' + A + ' − ' + B + ' = <b>' + (A - B) + '</b>.');
          },
          function () {
            var a = rnd(30, 80), b = rnd(5, a - 10);
            return mcNum('What is the <b>difference</b> between <b>' + a + '</b> and <b>' + b + '</b>?', a - b, [a + b, a - b + 10, a - b - 1],
              'Difference means take the smaller from the bigger: ' + a + ' − ' + b + ' = <b>' + (a - b) + '</b>.');
          }
        ],
        exam: [
          function () {
            var A = rnd(30, 60), B = rnd(10, A - 5), C = rnd(10, 30);
            return num('Gareth has <b>' + A + '</b> arrows. He gives <b>' + B + '</b> to Tobias, then finds <b>' + C + '</b> more in the armoury. How many arrows does Gareth have now?',
              A - B + C, A + ' − ' + B + ' = ' + (A - B) + ', then ' + (A - B) + ' + ' + C + ' = <b>' + (A - B + C) + '</b>.');
          },
          function () {
            var a = rnd(12, 39), b = rnd(15, 49);
            return num('Find the missing number: <b>? − ' + a + ' = ' + b + '</b>', a + b,
              'Undo the subtraction by adding: ' + b + ' + ' + a + ' = <b>' + (a + b) + '</b>.');
          },
          function () {
            var a = rnd(15, 39), b = rnd(15, 39), c = rnd(15, 29);
            return num('What is <b>' + a + ' + ' + b + ' + ' + c + '</b>?', a + b + c,
              a + ' + ' + b + ' = ' + (a + b) + ', then ' + (a + b) + ' + ' + c + ' = <b>' + (a + b + c) + '</b>.');
          },
          function () {
            var x = rnd(5, 30), D = rnd(2, 20), S = 2 * x + D;
            return num('Two numbers add up to <b>' + S + '</b>. One number is <b>' + D + ' more</b> than the other. What is the <b>bigger</b> number?', x + D,
              'Take away the extra ' + D + ': ' + S + ' − ' + D + ' = ' + (2 * x) + '. Share equally: ' + x + ' each. The bigger number is ' + x + ' + ' + D + ' = <b>' + (x + D) + '</b>.');
          },
          function () {
            var A = rnd(10, 40), B = rnd(5, 20);
            return num('Isolde has <b>' + A + '</b> gold coins. Tobias has <b>' + B + ' more</b> than Isolde. How many coins do they have <b>altogether</b>?', 2 * A + B,
              'Tobias has ' + A + ' + ' + B + ' = ' + (A + B) + '. Altogether: ' + A + ' + ' + (A + B) + ' = <b>' + (2 * A + B) + '</b>.');
          },
          function () {
            var a = rnd(60, 99), b = rnd(11, 25), c = rnd(11, a - b - 5);
            return num('What is <b>' + a + ' − ' + b + ' − ' + c + '</b>?', a - b - c,
              a + ' − ' + b + ' = ' + (a - b) + ', then ' + (a - b) + ' − ' + c + ' = <b>' + (a - b - c) + '</b>.');
          }
        ]
      },
      {
        id: 'shapeshire', name: 'Shapeshire', topic: '2-D & 3-D Shapes', host: 'anselm', x: 640, y: 470, banner: '#6b4a2e',
        lesson: [
          { who: 'anselm', text: 'Peace be with you. In <b>Shapeshire</b> every building is a shape. <b>2-D</b> shapes are flat. <b>3-D</b> shapes are solid.' },
          { who: 'anselm', text: 'Count the straight sides of flat shapes.', ex: 'triangle 3 · square 4 · rectangle 4 · pentagon 5 · hexagon 6 · octagon 8' },
          { who: 'eleanor', text: 'Solid shapes have <b>faces</b> (flat surfaces), <b>edges</b> (where two faces meet) and <b>vertices</b> (corners).', ex: 'Cube: 6 faces, 12 edges, 8 vertices<br>Square-based pyramid: 5 faces, 8 edges, 5 vertices<br>Triangular prism: 5 faces, 9 edges, 6 vertices' },
          { who: 'anselm', text: 'A <b>line of symmetry</b> splits a shape into two halves that match like a mirror.', ex: 'Square: 4 lines · Rectangle: 2 lines · Equilateral triangle: 3 lines' },
          { who: 'gareth', text: 'A <b>quarter turn</b> is a right angle. Four quarter turns bring you all the way round. Clockwise goes North → East → South → West.' }
        ],
        practice: [
          function () {
            var s = pick(SHAPES2D);
            return mcNum('How many sides does a <b>' + s[0] + '</b> have?', s[1], [s[1] + 1, s[1] - 1, s[1] + 2], 'A ' + s[0] + ' has <b>' + s[1] + '</b> sides.');
          },
          function () {
            var s = pick([['triangle', 3], ['square', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]]);
            return mcStr('Which shape has exactly <b>' + s[1] + '</b> sides?', s[0], shuffle(['triangle', 'square', 'pentagon', 'hexagon', 'octagon', 'circle']), 'A <b>' + s[0] + '</b> has ' + s[1] + ' sides.');
          },
          function () {
            var s = pick(SOLIDS), k = rnd(1, 3), what = ['faces', 'edges', 'vertices'][k - 1];
            return mcNum('How many <b>' + what + '</b> does a <b>' + s[0] + '</b> have?', s[k], [s[1], s[2], s[3], s[k] + 1],
              'A ' + s[0] + ' has ' + s[1] + ' faces, ' + s[2] + ' edges and ' + s[3] + ' vertices. So <b>' + s[k] + '</b>.');
          },
          function () {
            var s = pick([['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['regular hexagon', 6]]);
            return mcNum('How many <b>lines of symmetry</b> does a <b>' + s[0] + '</b> have?', s[1], [1, 2, 4, 6, 3], 'A ' + s[0] + ' has <b>' + s[1] + '</b> lines of symmetry.');
          },
          function () {
            var d = rnd(0, 3), k = rnd(1, 3), cw = Math.random() < 0.5, end = (d + (cw ? k : -k) + 8) % 4;
            return mcStr('Brother Anselm faces <b>' + DIRS[d] + '</b>. He makes <b>' + k + '</b> quarter turn' + (k > 1 ? 's' : '') + ' <b>' + (cw ? 'clockwise' : 'anticlockwise') + '</b>. Which way does he face now?',
              DIRS[end], DIRS, 'Turning ' + (cw ? 'clockwise' : 'anticlockwise') + ' ' + k + ' quarter turn' + (k > 1 ? 's' : '') + ' from ' + DIRS[d] + ' ends at <b>' + DIRS[end] + '</b>.');
          }
        ],
        exam: [
          function () {
            var p = shuffle(SHAPES2D.filter(function (x) { return x[0] !== 'rectangle'; })).slice(0, 2), a = rnd(2, 5), b = rnd(2, 5);
            var tot = a * p[0][1] + b * p[1][1];
            return num('Anselm draws <b>' + a + ' ' + p[0][0] + 's</b> and <b>' + b + ' ' + p[1][0] + 's</b>. How many sides has he drawn altogether?', tot,
              a + ' × ' + p[0][1] + ' = ' + (a * p[0][1]) + ' and ' + b + ' × ' + p[1][1] + ' = ' + (b * p[1][1]) + '. Total <b>' + tot + '</b>.');
          },
          function () {
            var p = shuffle(SOLIDS.slice(1)).slice(0, 2);
            return num('How many <b>vertices</b> (corners) are there altogether on a <b>' + p[0][0] + '</b> and a <b>' + p[1][0] + '</b>?', p[0][3] + p[1][3],
              'A ' + p[0][0] + ' has ' + p[0][3] + ' vertices and a ' + p[1][0] + ' has ' + p[1][3] + '. Total <b>' + (p[0][3] + p[1][3]) + '</b>.');
          },
          function () {
            var d = rnd(0, 3), k = rnd(2, 5), m = rnd(1, 3), end = (((d + k - m) % 4) + 4) % 4;
            return mcStr('Sir Gareth faces <b>' + DIRS[d] + '</b>. He makes <b>' + k + '</b> quarter turns clockwise, then <b>' + m + '</b> quarter turn' + (m > 1 ? 's' : '') + ' anticlockwise. Which way does he face now?',
              DIRS[end], DIRS, 'Overall he turns ' + k + ' − ' + m + ' = ' + (k - m) + ' quarter turns clockwise (4 quarter turns is a full circle). He faces <b>' + DIRS[end] + '</b>.');
          },
          function () {
            var x = rnd(1, 5), y = rnd(1, 5), T = x + y, S = 3 * x + 4 * y;
            return num('Tobias has some <b>triangles</b> and some <b>squares</b>. There are <b>' + T + '</b> shapes and <b>' + S + '</b> sides altogether. How many <b>squares</b> are there?', y,
              'If all ' + T + ' were triangles there would be ' + (3 * T) + ' sides. There are ' + (S - 3 * T) + ' extra side' + (y > 1 ? 's' : '') + ', and each square adds 1 extra side. So <b>' + y + '</b> square' + (y > 1 ? 's' : '') + '.');
          },
          function () {
            var s = pick(SOLIDS);
            return num('Add together the number of <b>faces</b>, <b>edges</b> and <b>vertices</b> of a <b>' + s[0] + '</b>.', s[1] + s[2] + s[3],
              s[1] + ' faces + ' + s[2] + ' edges + ' + s[3] + ' vertices = <b>' + (s[1] + s[2] + s[3]) + '</b>.');
          },
          function () {
            var n = rnd(2, 5);
            return num('Queen Eleanor stacks <b>' + n + '</b> separate wooden cubes in a box (not touching). How many <b>edges</b> do the cubes have altogether?', 12 * n,
              'Each cube has 12 edges. ' + n + ' × 12 = <b>' + (12 * n) + '</b>.');
          }
        ]
      },
      {
        id: 'coinford', name: 'Coinford', topic: 'Money & Time', host: 'tobias', x: 850, y: 240, banner: '#7a2e1a',
        lesson: [
          { who: 'tobias', text: 'Welcome to the market of <b>Coinford</b>! Our coins are 1p, 2p, 5p, 10p, 20p, 50p, £1 and £2.' },
          { who: 'tobias', text: '<b>£1 = 100p</b>. To total coins, start with the biggest and count on.', ex: '20p + 10p + 5p + 2p = <b>37p</b>' },
          { who: 'isolde', text: 'To find <b>change</b>, count up from the price to what you paid.', ex: 'Price 65p, pay £1: 65 → 70 → 100. Change = <b>35p</b>' },
          { who: 'edmund', text: 'An hour has <b>60 minutes</b>. Quarter past = 15 minutes past. Half past = 30. Quarter to = 45 minutes past.', ex: 'Quarter to 4 is <b>3:45</b>' },
          { who: 'tobias', text: 'When adding time, remember an hour is 60 minutes — not 100!', ex: '2:50 + 20 minutes = <b>3:10</b>' }
        ],
        practice: [
          function () {
            var cs = []; for (var i = rnd(3, 4); i > 0; i--) cs.push(pick([1, 2, 5, 10, 20, 50]));
            cs.sort(function (a, b) { return b - a; });
            var t = cs.reduce(function (a, b) { return a + b; }, 0);
            return mcNum('Tobias has these coins: <b>' + cs.map(coinStr).join(' + ') + '</b>. How many pence is that?', t, [t + 5, t - 5, t + 10],
              cs.map(coinStr).join(' + ') + ' = <b>' + t + 'p</b>.');
          },
          function () {
            var price = rnd(5, 45);
            return mcNum('An apple costs <b>' + price + 'p</b>. You pay with a <b>50p</b> coin. How much change, in pence?', 50 - price, [price, 50 - price + 10, 100 - price],
              'Count up from ' + price + 'p to 50p: <b>' + (50 - price) + 'p</b>.');
          },
          function () {
            var h = rnd(1, 11), kind = rnd(0, 2), w = ['quarter past', 'half past', 'quarter to'][kind];
            var hh = kind === 2 ? h + 1 : h, ans = kind === 0 ? time(h, 15) : kind === 1 ? time(h, 30) : time(h, 45);
            return mcStr('Which time is <b>' + w + ' ' + hh + '</b>?', ans, [time(hh, 15), time(hh, 45), time(h, 30), time(hh, 30), time(h, 15)],
              w.charAt(0).toUpperCase() + w.slice(1) + ' ' + hh + ' is <b>' + ans + '</b>.');
          },
          function () {
            var q = pick([['minutes in one hour', 60, [100, 30, 24]], ['minutes in half an hour', 30, [50, 15, 60]], ['hours in one day', 24, [12, 60, 7]], ['days in one week', 7, [5, 10, 12]], ['minutes in a quarter of an hour', 15, [25, 30, 4]]]);
            return mcNum('How many <b>' + q[0] + '</b>?', q[1], q[2], 'There are <b>' + q[1] + '</b> ' + q[0] + '.');
          },
          function () {
            var p = rnd(6, 30), k = rnd(2, 4);
            return mcNum('A pear costs <b>' + p + 'p</b>. How much do <b>' + k + '</b> pears cost, in pence?', p * k, [p + k, p * k + p, p * k - 1],
              k + ' lots of ' + p + 'p = <b>' + (p * k) + 'p</b>.');
          }
        ],
        exam: [
          function () {
            var a = rnd(15, 45), b = rnd(15, 45);
            return num('Isolde buys a ribbon for <b>' + a + 'p</b> and a candle for <b>' + b + 'p</b>. She pays with <b>£1</b>. How much change does she get, in pence?', 100 - a - b,
              'Total cost ' + a + ' + ' + b + ' = ' + (a + b) + 'p. £1 = 100p. 100 − ' + (a + b) + ' = <b>' + (100 - a - b) + 'p</b>.');
          },
          function () {
            var N = rnd(11, 99), left = N, used = [];
            COINS.forEach(function (c) { while (left >= c) { left -= c; used.push(c); } });
            return num('What is the <b>fewest</b> number of coins needed to make exactly <b>' + N + 'p</b>?', used.length,
              'Always take the biggest coin you can: ' + used.map(coinStr).join(' + ') + '. That is <b>' + used.length + '</b> coins.');
          },
          function () {
            var h = rnd(1, 11), m = 5 * rnd(6, 11), add = 5 * rnd(6, 11), e = addMins(h, m, add);
            var wrong = [time(h, m + add - 60), time(e[0] === 12 ? 1 : e[0] + 1, e[1]), time(e[0], (e[1] + 10) % 60), time(e[0], (e[1] + 50) % 60)];
            return mcStr('The joust starts at <b>' + time(h, m) + '</b> and lasts <b>' + add + ' minutes</b>. What time does it finish?', time(e[0], e[1]), wrong,
              time(h, m) + ' + ' + (60 - m) + ' minutes = ' + (h % 12 + 1) + ':00, then ' + (add - (60 - m)) + ' more minutes → <b>' + time(e[0], e[1]) + '</b>.');
          },
          function () {
            var A = rnd(20, 60);
            return num('A loaf of bread costs <b>' + A + 'p</b>. Tobias buys <b>3</b> loaves and pays with a <b>£2</b> coin. How much change does he get, in pence?', 200 - 3 * A,
              '3 × ' + A + 'p = ' + (3 * A) + 'p. £2 = 200p. 200 − ' + (3 * A) + ' = <b>' + (200 - 3 * A) + 'p</b>.');
          },
          function () {
            var N = rnd(13, 41), best = Infinity, ba = 0;
            for (var a = 0; 5 * a <= N; a++) if ((N - 5 * a) % 2 === 0 && a + (N - 5 * a) / 2 < best) { best = a + (N - 5 * a) / 2; ba = a; }
            return num('Tobias only has <b>5p</b> and <b>2p</b> coins (lots of each). What is the <b>fewest</b> coins he can use to pay exactly <b>' + N + 'p</b>?', best,
              'Use as many 5p coins as possible while leaving an even amount for 2p coins: ' + ba + ' × 5p = ' + (5 * ba) + 'p, then ' + ((N - 5 * ba) / 2) + ' × 2p = ' + (N - 5 * ba) + 'p. Total <b>' + best + '</b> coins.');
          },
          function () {
            var h1 = rnd(1, 9), m1 = 5 * rnd(1, 11), dur = 5 * rnd(8, 30), e = addMins(h1, m1, dur);
            return num('The feast began at <b>' + time(h1, m1) + '</b> and ended at <b>' + time(e[0], e[1]) + '</b> the same afternoon. How many <b>minutes</b> did it last?', dur,
              'Count on to the next hour, then whole hours, then the extra minutes. Total <b>' + dur + '</b> minutes.');
          }
        ]
      }
    ]
  });
})();

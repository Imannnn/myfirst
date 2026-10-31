# Realm of Reckoning

A medieval maths adventure for every stage, from KS1 to University. Master Aldric, a curly-haired scholar
in green velvet, eats an apple and welcomes you. Then you pick your level and travel between the cities on
the map. Each city teaches one area of maths.

## Run it

It's a static web app with no build step. Open `index.html` in a browser, or serve the folder:

```bash
cd realm-of-reckoning
python3 -m http.server 8000   # then visit http://localhost:8000
```

It can be hosted as-is on GitHub Pages, Netlify or any static host. Progress and lives are saved in the
browser (`localStorage`).

## How it plays

| Step | What happens |
|---|---|
| **Opening scene** | Master Aldric bites his apple three times and says "Welcome! Let's learn mathematics." You choose **KS1, KS2, GCSE, A Level or University**. |
| **Map** | Each level is its own region with 4 cities. Each city covers one topic. |
| **Lesson** | The city's characters explain the topic step by step, with worked examples. **Skip lesson** jumps straight to the questions. |
| **Questions** | 6 practice questions with a full explanation after each one. |
| **Exam** | Unlocks after the questions. 8 hard, typed-answer questions covering everything in the city. You need 6/8 for a Silver Crest and 8/8 for a Gold Crest. |
| **Lives** | You have 5 lives. Each wrong answer (in practice or the exam) costs one. A life comes back every 30 minutes. At 0 lives you must wait, or buy a life for £2.99. |

### Cities

| Level | Cities (topics) |
|---|---|
| KS1 | Numbersby (place value) · Addlington (add & subtract) · Shapeshire (shapes) · Coinford (money & time) |
| KS2 | Multiplicester (× ÷, factors, primes) · Fractonbury (fractions, %) · Angleford (angles, area, volume) · Patternholm (sequences, algebra) |
| GCSE | Algebrook (equations, quadratics) · Trigminster (Pythagoras, trig) · Probabilshire (probability) · Graphton (graphs) |
| A Level | Derivale (differentiation) · Integrum (integration) · Sequenceport (sequences & series) · Exponhold (exponentials & logs) |
| University | Matrixburgh (linear algebra) · Limitsby (analysis) · Diffeqwick (differential equations) · Primewater (number theory) |

Questions are **generated with random numbers**, so every attempt is different. The exam accepts whole
numbers, negatives, decimals and fractions such as `7/12`.

### Characters

There are eight medieval characters, all drawn in SVG in `js/characters.js`:

- Master Aldric (the mentor)
- Lady Isolde
- Brother Anselm
- Sir Gareth
- Queen Eleanor
- Tobias the Merchant
- Rowena the Alchemist
- Old Edmund the Astronomer

## Payments (£2.99 per life)

Payments are **not connected yet**. The shop runs in demo mode: it shows the price and grants the life after
you confirm, and no money is taken. To charge for real:

1. Create a £2.99 product with a payment provider (for example a Stripe Payment Link).
2. Put its URL in `checkoutUrl` in `js/config.js`. The Buy button will then send players to checkout.
3. Grant the life **on a server** after the provider confirms the payment (for example from a Stripe webhook),
   then sync it to the player. Don't grant it from a client-side "success" redirect alone, because anyone can
   fake that. Selling to children also needs parental-consent and app-store rules checked.

Lives, timer length, price and question counts are all in `js/config.js`.

## Project layout

```
index.html
css/style.css
js/config.js          settings (lives, timer, price, checkout URL)
js/util.js            maths helpers, answer checking
js/characters.js      SVG character portraits + the apple scene
js/content/*.js       one file per level: lessons, question and exam generators
js/app.js             screens: intro, map, lesson, quiz/exam, results, lives & shop
```

To add a city, add an object to the level's `cities` array with `lesson` steps, `practice` generators and
`exam` generators (each generator returns a fresh question).

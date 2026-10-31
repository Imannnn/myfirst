/* App-wide settings. Edit these to tune the game or connect real payments. */
var CONFIG = {
  maxLives: 5,
  lifeRegenMinutes: 30,
  lifePrice: '£2.99',

  /* Questions per round. */
  practiceQuestions: 6,
  examQuestions: 8,
  examPassMark: 6, /* out of examQuestions */

  /* Payments. While `checkoutUrl` is null the shop runs in demo mode: no money is taken and
     the life is granted after a confirmation. To sell lives for real, create a product
     (e.g. a Stripe Payment Link for £2.99) and put its URL here, and grant the life from
     your server after the payment provider confirms it (see README). */
  checkoutUrl: null
};

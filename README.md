# AGC Tutorials website

Live site: https://agc-phi.vercel.app (deployed by Vercel from the `main` branch).

## Folders

```
index.html        Homepage                     → /
plans.html        Plans & Pricing              → /plans
enroll.html       Enrollment + payment step    → /enroll
tutors.html       Tutor Profile form           → /tutors
our-tutors.html   Our Tutors                   → /our-tutors
terms.html        Terms of Use                 → /terms
privacy.html      Privacy Policy               → /privacy

css/
  shared.css      Base styles used by every page (loaded first)
  <page>.css      One stylesheet per page (home.css is for index.html)
  footer.css      Site footer, same on every page (loaded last)

js/
  <page>.js       One script per page (home.js is for index.html)

images/           Logo, hero photos and founder photo

ghl/              Paste-ready blocks for GoHighLevel (generated, don't edit)
tools/
  build-ghl.js    Rebuilds ghl/ from the pages
vercel.json       Clean URLs (/plans instead of /plans.html)
```

Each page loads its files in this order:

```html
<link rel="stylesheet" href="/css/shared.css">
<link rel="stylesheet" href="/css/plans.css">
<link rel="stylesheet" href="/css/footer.css">
...
<script src="/js/plans.js"></script>
```

## Common edits

| To change… | Edit |
|---|---|
| Page text or layout | the page's `.html` file |
| Colours, spacing, fonts on one page | `css/<page>.css` |
| The footer's look | `css/footer.css` (the footer's text is in each page's HTML) |
| Package prices | the plan cards in `plans.html` and `index.html`, **and** `PLANS` in `js/home.js` and `js/enroll.js` |
| Payment links | `PAY_LINKS` at the top of `js/enroll.js` |
| Contact email | `EMAIL` in `js/enroll.js` and `js/tutors.js`, plus the `mailto:` links in each page's HTML |
| Logo or photos | replace the file in `images/`, keeping the same name |

## GoHighLevel

The `ghl/` folder has one block per page. Each block loads its CSS, JavaScript
and images from the Vercel site, so:

- **CSS, JavaScript or image changes** go live in GHL automatically once Vercel deploys.
- **HTML changes** need the block rebuilt and re-pasted:

  ```
  node tools/build-ghl.js
  ```

  Then paste `ghl/<page>.html` into the page's GHL **Custom JS/HTML** element.

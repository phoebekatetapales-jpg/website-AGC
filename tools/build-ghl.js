/* =====================================================================
   Builds the GoHighLevel paste blocks in ghl/ from the website pages.

   Run after changing any page:   node tools/build-ghl.js
   Then paste ghl/<page>.html into ONE GHL "Custom JS/HTML" element.

   The blocks load CSS, JavaScript and images from the live Vercel site,
   so CSS/JS-only changes go live in GHL as soon as Vercel deploys —
   re-paste only when a page's HTML changes.
   ===================================================================== */
const fs = require('fs'), path = require('path');

const SITE = process.env.AGC_SITE || 'https://agc-phi.vercel.app';
const ROOT = path.resolve(__dirname, '..');
const PAGES = { 'index.html': 'home', 'plans.html': 'plans', 'enroll.html': 'enroll', 'tutors.html': 'tutors',
  'our-tutors.html': 'our-tutors', 'terms.html': 'terms', 'privacy.html': 'privacy' };

const abs = s => s.replace(/(href|src)="\/(css|js|images)\//g, `$1="${SITE}/$2/`);
fs.mkdirSync(path.join(ROOT, 'ghl'), { recursive: true });

for (const [file, name] of Object.entries(PAGES)) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const body = html.match(/<body>\n?([\s\S]*?)<\/body>/)[1];
  // Fonts and stylesheets only: GHL sets the page's favicon in its own settings.
  const links = head.split('\n').filter(l => /^<link /.test(l) && !/rel="(icon|apple-touch-icon)"/.test(l)).join('\n');
  const block = `<!-- =====================================================================
     AGC Tutorials — ${name} page for GoHighLevel.
     Paste everything into ONE GHL Custom JS/HTML element.
     Generated from ${file} by tools/build-ghl.js — edit ${file}, not this file.
     ===================================================================== -->
<meta name="viewport" content="width=device-width, initial-scale=1">
${abs(links)}
${abs(body).trimEnd()}
`;
  fs.writeFileSync(path.join(ROOT, 'ghl', name + '.html'), block);
  console.log(`ghl/${name}.html  (${Math.round(block.length / 1024)} KB)`);
}

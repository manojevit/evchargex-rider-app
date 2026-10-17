// Regenerates the EVCHARGEX icon set from inline SVGs.
//   node scripts/gen-icons.js
// Requires the dev dependency `sharp`. Tweak BOLT / colors / scales below.
const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Lucide "zap" path, viewBox 0 0 24 24.
const BOLT = 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
const BRAND = '#1E63F0';

function bolt(scale, fill, cx = 512, cy = 512) {
  return `<g transform="translate(${cx},${cy}) scale(${scale}) translate(-12,-12)"><path d="${BOLT}" fill="${fill}"/></g>`;
}

const icon = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A6DF4"/><stop offset="1" stop-color="#1340AC"/></linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  <circle cx="512" cy="512" r="300" fill="#ffffff" fill-opacity="0.08"/>
  ${bolt(27, '#ffffff')}
</svg>`;

const adaptiveFg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${bolt(19, '#ffffff')}</svg>`;
const adaptiveBg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="${BRAND}"/></svg>`;
const mono = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${bolt(19, '#000000')}</svg>`;
const splash = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect x="332" y="332" width="360" height="360" rx="96" fill="#ffffff" fill-opacity="0.12"/>
  <rect x="396" y="396" width="232" height="232" rx="56" fill="#ffffff"/>
  ${bolt(9.5, BRAND)}
</svg>`;
const favicon = `<svg width="196" height="196" viewBox="0 0 196 196" xmlns="http://www.w3.org/2000/svg">
  <rect width="196" height="196" rx="44" fill="${BRAND}"/>
  <g transform="translate(98,98) scale(5.2) translate(-12,-12)"><path d="${BOLT}" fill="#ffffff"/></g>
</svg>`;

async function png(svg, file, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(ASSETS, file));
  console.log('wrote', file);
}

(async () => {
  await png(icon, 'icon.png', 1024);
  await png(adaptiveFg, 'android-icon-foreground.png', 1024);
  await png(adaptiveBg, 'android-icon-background.png', 1024);
  await png(mono, 'android-icon-monochrome.png', 1024);
  await png(splash, 'splash-icon.png', 1024);
  await png(favicon, 'favicon.png', 196);
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });

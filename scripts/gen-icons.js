// Regenerates the EVCHARGEX app icon set from the brand "EV" monogram
// (cropped from assets/brand/logo-white.png). Run: node scripts/gen-icons.js
const sharp = require('sharp');
const path = require('path');
const A = path.join(__dirname, '..', 'assets');
const LOGO = path.join(A, 'brand', 'logo-white.png'); // white EVCHARGEX wordmark, transparent

(async () => {
  // Clean "EV" monogram (white on transparent) from the brand lettering.
  const ev = await sharp(LOGO).extract({ left: 0, top: 0, width: 660, height: 315 }).trim().png().toBuffer();
  const evAt = (w) => sharp(ev).resize({ width: w }).png().toBuffer();
  const blueBg = (size) =>
    Buffer.from(
      `<svg width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A6DF4"/><stop offset="1" stop-color="#1340AC"/></linearGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/></svg>`,
    );

  await sharp(blueBg(1024)).composite([{ input: await evAt(600), gravity: 'center' }]).png().toFile(path.join(A, 'icon.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await evAt(500), gravity: 'center' }]).png().toFile(path.join(A, 'android-icon-foreground.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#1E63F0' } }).png().toFile(path.join(A, 'android-icon-background.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await evAt(500), gravity: 'center' }]).png().toFile(path.join(A, 'android-icon-monochrome.png'));
  await sharp(blueBg(196)).composite([{ input: await evAt(120), gravity: 'center' }]).png().toFile(path.join(A, 'favicon.png'));
  console.log('brand icons written');
})().catch((e) => { console.error(e); process.exit(1); });

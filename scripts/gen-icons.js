// Regenerates the EVCHARGEX app icon set: a black squircle with the brand
// "EX" monogram (cut from assets/brand/logo-white.png). Run: node scripts/gen-icons.js
const sharp = require('sharp');
const path = require('path');
const A = path.join(__dirname, '..', 'assets');
const LOGO = path.join(A, 'brand', 'logo-white.png'); // white EVCHARGEX wordmark, transparent
const BG = '#0D0D0F'; // near-black, matching the brand reference

(async () => {
  // Cut the first "E" and the last "X" from the brand lettering.
  const E = await sharp(LOGO).extract({ left: 0, top: 0, width: 400, height: 315 }).trim().toBuffer();
  const X = await sharp(LOGO).extract({ left: 2885, top: 0, width: 345, height: 315 }).trim().toBuffer();

  const H = 380;
  const Eh = await sharp(E).resize({ height: H }).toBuffer();
  const Xh = await sharp(X).resize({ height: H }).toBuffer();
  const em = await sharp(Eh).metadata();
  const xm = await sharp(Xh).metadata();
  const gap = 46;
  const exW = em.width + gap + xm.width;

  // Composed "EX" monogram (white on transparent).
  const ex = await sharp({ create: { width: exW, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: Eh, left: 0, top: 0 },
      { input: Xh, left: em.width + gap, top: 0 },
    ])
    .png()
    .toBuffer();

  const exAt = (w) => sharp(ex).resize({ width: w }).png().toBuffer();

  // icon.png — black square + EX
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: BG } })
    .composite([{ input: await exAt(560), gravity: 'center' }])
    .png()
    .toFile(path.join(A, 'icon.png'));

  // adaptive foreground — EX in the safe zone (transparent)
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await exAt(470), gravity: 'center' }])
    .png()
    .toFile(path.join(A, 'android-icon-foreground.png'));

  // adaptive background — black
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: BG } }).png().toFile(path.join(A, 'android-icon-background.png'));

  // monochrome (themed icons) — EX silhouette
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await exAt(470), gravity: 'center' }])
    .png()
    .toFile(path.join(A, 'android-icon-monochrome.png'));

  // favicon
  await sharp({ create: { width: 196, height: 196, channels: 3, background: BG } })
    .composite([{ input: await exAt(110), gravity: 'center' }])
    .png()
    .toFile(path.join(A, 'favicon.png'));

  console.log('brand EX icons written');
})().catch((e) => { console.error(e); process.exit(1); });

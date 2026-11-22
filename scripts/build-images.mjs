// Convertit les sources (OneDrive) en WebP responsive dans public/images,
// copie le CV et les documents (public/cv, public/docs), génère favicons et
// image Open Graph, et écrit le manifeste src/data/images.generated.json.
// Usage : node scripts/build-images.mjs  (PORTFOLIO_SOURCES pour changer la racine)

import { readdir, mkdir, writeFile, copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCES =
  process.env.PORTFOLIO_SOURCES ??
  "C:/Users/265na/OneDrive - Groupe INSEEC (POCE)/Projets Claude";
const CV_SOURCE =
  process.env.PORTFOLIO_CV ??
  "C:/Users/265na/OneDrive - Groupe INSEEC (POCE)/CV/CV NathanTOGOLO 1 CC.pdf";

const OUT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "data", "images.generated.json");

const PROJECT_SLUGS = {
  "01": "joon",
  "02": "dauphin-piscine",
  "03": "crimson-ale",
  "04": "europcar",
  "05": "cineman",
  "06": "les-watchers",
  "07": "dr-gti",
  "08": "retromarketing",
  "09": "waiting-for-a-sign",
  "10": "affiche-bleach",
  "13": "fallen-angel",
};

const LOGOS = {
  "Havas.png": "havas",
  "Havas people.png": "havas-people",
  "Workly.png": "workly",
  "Forum du commerce durable.png": "forum-commerce-durable",
  "Sup de pub.png": "sup-de-pub",
  "Université Lyon 2.png": "universite-lyon-2",
};

const manifest = {};

async function variants(src, id, widths, quality = 78) {
  const meta = await sharp(src).metadata();
  // Variantes plus petites que l'original ; l'original sert de plus grande
  // variante s'il est sous la largeur maximale (jamais d'agrandissement).
  const max = widths[widths.length - 1];
  const targets = widths.filter((w) => w < meta.width);
  if (meta.width <= max) {
    // une variante à moins de 15 % de l'original ferait doublon
    if (targets.length && targets[targets.length - 1] > meta.width * 0.85) targets.pop();
    targets.push(meta.width);
  }
  const dir = path.join(OUT, path.dirname(id));
  await mkdir(dir, { recursive: true });
  for (const w of targets) {
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(path.join(OUT, `${id}-${w}.webp`));
  }
  manifest[id] = { w: meta.width, h: meta.height, widths: targets.sort((a, b) => a - b) };
}

async function projects() {
  const dir = path.join(SOURCES, "Images Portfolio");
  const files = (await readdir(dir)).filter((f) => /^\d{2}-\d{2}\s/.test(f)).sort();
  for (const f of files) {
    const [nn, mm] = f.slice(0, 5).split("-");
    const slug = PROJECT_SLUGS[nn];
    if (!slug) continue;
    await variants(path.join(dir, f), `projets/${slug}/${nn}-${mm}`, [640, 1280, 1920]);
  }
}

async function logos() {
  const dir = path.join(SOURCES, "Logos CV");
  for (const [file, id] of Object.entries(LOGOS)) {
    await variants(path.join(dir, file), `logos/${id}`, [128, 256], 90);
  }
}

// Photo de Times Square (verticale) : hero de l'accueil en entier, et bande de
// fin de page recadrée sur la rue (bus, taxi jaune, passage piéton).
const TIMES = () => path.join(SOURCES, "Images Portfolio", "Hero Times Square.jpg");
// Image spatiale : ne sert plus qu'à la page Contact (recadrage Voie lactée).
const SPACE = () => path.join(SOURCES, "Images Portfolio", "Hero espace.png");
// Logo « Nathan. » : nacré (hero, écran de chargement, aperçu de partage),
// chromé (favicon).
const NACRE = () => path.join(SOURCES, "Images Portfolio", "Logo Nathan nacré.png");
const LOGO = () => path.join(SOURCES, "Images Portfolio", "Logo Nathan chrome.png");

async function heroImages() {
  await variants(TIMES(), "brand/hero-times", [640, 960, 1280, 1920, 2560], 68);
  const street = await sharp(TIMES()).extract({ left: 0, top: 2500, width: 3331, height: 2496 }).toBuffer();
  await variants(street, "brand/times-street", [640, 960, 1440, 1920, 2560], 70);
  const milkyWay = await sharp(SPACE()).extract({ left: 0, top: 300, width: 2565, height: 1900 }).toBuffer();
  await variants(milkyWay, "brand/space-milkyway", [960, 1440, 1920], 70);
  // Logo nacré : marges retirées, transparence conservée.
  const logo = await sharp(NACRE()).trim().toBuffer();
  await variants(logo, "brand/logo-nacre", [480, 800, 1200], 82);
}

async function brand() {
  // Signature blanche sur fond transparent : utilisée comme masque CSS.
  const sigSource = path.join(SOURCES, "Images Portfolio", "Branding perso.png");
  const sig = await sharp(sigSource).trim().png().toBuffer();
  await variants(sig, "brand/signature", [640], 90);

  // Favicon : logo chromé sur un carré noir arrondi (comme l'écran de chargement),
  // agrandi pour remplir le carré : posé sur un onglet blanc, le chrome seul disparaît.
  const app = path.join(ROOT, "src", "app");
  const chrome = await sharp(LOGO()).trim().toBuffer();
  const tile = async (size, radius, inset) => {
    const box = Math.round(size * (1 - 2 * inset));
    const mark = await sharp(chrome).resize(box, box, { fit: "contain", background: "#00000000" }).png().toBuffer();
    const square = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#0b0b0d"/></svg>`,
    );
    return sharp(square).composite([{ input: mark, gravity: "center" }]).png();
  };
  await rm(path.join(app, "icon.png"), { force: true });
  await (await tile(32, 7, 0.04)).toFile(path.join(app, "icon0.png"));
  await (await tile(512, 112, 0.1)).toFile(path.join(app, "icon1.png"));
  // iOS arrondit lui-même les coins : carré plein, sans transparence.
  await (await tile(180, 0, 0.12)).toFile(path.join(app, "apple-icon.png"));

  // Image Open Graph : Times Square (écrans et ciel) sous un voile bleu nuit,
  // logo nacré au centre avec une ombre douce.
  const background = await sharp(TIMES())
    .extract({ left: 0, top: 700, width: 3331, height: 1749 })
    .resize(1200, 630)
    .modulate({ brightness: 0.8 })
    .toBuffer();
  const veil = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="v" cx="50%" cy="50%" r="62%"><stop offset="0" stop-color="#040816" stop-opacity="0.62"/><stop offset="1" stop-color="#040816" stop-opacity="0.22"/></radialGradient></defs><rect width="1200" height="630" fill="url(#v)"/></svg>`,
  );
  const logo = await sharp(NACRE()).trim().resize({ height: 400 }).png().toBuffer();
  const { width: logoW, height: logoH } = await sharp(logo).metadata();
  // Ombre : silhouette noire du logo à 55 %, floutée.
  const alpha = await sharp(logo).extractChannel(3).linear(0.55, 0).png().toBuffer();
  const silhouette = await sharp({ create: { width: logoW, height: logoH, channels: 3, background: "#000000" } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  const shadow = await sharp(silhouette)
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: "#00000000" })
    .blur(18)
    .png()
    .toBuffer();
  const left = Math.round((1200 - logoW) / 2);
  const top = Math.round((630 - logoH) / 2);
  await sharp(background)
    .composite([
      { input: veil },
      { input: shadow, left: left - 40, top: top - 40 + 18 },
      { input: logo, left, top },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(app, "opengraph-image.jpg"));
}

async function cv() {
  const dest = path.join(ROOT, "public", "cv");
  await mkdir(dest, { recursive: true });
  await copyFile(CV_SOURCE, path.join(dest, "cv-nathan-togolo.pdf"));
}

// Documents à télécharger depuis les pages projets (versions compressées,
// originaux conservés à côté dans « Documents Portfolio »).
const DOCS = { "Retromarketing Trend.pdf": "benchmark-retromarketing.pdf" };

async function docs() {
  const dest = path.join(ROOT, "public", "docs");
  await mkdir(dest, { recursive: true });
  for (const [file, name] of Object.entries(DOCS)) {
    await copyFile(path.join(SOURCES, "Documents Portfolio", file), path.join(dest, name));
  }
}

if (!existsSync(SOURCES)) {
  console.error(`Dossier source introuvable : ${SOURCES}`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await Promise.all([projects(), logos(), heroImages()]);
await brand();
await cv();
await docs();

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${Object.keys(sorted).length} images traitées.`);

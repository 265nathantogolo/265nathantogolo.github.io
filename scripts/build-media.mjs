/**
 * Optimise les images du dossier « Images Portfolio » pour le site.
 *
 *   npm run media
 *   npm run media -- "C:\chemin\vers\Images Portfolio"
 *
 * Les fichiers sont reconnus par leur préfixe « NN-MM » (projet NN, image MM).
 * Sortie : public/media/<projet>/<MM>.webp (+ <MM>-sm.webp pour les grandes images)
 * et src/data/media.json (dimensions + couleur dominante, pour éviter les sauts de mise en page).
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_SRC =
  "C:/Users/265na/OneDrive - Groupe INSEEC (POCE)/Images/Captures d’écran/Images Portfolio";
const SRC = process.argv[2] || DEFAULT_SRC;
const OUT = path.resolve("public/media");
const MANIFEST = path.resolve("src/data/media.json");

// préfixe du fichier → dossier du projet (même ordre que les fichiers sources)
const PROJECTS = {
  "01": "joon",
  "02": "dauphin-piscine",
  "03": "crimson-ale",
  "04": "europcar",
  "05": "cineman",
  "06": "les-watchers",
  "07": "dr-gi",
  "08": "retromarketing",
  "09": "waiting-for-a-sign",
  "10": "affiche-bleach",
  "11": "profil",
};
// 10-02 est la même affiche que 10-01 (export PNG du même fichier)
const SKIP = new Set(["10-02"]);

const FULL = 1800;
const SMALL = 760;

const files = fs.readdirSync(SRC).filter((f) => /^\d\d-\d\d .*\.(png|jpe?g)$/i.test(f)).sort();
const manifest = {};

for (const file of files) {
  const key = file.slice(0, 5);
  if (SKIP.has(key)) continue;
  const project = PROJECTS[key.slice(0, 2)];
  if (!project) continue;
  const index = key.slice(3);
  const input = path.join(SRC, file);
  const dir = path.join(OUT, project);
  fs.mkdirSync(dir, { recursive: true });

  const meta = await sharp(input).metadata();
  const width = Math.min(meta.width, FULL);
  const height = Math.round((meta.height * width) / meta.width);

  await sharp(input).resize({ width }).webp({ quality: 84, effort: 5 }).toFile(path.join(dir, `${index}.webp`));
  let small = null;
  if (meta.width > SMALL * 1.15) {
    await sharp(input).resize({ width: SMALL }).webp({ quality: 80, effort: 5 }).toFile(path.join(dir, `${index}-sm.webp`));
    small = SMALL;
  }
  const { dominant } = await sharp(input).stats();
  const color = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");

  (manifest[project] ||= []).push({ index, src: `media/${project}/${index}.webp`, width, height, small, color });
  console.log(`${project}/${index}  ${width}x${height}  ${color}`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\n${Object.values(manifest).flat().length} images → ${path.relative(process.cwd(), MANIFEST)}`);

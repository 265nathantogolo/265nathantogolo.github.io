// Next 16.4 (output: "export") écrit les payloads de préchargement par segment
// dans des sous-dossiers (contact/__next.contact/__PAGE__.txt) alors que le
// routeur client les demande à plat (contact/__next.contact.__PAGE__.txt).
// Ce script crée la copie « à plat » attendue, sinon chaque préchargement de
// lien renvoie une 404 (erreurs console, requêtes perdues).

import { readdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
let copied = 0;

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(full)));
    else files.push(full);
  }
  return files;
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const relative = path.relative(full, file).split(path.sep).join(".");
        const flat = path.join(dir, `${entry.name}.${relative}`);
        const exists = await stat(flat).then(() => true, () => false);
        if (!exists) {
          await copyFile(file, flat);
          copied++;
        }
      }
    } else if (entry.name !== "_next" && entry.name !== "images") {
      await walk(full);
    }
  }
}

await walk(OUT);
console.log(`fix-export-segments : ${copied} payload(s) copiés à plat.`);

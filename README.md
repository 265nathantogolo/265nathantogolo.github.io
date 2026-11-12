# Portfolio · Nathan Togolo

Portfolio de Nathan Togolo, étudiant en Bachelor Stratégie des Marques et Communication à Sup de Pub (2023-2027), en recherche d'alternance en tant que chargé de communication.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · motion · export statique pour GitHub Pages.

## Installation

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
```

## Lancement

```bash
npm run dev
```

Le site est servi sur http://localhost:3000.

Pour vérifier la version de production (export statique dans `out/`) :

```bash
npm run build
npm run preview
```

## Images

Les visuels optimisés (WebP, plusieurs largeurs) sont déjà dans `public/images` et le manifeste dans `src/data/images.generated.json`. Pas besoin de les régénérer pour construire le site.

Pour les régénérer après un changement dans les dossiers sources (OneDrive : `Images Portfolio` dont `Hero espace.png` et `Logo Nathan chrome.png`, `Logos CV`, favicon de `Webdesign comp_`, CV) :

```bash
npm run images
```

Les chemins sources se changent avec les variables `PORTFOLIO_SOURCES` (dossier « Projets Claude ») et `PORTFOLIO_CV` (fichier `CV NathanTOGOLO 1 CC.pdf`). Le script produit aussi le favicon, l'icône Apple, l'image de partage Open Graph et copie le CV dans `public/cv/`.

Convention de nommage des visuels : `NN-MM Projet - ….png`, où `NN` est le numéro du projet et `MM` l'ordre dans la galerie.

## Contenu

| Fichier | Contenu |
|---|---|
| `src/data/site.ts` | Coordonnées, accroche, lien LinkedIn, chemin du CV |
| `src/data/projects.ts` | Compétences (filtres) et projets : textes, livrables, images, textes alternatifs |
| `src/data/profile.ts` | Expériences, formations, soft skills, langues, outils, passions |
| `src/data/logos.ts` | Bandeau de logos (employeurs et clients) |

Ajouter un logo client : placer le fichier dans `public/logos/clients/`, puis renseigner `src`, `width` et `height` dans `clientLogos` (`src/data/logos.ts`). Sans `src`, le nom est composé en typographie.

## Déploiement sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`.

1. Pousser le projet sur le dépôt `265nathantogolo/265nathantogolo.github.io` (site utilisateur, servi à la racine : `basePath` vide).
2. Dans le dépôt : Settings › Pages › Source : **GitHub Actions**.
3. Pousser sur `main` ; le site est en ligne sur https://265nathantogolo.github.io/.

Pour un dépôt de projet (ex. `portfolio`, servi sur `/portfolio`), créer la variable de dépôt `NEXT_PUBLIC_BASE_PATH=/portfolio` (Settings › Secrets and variables › Actions › Variables) et `NEXT_PUBLIC_SITE_URL` si l'URL change.

Les anciennes adresses du portfolio précédent (`/#/projets/europcar`, `/#/profil`…) sont redirigées automatiquement vers les nouvelles pages.

## Notes techniques

- `next.config.ts` : `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, `basePath` lu dans `NEXT_PUBLIC_BASE_PATH`.
- `scripts/fix-export-segments.mjs` (lancé après `npm run build`) : Next 16.4 écrit les fichiers de préchargement par segment dans des sous-dossiers alors que le navigateur les demande à plat ; le script crée les copies attendues pour éviter des 404.
- Le filtre SVG de l'effet « verre liquide » est rendu une seule fois, dans `src/app/layout.tsx`.
- Toutes les animations respectent `prefers-reduced-motion` : bandeau de logos en grille statique, accordéon sans élargissement, apparitions désactivées.

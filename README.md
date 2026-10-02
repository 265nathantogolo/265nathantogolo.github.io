# Portfolio — Nathan Togolo

Site React + TypeScript (Vite), Tailwind pour le composant Liquid Glass, aucune autre dépendance d'animation.

## Lancer le site

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173.

## Mettre en ligne

### GitHub Pages (automatique)

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`.

1. Créer un dépôt **public** vide sur github.com (sans README ni .gitignore).
2. Pousser le projet :
   ```bash
   git remote add origin https://github.com/<pseudo>/<depot>.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. Suivre le déploiement dans l'onglet **Actions**. Le site est ensuite en ligne à `https://<pseudo>.github.io/<depot>/`
   (ou `https://<pseudo>.github.io/` si le dépôt s'appelle `<pseudo>.github.io`).

Pour mettre à jour le site : `git add -A`, `git commit -m "…"`, `git push`.

### Autre hébergeur

```bash
npm run build
```

Le dossier `dist/` est un site statique complet (chemins relatifs, routes en `#/…`) : il se dépose tel quel sur Netlify (glisser-déposer), Vercel ou n'importe quel hébergeur.

## Modifier le contenu

| Quoi | Où |
| --- | --- |
| Textes, livrables, compétences des projets | `src/data/projects.ts` |
| Expériences, formation, compétences, outils, passions, contact | `src/data/profile.ts` |
| Catégories (les 5 compétences du CV) | `src/data/categories.ts` |
| Images | dossier « Images Portfolio », puis `npm run media` |

Les images sont reconnues par leur préfixe `NN-MM` (projet NN, image MM) et converties en WebP dans `public/media/`.
Pour un autre dossier source : `npm run media -- "C:\chemin\vers\Images Portfolio"`.

## Sources et règles suivies

- **index.html (gabarit)** : structure éditoriale du profil, dans le même ordre — 01 Expériences, 02 Mon histoire, 03 Compétences (soft / hard skills), 04 Outils & logiciels, 05 Passions. Le gabarit ne contient pas de catégories de projets : les projets sont donc classés selon les **cinq compétences du CV**, qui correspondent à sa section « Compétences ».
- **Ringer Studio** : principes repris et réinterprétés (grille à marges proportionnelles, très grands titres, petites étiquettes en capitales, en-tête en mode « difference », curseur contextuel, apparitions masquées, pied de page révélé, bouton « projet suivant » flottant). L'identité visuelle vient du CV : papier, encre, bleu électrique, rouge pour la recherche d'alternance, signature « Nathan » vectorisée.
- **Images Portfolio** : seule source visuelle. `10-02` est un doublon de `10-01` ; `11-01` (avatar) illustre le profil ; la signature est tirée de l'affiche Bentley.
- **CV (PDF)** : seule source pour le profil. Rien n'a été ajouté.

## À compléter si tu le souhaites

- Année, contexte (école, client, stage…) et rôle de chaque projet : absents des sources, donc non affichés.
- Le CV montre un quatrième logo dans « Outils IA » que je n'ai pas identifié avec certitude : à ajouter dans `src/data/profile.ts`.

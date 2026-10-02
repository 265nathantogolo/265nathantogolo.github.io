/**
 * Taxonomie des projets.
 *
 * index.html (gabarit de référence) ne contient pas de catégories de projets :
 * sa classification est celle des sections du profil, dont « Compétences ».
 * Les projets sont donc classés selon les cinq compétences listées dans le CV,
 * dans le même ordre et avec les mêmes intitulés.
 */
export type CategoryId = "benchmark" | "creation" | "reseaux" | "campagnes" | "copywriting";

export type Category = {
  id: CategoryId;
  /** intitulé exact du CV */
  label: string;
  /** libellé court pour les filtres */
  short: string;
  /** détail tel qu'il figure dans le CV */
  detail: string;
};

export const categories: Category[] = [
  {
    id: "benchmark",
    label: "Benchmark",
    short: "Benchmark",
    detail: "Veille, analyse concurrentielle, SWOT, PESTEL, mapping de positionnement",
  },
  {
    id: "creation",
    label: "Création graphique",
    short: "Création graphique",
    detail: "Design vectoriel, élaboration de charte graphique et de logo, création de supports visuels",
  },
  {
    id: "reseaux",
    label: "Gestion de communauté RS",
    short: "Réseaux sociaux",
    detail: "Community management sur Instagram, Facebook et LinkedIn, analyse et reporting",
  },
  {
    id: "campagnes",
    label: "Création de campagnes publicitaires",
    short: "Campagnes",
    detail: "Via les outils Meta Ads, Google Ads et LinkedIn Ads",
  },
  {
    id: "copywriting",
    label: "Conception rédaction et copywriting",
    short: "Copywriting",
    detail: "Rédaction de posts, naming, création de slogans",
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>;

export function isCategoryId(value: string | null): value is CategoryId {
  return value !== null && value in categoryById;
}

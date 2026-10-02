/**
 * Source : « CV NathanTOGOLO 1 CC.pdf ». Rien d'autre.
 * L'ordre des sections reprend celui du gabarit index.html :
 * 01 Expériences · 02 Mon histoire · 03 Compétences · 04 Outils & logiciels · 05 Passions
 */

export const identity = {
  firstName: "Nathan",
  lastName: "Togolo",
  greeting: "Bonjour",
  wave: "👋🏾",
  greetingEnd: "je suis",
  search: "Je suis à la recherche d'une alternance en tant que chargé de communication.",
  school: "Sup de Pub",
  program: "Bachelor en Stratégie des Marques et Communication",
  programYears: "2023 — 2027",
};

export const contact = {
  email: "265nathan.togolo@gmail.com",
  phone: "07 69 39 64 81",
  phoneHref: "tel:+33769396481",
  cv: "cv-nathan-togolo.pdf",
};

export type Experience = {
  org: string;
  period: string;
  kind: string;
  role: string;
  clients?: string[];
  missions: string[];
};

export const experiences: Experience[] = [
  {
    org: "Havas Paris — L'Agence Verte",
    period: "6 mois",
    kind: "Stage",
    role: "Assistant consultant et chargé de contenu",
    clients: ["Enedis", "La Banque Postale", "Rexel", "Parisanté Campus", "L'Oréal", "Société des Grands Projets"],
    missions: [
      "Création de formats éditoriaux pour des clients",
      "Participation à la réflexion des stratégies de communication RSE",
      "Veille, benchmarking, création de newsletter",
      "Maintenance du site internet sous WordPress",
      "Création de contenu sur LinkedIn",
      "Création de supports de présentation et de communication interne",
    ],
  },
  {
    org: "Agence Workly",
    period: "Mai — Août 2025",
    kind: "Stage",
    role: "Chargé de communication réseaux sociaux",
    missions: [
      "Création de contenu sur Instagram, Facebook et LinkedIn",
      "Création de supports de présentation et de communication interne",
    ],
  },
  {
    org: "Forum du commerce durable",
    period: "2025",
    kind: "Mission",
    role: "Chargé de communication",
    missions: [
      "Gestion de la page LinkedIn et création d'une campagne publicitaire LinkedIn Ads",
      "Soutien à l'organisation événementielle du forum",
    ],
  },
];

export type Education = { years: string; title: string; school: string; subjects: string };

/** ordre chronologique, pour raconter le parcours */
export const education: Education[] = [
  {
    years: "2021",
    title: "Bac Sciences et Techniques du Management et de la Gestion, section anglais européen",
    school: "Lycée Claude B.",
    subjects: "",
  },
  {
    years: "2021 — 2023",
    title: "L2 Droit, option Sciences économiques",
    school: "Université Lyon 2",
    subjects: "Droit privé, droit public, microéconomie, macroéconomie",
  },
  {
    years: "2023 — 2027",
    title: "Bachelor en Stratégie des Marques et Communication",
    school: "Sup de Pub",
    subjects: "Communication, branding, création graphique, community management",
  },
];

export const softSkills = ["Créativité", "Curiosité", "Aisance orale", "Esprit critique", "Sociabilité"];

/** niveaux CECRL ; le CV ne précise pas de niveau pour le français (barre pleine) */
export const languages: { name: string; level: string | null; steps: number }[] = [
  { name: "Français", level: null, steps: 6 },
  { name: "Anglais", level: "C1", steps: 5 },
  { name: "Espagnol", level: "B1", steps: 3 },
];

export const tools: { group: string; items: string[] }[] = [
  {
    group: "Création",
    items: ["Canva", "Photoshop", "Lightroom", "Illustrator", "Premiere Pro", "Figma", "WordPress"],
  },
  {
    // le CV montre un quatrième logo d'outil IA, non identifié avec certitude : à compléter
    group: "Outils IA",
    items: ["ChatGPT", "Claude", "Ideogram"],
  },
  {
    group: "Outils Ads",
    items: ["Meta Ads", "Google Ads", "LinkedIn Ads"],
  },
  {
    group: "Suite Office",
    items: ["Word", "Excel", "PowerPoint"],
  },
];

export const interests = ["Philosophie", "Boxe", "Dessin", "Cinéma", "Astronomie"];

export const profileSections = [
  { id: "experiences", num: "01", title: "Expériences" },
  { id: "histoire", num: "02", title: "Mon histoire" },
  { id: "competences", num: "03", title: "Compétences" },
  { id: "outils", num: "04", title: "Outils & logiciels" },
  { id: "passions", num: "05", title: "Passions" },
] as const;

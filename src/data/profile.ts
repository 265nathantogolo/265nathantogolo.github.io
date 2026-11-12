// Contenu du CV : « CV_Nathan_Togolo_2026.pdf » (le plus complet) et
// « CV NathanTOGOLO 1 CC.pdf » (hard skills, soft skills). Logos : dossier « Logos CV ».

export type Experience = {
  id: string;
  company: string;
  role: string;
  type: "Stage" | "Mission";
  period: string;
  /** Identifiant du logo dans le manifeste d'images ; absent = logo manquant. */
  logo?: string;
  logoAlt?: string;
  clients?: string[];
  missions: string[];
};

export const experiences: Experience[] = [
  {
    id: "agence-verte",
    company: "Havas Paris · L'Agence Verte",
    role: "Assistant consultant et chargé de contenu",
    type: "Stage",
    period: "Janvier 2026 · 6 mois",
    logo: "logos/havas",
    logoAlt: "Logo Havas",
    clients: ["Enedis", "La Banque Postale", "Rexel", "PariSanté Campus", "L'Oréal", "Société des Grands Projets"],
    missions: [
      "Création de formats éditoriaux pour des clients : posts LinkedIn, newsletters, formats innovants",
      "Participation à la réflexion des stratégies de communication RSE",
      "Veille, benchmarking, création de newsletter",
      "Maintenance du site internet sous WordPress",
      "Création de contenu sur LinkedIn",
      "Création de supports de présentation et de communication interne",
    ],
  },
  {
    id: "workly",
    company: "Agence Workly",
    role: "Chargé de communication réseaux sociaux",
    type: "Stage",
    period: "Mai à août 2025",
    logo: "logos/workly",
    logoAlt: "Logo Workly",
    missions: [
      "Création de contenu sur Instagram, Facebook et LinkedIn",
      "Création de supports de présentation et de communication interne",
    ],
  },
  {
    id: "forum-commerce-durable",
    company: "Forum du Commerce Durable",
    role: "Chargé de communication",
    type: "Mission",
    period: "Janvier 2025",
    logo: "logos/forum-commerce-durable",
    logoAlt: "Logo du Forum du Commerce Durable",
    missions: [
      "Gestion de la page LinkedIn et création d'une campagne publicitaire LinkedIn Ads",
      "Soutien à l'organisation événementielle du forum",
    ],
  },
  {
    id: "havas-people",
    company: "Havas People",
    role: "Assistant communication interne et corporate",
    type: "Stage",
    period: "Mai à juillet 2024",
    logo: "logos/havas-people",
    logoAlt: "Logo Havas People",
    clients: ["GBH", "Orange", "Bel", "Harmonie Mutuelle", "ALDI"],
    missions: [
      "Stratégies de communication interne",
      "Participation à la création d'événements d'entreprise : business games, workshops, ateliers corporate",
      "Création de supports de présentation et de communication interne",
      "Veille stratégique",
    ],
  },
];

export type Education = {
  id: string;
  period: string;
  degree: string;
  school: string;
  place?: string;
  details?: string;
  logo?: string;
  logoAlt?: string;
};

// Ordre chronologique, comme « Mon histoire » sur l'ancien site.
export const education: Education[] = [
  {
    id: "bac",
    period: "2021",
    degree: "Bac Sciences et Techniques du Management et de la Gestion, section anglais européen",
    school: "Lycée Claude B.",
  },
  {
    id: "lyon-2",
    period: "2021-2023",
    degree: "L2 Droit, option Sciences économiques",
    school: "Université Lyon 2",
    place: "Lyon",
    details: "Droit privé, droit public, microéconomie, macroéconomie",
    logo: "logos/universite-lyon-2",
    logoAlt: "Logo de l'Université Lumière Lyon 2",
  },
  {
    id: "sup-de-pub",
    period: "2023-2027",
    degree: "Bachelor en Stratégie des Marques et Communication",
    school: "Sup de Pub",
    place: "Paris",
    details: "Stratégies de communication, branding, création graphique, community management",
    logo: "logos/sup-de-pub",
    logoAlt: "Logo Sup de Pub",
  },
];

export const softSkills = ["Créativité", "Curiosité", "Aisance orale", "Esprit critique", "Sociabilité"];

export const languages = [
  { name: "Français", level: "Langue maternelle", rank: 6 },
  { name: "Anglais", level: "C1", rank: 5 },
  { name: "Espagnol", level: "B1", rank: 3 },
];

export const cefr = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const tools = [
  { group: "Création", items: ["Canva", "Photoshop", "Lightroom", "Illustrator", "Premiere Pro", "Figma", "WordPress"] },
  {
    group: "Outils IA",
    items: ["ChatGPT", "Claude", "Midjourney", "Nano Banana"],
    note: "Création d'application, code, gestion d'IA agentique, création audiovisuelle",
  },
  { group: "Outils Ads", items: ["Meta Ads", "Google Ads", "LinkedIn Ads"] },
  { group: "Suite Office", items: ["Word", "Excel", "PowerPoint"] },
];

// Passions : cartes typographiques avec pictogramme (plus d'avatars).
// Le cinéma renvoie au projet Cineman.
export const passions: { name: string; href?: string }[] = [
  { name: "Philosophie" },
  { name: "Boxe" },
  { name: "Dessin" },
  { name: "Cinéma", href: "/projets/cineman/" },
  { name: "Astronomie" },
];

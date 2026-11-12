// Coordonnées et accroche : CV (PDF 2026 et CV CC) + lien LinkedIn fourni.
export const site = {
  name: "Nathan Togolo",
  title: "Brand Strategy & Communication",
  /** Ligne de positionnement (hero, métadonnées), en français. */
  baseline: "Stratégie de marque & communication.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://265nathantogolo.github.io",
  school: "Sup de Pub",
  schoolYears: "2023-2027",
  // Mention de l'alternance : une seule fois, discrète, dans la nav, puis sur Contact.
  availability: "Disponible · Alternance 2026",
  search: "Je suis à la recherche d'une alternance en tant que chargé de communication.",
  email: "265nathan.togolo@gmail.com",
  phone: "07 69 39 64 81",
  phoneHref: "tel:+33769396481",
  linkedin: "https://www.linkedin.com/in/nathan-togolo%F0%9F%8C%90-60341a1aa/",
  // Seul fichier téléchargeable : « CV NathanTOGOLO 1 CC ».
  cv: "/cv/cv-nathan-togolo.pdf",
  cvDownloadName: "CV Nathan Togolo.pdf",
} as const;

export const nav = [
  { href: "/", label: "Accueil" },
  { href: "/projets/", label: "Projets" },
  { href: "/profil/", label: "À propos de moi" },
  { href: "/contact/", label: "Contact" },
] as const;

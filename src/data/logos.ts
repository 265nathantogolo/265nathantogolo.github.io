import { asset, imageSrc, imageMeta } from "@/lib/images";
import type { Logo } from "@/components/ui/logo-marquee";

// Employeurs et missions : logos du dossier « Logos CV » (icônes carrées).
function cvLogo(id: string, alt: string): Logo {
  const { w, h } = imageMeta(id);
  return { src: imageSrc(id, 256), alt, width: w, height: h, kind: "app" };
}

export const employerLogos: Logo[] = [
  cvLogo("logos/havas", "Havas Paris · L'Agence Verte"),
  cvLogo("logos/havas-people", "Havas People"),
  cvLogo("logos/workly", "Agence Workly"),
  cvLogo("logos/forum-commerce-durable", "Forum du Commerce Durable"),
];

// Clients (CV 2026) : L'Agence Verte puis Havas People. Logos téléchargés sur
// Wikimedia Commons et Wikipédia (fr) avec l'accord de Nathan, dans public/logos/clients.
// Dimensions = viewBox des SVG (Enedis : WebP converti depuis le PNG).
function clientLogo(file: string, alt: string, width: number, height: number, kind: Logo["kind"]): Logo {
  return { src: asset(`/logos/clients/${file}`), alt, width, height, kind };
}

export const clientLogos: Logo[] = [
  clientLogo("enedis.webp", "Enedis", 750, 160, "wordmark"),
  clientLogo("la-banque-postale.svg", "La Banque Postale", 262, 182, "mark"),
  clientLogo("rexel.svg", "Rexel", 148, 57, "wordmark"),
  clientLogo("parisante-campus.svg", "PariSanté Campus", 114, 27, "wordmark"),
  clientLogo("loreal.svg", "L'Oréal", 800, 145, "wordmark"),
  clientLogo("societe-des-grands-projets.svg", "Société des Grands Projets", 284, 159, "mark"),
  clientLogo("gbh.svg", "GBH", 185, 56, "wordmark"),
  clientLogo("orange.svg", "Orange", 284, 284, "mark"),
  clientLogo("bel.svg", "Bel", 73, 74, "mark"),
  clientLogo("harmonie-mutuelle.svg", "Harmonie Mutuelle", 158, 239, "mark"),
  clientLogo("aldi.svg", "ALDI", 284, 298, "mark"),
];

/** Alterne employeurs et clients pour un bandeau équilibré. */
export const marqueeLogos: Logo[] = clientLogos.reduce<Logo[]>((list, client, i) => {
  if (i % 3 === 0 && employerLogos[i / 3]) list.push(employerLogos[i / 3]);
  list.push(client);
  return list;
}, []);

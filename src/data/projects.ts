import media from "./media.json";
import type { CategoryId } from "./categories";

/**
 * Les textes ne décrivent que ce qui est visible dans les images fournies
 * (supports, typographie, couleurs, textes présents sur les visuels).
 * Aucune année, aucun client ni contexte n'est indiqué : ils ne figurent pas dans les sources.
 * Pour en ajouter, compléter les champs ci-dessous — l'interface les affichera.
 */

export type MediaItem = {
  index: string;
  src: string;
  width: number;
  height: number;
  small: number | null;
  color: string;
};

export type ProjectImage = MediaItem & { alt: string; ratio: number };

export type Project = {
  slug: string;
  number: string;
  title: string;
  categories: CategoryId[];
  summary: string;
  description: string[];
  deliverables: string[];
  /** index (« 01 », « 02 »…) de l'image de couverture */
  cover: string;
  images: ProjectImage[];
};

type ProjectSource = Omit<Project, "images"> & { alts: string[] };

const sources: ProjectSource[] = [
  {
    slug: "joon",
    number: "01",
    title: "Joon",
    categories: ["creation"],
    summary: "Identité visuelle et carte d'un restaurant.",
    description: [
      "Joon repose sur un logotype aux lettres déformées, décliné en motif de lignes concentriques. Un vert profond et un blanc cassé structurent tous les supports, du sac kraft à la carte.",
      "La carte compte quatre pages : entrées, plats, tapas et desserts. Chacune affiche son titre en très grand, à la verticale, et associe la liste des plats à une photo prise du dessus. Certaines pages sont présentées en deux états, avec et sans les prix.",
    ],
    deliverables: ["Logotype", "Motif graphique", "Packaging (sac kraft)", "Carte en quatre pages"],
    cover: "01",
    alts: [
      "Logotype Joon en blanc sur le motif de lignes vertes",
      "Motif de lignes concentriques, vert sur vert",
      "Couverture de carte vert foncé avec le logotype Joon",
      "Sac kraft imprimé du logotype Joon",
      "Page Entrées de la carte, version sans prix",
      "Page Entrées de la carte, version avec prix",
      "Page Plats de la carte, version sans prix",
      "Page Plats de la carte, version avec prix",
      "Page Tapas de la carte",
      "Page Desserts de la carte",
    ],
  },
  {
    slug: "dauphin-piscine",
    number: "02",
    title: "Dauphin Piscine",
    categories: ["creation"],
    summary: "Logo et supports de communication.",
    description: [
      "Un logo rond : un dauphin plonge dans une vague, en camaïeu de bleus. Il signe une bannière promotionnelle pour la Foire de printemps, posée sur une photo de piscine.",
      "Le logo est aussi mis en situation sur un ballon et sur une serviette, où des lignes ondulées prolongent l'univers de l'eau.",
    ],
    deliverables: ["Logo", "Bannière « Foire de printemps »", "Mises en situation (ballon, serviette)"],
    cover: "02",
    alts: [
      "Logo Dauphin Piscine : un dauphin et une vague dans un cercle bleu",
      "Bannière « Foire de printemps — Venez découvrir nos offres » sur une photo de piscine",
      "Ballon imprimé du logo Dauphin Piscine",
      "Serviette pliée à motif de lignes ondulées, avec le logo",
    ],
  },
  {
    slug: "crimson-ale",
    number: "03",
    title: "Crimson Ale",
    categories: ["creation"],
    summary: "Étiquettes et packaging d'une bière à l'hibiscus.",
    description: [
      "Crimson Ale est une « Hibiscus Beer » déclinée en deux versions, Red et White. L'étiquette associe une typographie condensée aux formes arrondies, une fleur d'hibiscus dessinée et une bordure à motifs.",
      "D'une version à l'autre, les couleurs s'inversent : crème sur fond rouge pour la Red, rouge sur fond crème pour la White. Les étiquettes sont mises en situation sur des bouteilles, avec un bandeau horizontal.",
    ],
    deliverables: ["Étiquette Red version", "Étiquette White version", "Bandeau", "Mises en situation"],
    cover: "04",
    alts: [
      "Étiquette Crimson Ale Red version : typographie crème sur fond rouge, fleur d'hibiscus rouge",
      "Étiquette Crimson Ale White version : typographie rouge sur fond crème, fleur d'hibiscus jaune pâle",
      "Bandeau horizontal Crimson Ale White version",
      "Quatre bouteilles des deux versions devant le nom Crimson Ale en très grand",
      "Bouteille Red version à côté d'un verre de bière rouge",
      "Bouteille Red version et verre, autre cadrage",
      "Gros plan sur deux bouteilles White version",
      "Gros plan sur deux bouteilles Red version",
    ],
  },
  {
    slug: "europcar",
    number: "04",
    title: "Europcar",
    categories: ["campagnes", "creation", "reseaux", "copywriting"],
    summary: "Campagne multisupport autour de la signature « Le moteur de vos moments de vie ».",
    description: [
      "Le projet part d'une signature, « Le moteur de vos moments de vie », et d'une palette de verts qui monte jusqu'au vert fluo. Elle se décline en covering de véhicule, en affichage et en tote bags.",
      "Le ton est direct et familier. Sur un quai de gare : « On est à 2min… Enfin bref, on est partout. » Sur un dépliant-carte baptisé europcarte : « Bon, t'embête pas. » Chaque tote bag porte sa propre phrase, comme « Le sac qui prend toujours la mauvaise sortie ».",
      "Côté digital : une page d'accueil de site, des posts et carrousels Instagram, une mise en situation du profil et un visuel de Noël.",
    ],
    deliverables: [
      "Signature et palette",
      "Covering véhicule",
      "Affichage",
      "Tote bags",
      "Dépliant « europcarte »",
      "Page d'accueil du site",
      "Posts et carrousels Instagram",
      "Visuel de Noël",
    ],
    cover: "04",
    alts: [
      "Logo Europcar, palette de verts et signature « Le moteur de vos moments de vie »",
      "Pick-up vert sombre avec le logo Europcar en vert fluo",
      "Pick-up vert sombre, variante du covering",
      "Affiche sur un quai de gare : « On est à 2min… Enfin bref, on est partout. »",
      "Panneau mural : « On vous suit dans toutes vos aventures »",
      "Quatre tote bags verts portant chacun une phrase différente",
      "Dépliant-carte europcarte : carte de France et « Bon, t'embête pas. »",
      "Page d'accueil du site sur un ordinateur portable",
      "Post Instagram et carrousel « Saint-Brieuc »",
      "Posts Instagram « Nos jeux préférés », « Qui suis-je » et « Le blindtest »",
      "Grille de six posts Instagram",
      "Mise en situation du profil Instagram Europcar",
      "Visuel de Noël : le Père Noël devant une camionnette Europcar",
    ],
  },
  {
    slug: "cineman",
    number: "05",
    title: "Cineman",
    categories: ["reseaux", "creation"],
    summary: "Identité et contenus Instagram sur le cinéma, les séries et le manga.",
    description: [
      "Cineman parle de cinéma, de séries et de manga. Le logotype, en volume jaune et blanc, est posé sur un personnage dessiné ; il se réduit en monogramme CM pour signer chaque publication.",
      "Les formats verticaux suivent une même grammaire : un surtitre en capitales sur un bandeau jaune, une accroche en très grand, le monogramme en bas de l'image. Les sujets vont du transhumanisme dans le manga aux biopics, en passant par Hellboy, Sons of Anarchy ou Gunnm.",
    ],
    deliverables: ["Logotype et monogramme", "Posts", "Formats verticaux"],
    cover: "01",
    alts: [
      "Logotype Cineman en volume sur un personnage de comics bleu, fond jaune",
      "Illustration du personnage seule, sans logotype",
      "Post « Qu'est-ce que le transhumanisme ? »",
      "Post sur le transhumanisme, avec une case de manga",
      "Format vertical « L'amour… Sons of Anarchy… et la mort »",
      "Format vertical « X-Men : les mutants Omega les plus dangereux »",
      "Format vertical « Focus sur… Brad Pitt, ses meilleurs rôles »",
      "Format vertical « La malédiction de Hellboy »",
      "Format vertical « Le meilleur film d'horreur de tous les temps ? »",
      "Format vertical « Les meilleurs live action »",
      "Format vertical « Les persos les plus stylés de Bleach »",
      "Format vertical « Les pires live action »",
      "Format vertical « Le meilleur manga : Gunnm ? »",
      "Format vertical « 3 excellents biopics »",
    ],
  },
  {
    slug: "les-watchers",
    number: "06",
    title: "Les Watchers",
    categories: ["reseaux", "creation"],
    summary: "Compte Instagram consacré à l'horlogerie.",
    description: [
      "Les Watchers se présente comme « l'horlogerie nouvelle génération » : news, classiques et pépites horlogères, « pour ceux qui gardent un œil sur le temps qui passe ». Le logo est un W blanc sur fond rouge.",
      "Les carrousels sont rangés en rubriques — Classics Review, Brands, Actus — avec un traitement commun : titres massifs en capitales, italiques, montres en gros plan, invitation à swiper. L'histoire de la Santos de Cartier sert d'exemple de carrousel complet.",
    ],
    deliverables: ["Logo", "Carrousels Instagram", "Mises en situation du profil"],
    cover: "02",
    alts: [
      "Logo Les Watchers : W blanc sur fond rouge",
      "Carrousel Classics Review : Cartier Santos",
      "Carrousel Brands : la maison Patek Philippe, 1/3",
      "Carrousel Actus : 7 actualités de la semaine du 24/3",
      "Profil Instagram Les Watchers sur un smartphone, fond noir",
      "Profil Instagram sur smartphone, fond rouge avec une montre",
      "Mise en situation verticale du profil",
      "Mise en situation horizontale du profil",
      "Mise en situation large du profil sur fond rouge",
      "Profil Instagram en plein écran",
      "Exemple de carrousel : l'histoire de la Santos de Cartier",
    ],
  },
  {
    slug: "dr-gi",
    number: "07",
    title: "Dr GI",
    categories: ["reseaux"],
    summary: "Posts Instagram de vulgarisation scientifique.",
    description: [
      "Dr GI pose des questions de science du quotidien : pourquoi le piment pique, comment on a inventé le micro-onde, pourquoi les bananes sont radioactives, ce qu'est l'effet placebo.",
      "Chaque visuel suit la même recette : une illustration au grain rétro, une question en capitales colorées, une salve de points d'interrogation et, en bas à droite, le même personnage en blouse blanche, bras croisés. Une bannière présente l'univers du compte.",
    ],
    deliverables: ["Bannière", "Posts Instagram"],
    cover: "05",
    alts: [
      "Bannière : microscope, planète et smartphone affichant le profil, à côté du personnage en blouse",
      "Post « L'humanité dans un paquet de chewing-gum ??? »",
      "Post « Comment on a inventé le micro-onde ??? »",
      "Post « Ces bactéries feraient 100x la masse de la Terre ??? »",
      "Post « Pourquoi les bananes sont radioactives ??? »",
      "Post « Qu'est-ce que l'effet placebo ??? »",
      "Post sur l'effet placebo, variante de cadrage",
      "Post « Pourquoi le piment pique-t-il ??? », 2/2",
      "Post « Pourquoi le piment pique-t-il ??? », 1/2",
    ],
  },
  {
    slug: "retromarketing",
    number: "08",
    title: "Retromarketing",
    categories: ["benchmark"],
    summary: "Présentation de veille sur le rétromarketing.",
    description: [
      "Une présentation consacrée au rétromarketing, une stratégie fondée sur la nostalgie et la réappropriation des codes du passé.",
      "Le déroulé suit l'histoire de la tendance : premières théories dans les années 1980, émergence dans les années 1990, puis cycles de nostalgie raccourcis par TikTok et Instagram. Suivent des exemples récents — Spotify, l'équipe de France, Citroën DS, Bonne Maman, Intermarché, Five Guys — et une ouverture sur l'avenir de la tendance.",
      "La mise en page joue avec son sujet : grands titres condensés, scripts manuscrits, palette orange brique et crème, objets iconiques comme le Polaroid, le vinyle ou l'Air Jordan.",
    ],
    deliverables: ["Présentation en 8 slides"],
    cover: "01",
    alts: [
      "Slide « Histoire de la tendance » avec un appareil Polaroid",
      "Slide « Évolution de la tendance » : « C'était mieux avant » et cycles de nostalgie",
      "Slide « Nostalgie » : affiche Air Jordan et repères 1980-2000",
      "Slide « Exemples modernes » avec une Air Jordan 1",
      "Planche de références rétromarketing : Burger King, Renault, Intermarché…",
      "Slide d'exemples : Burberry, Burger King, Renault, tendance Y2K, Intermarché, Five Guys",
      "Slide d'exemples : Spotify, équipe de France, Citroën DS, Bonne Maman",
      "Slide « L'avenir ? » avec une bouteille Coca-Cola et un vinyle",
    ],
  },
  {
    slug: "waiting-for-a-sign",
    number: "09",
    title: "If you're waiting for a sign",
    categories: ["creation"],
    summary: "Série de quatre affiches automobiles signées.",
    description: [
      "Quatre affiches, quatre voitures : une Porsche 911, une BMW, une Ferrari F40 et une Bentley Continental GT. Toutes reprennent la même accroche — « If you're waiting for a sign… this is it. » — et la même signature manuscrite.",
      "Le nom de chaque marque change de typographie : graffiti, capitales géantes, serif, script. Il passe devant ou derrière la voiture pour dialoguer avec la photo.",
    ],
    deliverables: ["Série de 4 affiches"],
    cover: "03",
    alts: [
      "Affiche Porsche 911 : voiture grise en bord de mer, nom en graffiti rouge",
      "Affiche BMW : voiture de course orange devant un garage, nom en capitales blanches géantes",
      "Affiche Ferrari F40 : voiture rouge sur un chemin de lavande, nom en serif lilas",
      "Affiche Bentley Continental GT : voiture verte, nom en script rouge",
    ],
  },
  {
    slug: "affiche-bleach",
    number: "10",
    title: "Affiche Bleach",
    categories: ["creation"],
    summary: "Affiche de concert pour la bande originale de Bleach.",
    description: [
      "Affiche d'un concert de la bande originale de Bleach — The Blood Warfare — par un orchestre symphonique, à l'Amphithéâtre 3000 de la Cité Internationale, le 22/11/24.",
      "Deux silhouettes noires sur un aplat jaune : un personnage minuscule au centre, une figure immense en bas qui porte le titre. Le gothique rouge du mot « Concert » répond à la linéale condensée de « The Blood Warfare ».",
    ],
    deliverables: ["Affiche"],
    cover: "01",
    alts: ["Affiche jaune du concert Bleach : The Blood Warfare, deux silhouettes noires"],
  },
];

const mediaBySlug = media as Record<string, MediaItem[]>;

export const projects: Project[] = sources.map(({ alts, ...p }) => ({
  ...p,
  images: (mediaBySlug[p.slug] || []).map((m, i) => ({
    ...m,
    alt: alts[i] || `${p.title} — visuel ${m.index}`,
    ratio: m.width / m.height,
  })),
}));

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>;

export function coverOf(p: Project): ProjectImage {
  return p.images.find((i) => i.index === p.cover) || p.images[0];
}

export function nextProject(p: Project): Project {
  const i = projects.indexOf(p);
  return projects[(i + 1) % projects.length];
}

/**
 * Sélection de la page d'accueil : un projet par compétence du CV
 * (campagnes, création graphique, réseaux sociaux, benchmark).
 */
export const featured: { slug: string; images: string[]; layout: "wide" | "pair" | "trio" | "split" }[] = [
  { slug: "europcar", images: ["04", "07"], layout: "wide" },
  { slug: "joon", images: ["01", "05"], layout: "pair" },
  { slug: "cineman", images: ["01", "08", "07"], layout: "trio" },
  { slug: "retromarketing", images: ["01", "03"], layout: "split" },
];

export const avatar = mediaBySlug["profil"]?.[0];
